# Feasibility and SharePoint Compatibility

Answers Eric's Meeting 4 questions (docs/DISCOVERY.md, Fourth Meeting Summary, sections 4, 6 and 7): which hub features SharePoint Online can't support, what a custom front end over SharePoint drives would need instead, and how much upkeep each option means for staff who aren't developers.

**Status of the claims below:** this was written from general knowledge of SharePoint Online, Microsoft 365 and Google Gemini, without checking current vendor documentation. Every claim about a vendor is marked **[check]** with the page to check it against. Before Meeting 5, someone should read each linked page and fill in the "Date checked" column of the source list at the end. Vendor features and prices change often.

## Options compared

- **SharePoint Online (out of the box):** a SharePoint communication site using built-in pages, web parts, lists and libraries, set up through the browser. No code.
- **SharePoint + SPFx:** the same site plus custom web parts or extensions built with the SharePoint Framework (SPFx). These need a developer to build them and to update them when Microsoft changes things.
- **Custom front end:** a separate web app (like this prototype) that signs users in with Microsoft Entra ID and reads documents from the existing SharePoint drives through Microsoft Graph. It needs a developer and hosting.

## Feature table

| Feature | SharePoint Online | Custom front end needs | Upkeep for non-developers |
|---|---|---|---|
| Tabs (Home, Search, Departments, Calendar, Help) | Built-in: site navigation (top menu) with one page per tab **[check: site navigation]** | Routing (already built here) | Low: edit menu links in the browser |
| Search with filters | Built-in Microsoft Search with filters on file type and modified date; department and folder filters need a library column or managed metadata **[check: Microsoft Search, search verticals]** | Graph search API plus a filter UI | Low if folders and columns are kept consistent |
| Table view (Name, Type, Department, Published, Last Update) | Built-in: document library list view with custom columns. "Published" needs its own date column **[check: library views]** | Graph drive item listing and a table | Low: views are edited in the browser |
| Role-based hiding (hidden, not locked) | Built-in: SharePoint permissions hide what a user can't access from search, libraries and navigation (audience targeting for links) **[check: audience targeting]** | Same permissions through Graph; the app must never cache across users | Medium: someone must manage groups and permissions carefully |
| Department sidebar | Partly: the left "hub" or site navigation can list departments and folders; a pop-out drawer needs SPFx **[check: hub site navigation]** | Already built here | Low (built-in nav) / High (SPFx drawer) |
| Department cards | Built-in: Quick Links web part in tile layout **[check: Quick Links web part]** | Already built here | Low |
| Role-based home pages (Key Links vs department cards and My Team) | Partly: audience targeting on web parts and links shows different sections to different groups on one page **[check: audience targeting for web parts]** | Role from Entra ID groups | Low to medium |
| My Team (reviews and coaching notes) | Built-in library with item-level permissions, shown with a filtered library web part | Graph plus permission checks | Medium: permissions on sensitive files |
| Rotating banner (3 latest posts) | Partly: the Hero web part rotates in some layouts; a slim auto-rotating strip with pause controls needs SPFx **[check: Hero web part layouts]** | Already built here | Low (Hero) / High (SPFx) |
| News posting rights | Built-in: News posts; posting is limited by site permissions (Members can post) **[check: SharePoint news]** | A posting UI and storage (e.g. a SharePoint list) | Low |
| Calendar (firm and social events) | Built-in: Events web part with an events list **[check: Events web part]** | Event storage (list) and the calendar UI | Low |
| Floating Ask HR chatbot | Not out of the box. Options: Microsoft 365 Copilot / Copilot Studio agent added to the site, or an SPFx extension for the floating button **[check: Copilot Studio in SharePoint]** | A server route to an AI service (see Chatbot below) | Medium to high |
| First-month onboarding pop-up | Not out of the box. Needs an SPFx application customizer plus per-user storage **[check: SPFx application customizers]** | Per-user storage (see below) | High (SPFx) |
| Help tab | Built-in: an ordinary page with text web parts and in-page anchors | A page (already built here) | Low |
| File overview panel | Built-in: the library details pane shows a file's properties before opening it **[check: details pane]** | Already built here with Graph metadata | Low |
| OneDrive button | Built-in: the Microsoft 365 app launcher already links to each user's own OneDrive; a page button can use a generic OneDrive link (see below) | A link (see below) | Low |

**Summary:** most of the hub can be built with SharePoint's built-in pieces and edited by staff in the browser. The features that need custom code (SPFx) in SharePoint are the floating chatbot button, the first-month onboarding pop-up, the slim rotating banner with pause controls and the pop-out department drawer. A custom front end can do all of them, but every feature then needs a developer to maintain it. Because maintenance by non-developers is the deciding concern, the recommendation is **SharePoint Online out of the box**, accepting the built-in equivalents for those four features (Hero web part, site navigation, a Help page link instead of a pop-up, and a Copilot agent or a chat link instead of a floating button), and adding SPFx only if one of them proves essential.

## Onboarding timing

The prototype stores the first-visit date and "Don't show again" in `localStorage`. That storage belongs to one browser on one computer: a new laptop, a different browser, a private window or clearing site data starts the first month again, and the firm can't see or reset it.

A real first-month rule needs per-user storage. Options:

- A SharePoint list with one row per user (first visit, dismissed), read and written by an SPFx extension **[check: SPFx and SharePoint lists]**.
- The user's hire date from their Entra ID profile (`employeeHireDate`) instead of a first-visit date, so no write is needed **[check: Microsoft Graph user employeeHireDate]**.

