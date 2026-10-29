import { beforeEach, describe, expect, it } from "vitest";
import { DEMO_PEOPLE } from "./demo-people";
import {
  act,
  createStore,
  createSubmission,
  documentRecord,
  updateConfig,
  libraryFor,
  listSubmissions,
  notificationsFor,
  replacementOptions,
  ServiceError,
  type PublishingStore,
} from "./service";

const staff = DEMO_PEOPLE.staff;
const partner = DEMO_PEOPLE.partner;
const manager = DEMO_PEOPLE.manager;
const NOW = "2026-10-28T10:00:00.000Z";

let store: PublishingStore;
beforeEach(() => {
  store = createStore();
});

describe("createSubmission", () => {
  it("routes the submission to the department's lead partner", () => {
    const sub = createSubmission(store, staff, { title: "Remote work policy", description: "Draft", department: "HR", docType: "Policy" }, NOW);
    expect(sub.status).toBe("submitted");
    expect(sub.responsiblePartner).toBe("Nolan Reyes");
    expect(listSubmissions(store, staff, "mine").map((s) => s.id)).toContain(sub.id);
  });

  it("rejects an unknown department or type", () => {
    expect(() =>
      createSubmission(store, staff, { title: "X", description: "", department: "Legal", docType: "Policy" }, NOW),
    ).toThrow(ServiceError);
    expect(() => createSubmission(store, staff, { title: "X", description: "", department: "HR", docType: "Memo" }, NOW)).toThrow(
      ServiceError,
    );
  });
});

describe("queues", () => {
  it("shows the review queue to partners only and the publish queue to managers only", () => {
    expect(listSubmissions(store, partner, "review").length).toBeGreaterThan(0);
    expect(() => listSubmissions(store, staff, "review")).toThrow(ServiceError);
    expect(listSubmissions(store, manager, "publish").every((s) => s.status === "approved")).toBe(true);
    expect(() => listSubmissions(store, partner, "publish")).toThrow(ServiceError);
  });
});

describe("publishing", () => {
  function approved() {
    const sub = createSubmission(
      store,
      staff,
      { title: "Vacation policy update", description: "Carry-over", department: "HR", docType: "Policy" },
      NOW,
    );
    return act(store, partner, sub.id, { type: "approve", note: "Approved at partners' meeting" }, NOW);
  }

  it("builds the name on the server, bumps the version and supersedes the old document", () => {
    const sub = approved();
    const old = replacementOptions(store, "HR").find((o) => o.title === "Vacation Policy");
    expect(old).toBeDefined();
    const published = act(
      store,
      manager,
      sub.id,
      {
        type: "publish",
        details: {
          title: "Vacation Policy",
          docType: "Policy",
          effectiveDate: "2026-11",
          audience: "staff",
          changeNote: "Adds carry-over rules",
          replacesId: old!.id,
        },
      },
      NOW,
    );
    expect(published.publish?.version).toBe(old!.version + 1);
    expect(published.publish?.fileName).toBe(`HR_Policy_VacationPolicy_v${old!.version + 1}_2026-11`);
    expect(published.publish?.folder).toBe("HR / Published Documents");
    expect(store.submissions.get(old!.id)?.status).toBe("superseded");
    const names = libraryFor(store, "staff").map((d) => d.name);
    expect(names).toContain(published.publish?.fileName);
    expect(names.some((n) => n.includes(`_v${old!.version}_`))).toBe(false);
    expect(notificationsFor(store, "staff")[0]).toMatchObject({ submissionId: sub.id, changeNote: "Adds carry-over rules" });
  });

  it("hides partner-only publishes from staff in the library and notifications", () => {
    const sub = approved();
    act(
      store,
      manager,
      sub.id,
      {
        type: "publish",
        details: { title: "Partner Pay Bands", docType: "Policy", effectiveDate: "2026-11", audience: "partner", changeNote: "New bands" },
      },
      NOW,
    );
    expect(libraryFor(store, "staff").some((d) => d.id === sub.id)).toBe(false);
    expect(libraryFor(store, "partner").some((d) => d.id === sub.id)).toBe(true);
    expect(notificationsFor(store, "staff").some((n) => n.submissionId === sub.id)).toBe(false);
  });

  it("rejects a replacement from another department", () => {
    const sub = approved();
    const finance = replacementOptions(store, "Finance")[0];
    expect(() =>
      act(
        store,
        manager,
        sub.id,
        {
          type: "publish",
          details: { title: "X", docType: "Policy", effectiveDate: "2026-11", audience: "staff", changeNote: "", replacesId: finance.id },
        },
        NOW,
      ),
    ).toThrow(ServiceError);
  });
});

describe("updateConfig", () => {
  const base = () => ({
    docTypes: ["Policy", "Form"],
    namingTemplate: "{DEPT}-{TITLE}-v{VERSION}",
    defaultAudience: "manager" as const,
    aiEnabled: false,
    leadPartners: { HR: "Trevor Hale" },
  });

  it("lets a partner change the publishing rules", () => {
    const config = updateConfig(store, partner, base());
    expect(config.namingTemplate).toBe("{DEPT}-{TITLE}-v{VERSION}");
    expect(config.aiEnabled).toBe(false);
    expect(config.departments.find((d) => d.name === "HR")?.leadPartner).toBe("Trevor Hale");
  });

  it("is partner-only", () => {
    expect(() => updateConfig(store, manager, base())).toThrow(ServiceError);
  });

  it("rejects a bad template or bad type names", () => {
    expect(() => updateConfig(store, partner, { ...base(), namingTemplate: "{DEPT}" })).toThrow(/TITLE/);
    expect(() => updateConfig(store, partner, { ...base(), docTypes: ["Process Doc"] })).toThrow(ServiceError);
    expect(() => updateConfig(store, partner, { ...base(), docTypes: [] })).toThrow(ServiceError);
  });
});

describe("documentRecord", () => {
  it("returns who submitted, approved and published a visible document", () => {
    const record = documentRecord(store, "staff", "pub-hr-vacation");
    expect(record).toMatchObject({ version: 3, approvedBy: "Nolan Reyes", publishedBy: "Maya Chen" });
  });

  it("hides documents above the viewer's level", () => {
    store.submissions.get("pub-hr-vacation")!.publish!.audience = "partner";
    expect(() => documentRecord(store, "staff", "pub-hr-vacation")).toThrow(ServiceError);
  });
});

describe("notifications", () => {
  it("starts with the seeded publishes, newest first", () => {
    const notes = notificationsFor(store, "staff");
    expect(notes[0].submissionId).toBe("pub-ops-ticket");
  });
});