Both need an SPFx extension or a custom front end, so a developer.

**Recommendation:** use the fallback Eric accepted. Put the welcome tour on the Help page (built-in page) and link to it from the new-hire email and the New Hire Checklist. If an automatic pop-up is still wanted, use the Entra ID hire date, which avoids storing anything new.

## OneDrive

Ways to send each employee to their own OneDrive without custom code:

- The Microsoft 365 app launcher (the waffle menu) already shows OneDrive for every signed-in user **[check: app launcher]**.
- A generic link such as `https://<tenant>-my.sharepoint.com/` or `https://www.office.com/launch/onedrive` takes each signed-in user to their own OneDrive, so one link in a Quick Links web part works for everyone **[check: OneDrive URL formats]**.
- In Teams, the OneDrive app in the left rail.

Questions for Trevor:

1. What is the firm's tenant name (for the `-my.sharepoint.com` link)?
2. Is OneDrive set up for every employee, including co-op students?
3. Should the hub also link to shared department libraries, or only personal files?
4. Are any OneDrive sharing or sync restrictions in place that the guide should mention?

## Chatbot (Gemini Flash-Lite)

How a Gemini Flash-Lite version would work:

1. A server route (never the browser) holds the API key, so staff can't see or copy it.
2. The route receives the question, finds the relevant passages in the published HR policies (for example the Employee Policy Manual stored in SharePoint), and sends only those passages with the question to the model ("grounding").
3. The prompt tells the model to answer only from those passages, to say "I don't know, ask HR" otherwise, and never to take actions.
4. The answer comes back with a link to the source document.

Questions to answer first:

- **Confidentiality:** do Google's terms for the paid Gemini API keep prompts out of model training, and where is data processed and stored? Free tiers may have different terms **[check: Gemini API terms and data use]**. Only published, non-confidential policy text should be sent; never client data.
- **Cost:** Flash-Lite is priced per token and is among the cheapest models; with short policy passages a small firm's usage should be low, but it must be estimated from the current price list **[check: Gemini API pricing]**.
- **Upkeep:** someone must keep the policy documents current and review wrong answers.
- **Sign-in:** the route must only answer signed-in staff, which needs Entra ID sign-in on the custom front end.

Microsoft-native alternatives:

- **Copilot Studio** agent grounded on the HR policy library, added to SharePoint or Teams. It stays inside Microsoft 365 and is configured in the browser, but is licensed separately **[check: Copilot Studio licensing]**.
- **SharePoint agents** (Copilot in SharePoint) on the HR site, if the firm has Microsoft 365 Copilot licences **[check: SharePoint agents]**.

**Recommendation:** don't build the Gemini version now. It adds a server, an outside data processor and developer upkeep to the one feature that touches HR content. If the firm chooses SharePoint, try a Copilot Studio or SharePoint agent on the published HR policies first, since non-developers can maintain it. Keep the scripted showcase for Meeting 5.

## Sources to check

| Topic | Page to check | Date checked |
|---|---|---|
| Site navigation | https://support.microsoft.com/office/customize-the-navigation-on-your-sharepoint-site-3cd61ac7-ae4b-4fd8-a7b5-6e64a7c7d7f2 | not yet |
| Hub site navigation | https://learn.microsoft.com/sharepoint/planning-hub-sites | not yet |
| Microsoft Search | https://learn.microsoft.com/microsoftsearch/overview-microsoft-search | not yet |
| Library views | https://support.microsoft.com/office/create-change-or-delete-a-view-of-a-list-or-library-27ae65b8-bc5b-4949-b29b-4ee87144a9d9 | not yet |
| Audience targeting | https://support.microsoft.com/office/target-content-to-a-specific-audience-on-a-sharepoint-site-68113d1b-be99-4d4c-a61c-73b087f48a81 | not yet |
| Quick Links web part | https://support.microsoft.com/office/use-the-quick-links-web-part-e1df7561-209d-4362-96d4-469f85ab2a82 | not yet |
| Hero web part | https://support.microsoft.com/office/use-the-hero-web-part-4ba3ed9b-0e4a-4f0e-9b6d-6b7c4b8e1d7d | not yet |
| SharePoint news | https://support.microsoft.com/office/create-and-share-news-on-your-sharepoint-sites-495f8f7a-7a21-4a2b-9a4e-6c8d9e4a1c7a | not yet |
| Events web part | https://support.microsoft.com/office/use-the-events-web-part-5fe4da93-5fa9-4695-b1ee-b0ae4c981909 | not yet |
| SPFx application customizers | https://learn.microsoft.com/sharepoint/dev/spfx/extensions/get-started/build-a-hello-world-extension | not yet |
| Graph employeeHireDate | https://learn.microsoft.com/graph/api/resources/user | not yet |
| OneDrive URLs and app launcher | https://learn.microsoft.com/sharepoint/onedrive-overview | not yet |
| Gemini API pricing | https://ai.google.dev/gemini-api/docs/pricing | not yet |
| Gemini API terms and data use | https://ai.google.dev/gemini-api/terms | not yet |
| Copilot Studio | https://learn.microsoft.com/microsoft-copilot-studio/fundamentals-what-is-copilot-studio | not yet |
| SharePoint agents | https://learn.microsoft.com/sharepoint/get-started-sharepoint-agents | not yet |

The Microsoft support links were written from memory and some may have moved; if a link is broken, search the page title on support.microsoft.com or learn.microsoft.com.
