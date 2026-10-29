# CLIENT CONTEXT

# 1. Company Name
- Rise CPA
- Website: riseadvisors.ca

# 2. Company Info / Mission
- We foster a continuous learning environment to provide our clients with proactive accounting, tax, and business advice to help them grow and adapt to an ever-evolving business environment.

# 3. Project Advisor
- Point of contact for ~1 hour per week, mid-September to end of November.
- Name: Eric Salvador
- Role / Title: Director

# 4. What You're Exploring to Solve
- Idea: An internal intranet site (via SharePoint, for ease within the Microsoft ecosystem) to replace scattered drives with a consistent file structure across departments (HR, Marketing, Finance, Internet technology, etc.), housing internal policies, employee manuals, and templates (e.g., expense reimbursement forms) — with tiered access for owners/partners vs. staff, and an AI chatbot to answer policy questions and search documents.

# FIRST CLIENT MEETING
# Rise CPA: Client Discovery Meeting, User Research Notes
Client contact: Eric, Partner at Rise CPA (also Treasurer, Tri-City Chamber of Commerce board) Project direction chosen: Idea 1, the internal intranet / document hub (Idea 2, the "manager agent", was set aside) Note: The transcript was auto-generated and some words are garbled. Items marked (unclear) should be confirmed with the client.

# 1. About the client
Rise CPA is an external public practice accounting firm. It serves private companies only (no public companies).
Services: tax planning, audits, compilation engagements, reviews, and consulting.
The firm is growing and wants to modernize with AI and digitization.
Eric heard about the project through his Chamber of Commerce role (the Chamber has a relationship with our school).
The firm uses a relationship-manager model: managers and partners each look after a set of clients, similar to a bank's key relationship manager.

# 2. Why they want this project
Eric described two separate goals:
Prove the concept to the other partners. The prototype is a pitch tool. If it succeeds, Eric plans to ask for more resources to build it out properly after our project.
Learn from the experience. The firm wants to try working with an outside team and see what fresh ideas come up (e.g., whether SharePoint is really the best option).
Expectations are modest: Eric does not expect a finished system that fixes everything. He wants a prototype that shows what this could become.
Urgency is low: the current setup causes no immediate business problems. This is an improvement opportunity, not a crisis.

# 3. Current state
Infrastructure
Staff work on Azure Virtual Desktop (AVD). Office laptops are basically empty shells; everyone logs into virtual desktops hosted remotely (Eric believed in Toronto).
The firm has a Microsoft 365 business license.
Most software is SaaS (cloud-based).
The main exception is CaseWare, an industry-standard accounting desktop app hosted locally. It is the main reason they still need AVD.
Long-term goal: move fully to cloud/SaaS so staff can drop AVD and use their own laptops.
Document storage
Files used to live on partitioned drives (B, C, D drives, etc.).
They were recently copied as-is into SharePoint: the same messy structure, now just in the cloud.
There is no landing page and no thought-out organization.
There are many old versions (e.g., the employee policy manual is on version 7, and older versions are still kept).
Some documents are shared between divisions (e.g., a fax cover sheet used by both Accounting and Tax), and it's unclear where they belong.
Current workarounds
Staff drill into folders where they think a file might be.
Staff ask colleagues (e.g., asking HR about policies directly).

# 4. Company pain points
Nothing is visually organized. Eric called it "everything everywhere all at once." Files are buried several folders deep under unclear names.
You have to already work there to find things. Experienced staff know where files are; new employees don't.
Time wasted searching. Finding a document can take 10 to 15 minutes.
HR gets simple repeat questions (vacation allowance, bereavement leave, how to submit expenses) that are already answered in a long policy document (around 60 pages).
Unclear homes for shared documents that serve more than one department.
Eric was clear that sorting and cleaning up the actual documents is the firm's job, not ours. Our job is the interface: how organized files appear and link together on a landing page.

# 5. Users
Who
The whole firm, across roughly 10 to 12 departments, including:
Accounting
Tax
Advisory services
Bookkeeping (unclear)
Marketing
HR
Innovation
Operations
Others (Eric offered to email the full department list)
Demographics
Ages 20 to 60. Co-op students around 20; the oldest (mostly partners) around 60.
Tech comfort: moderate. Comfortable with modern tools but "not whizzes." Accountants, not tech people.
Typical day (ideal future state)
Employee arrives and logs into their (virtual) computer.
They open their browser (Edge, Chrome, Safari, etc.) and the intranet loads as their home page.
Throughout the day, they use it to:
Find templates (e.g., fax cover sheets)
Look up policies (e.g., vacation requests)
Find process documents (e.g., how to submit an expense reimbursement)
They drag and drop those files into the right client or employee file.

# 6. Requirements
Platform
Website, not a mobile app. Discussed and agreed that a website fits better.
Prefer the Microsoft ecosystem (SharePoint is top of mind) because they already pay for the licenses.
Open to alternatives: other Microsoft 365 tools, or a third-party option if we propose it with good reasons.
Landing page / hub
A visually appealing, organized home page broken down by department (HR, Marketing, etc.).
Each department section links down into its folders and documents.
Should be common-sense enough that a new employee can find things without help.
Permissions
Partners can access everything.
Staff see only "published" documents that have been approved for employee access.
Plan: each department drive has a published section that the intranet reads from. Restricted content (e.g., HR pay data) stays partner-only.
Eric said he doesn't need separate roles in the app itself, but agreed that some permission logic is needed depending on where content is pulled from.
AI chatbot
Purpose: answer policy and process questions so HR isn't flooded with simple ones. Acts as a smarter search engine instead of reading a 60-page PDF.
Example questions:
"I'm a junior accountant. How many weeks of vacation do I get?"
"What's the bereavement leave allowance?"
"How do I submit an expense reimbursement?"
Scope: questions only. It should not take actions (e.g., booking vacation in other software).
Search / filtering
Eric thinks filters could be useful; staff already use filters in other software.
What to filter by is not decided yet. Possible options: document type, department, year.
Branding
Follow the risecpa.ca website: grey, white and green colours and matching fonts.
The team has already pulled colours and fonts from the site.
Eric can check with the part-time marketing specialist if more detail is needed.

# 7. Constraints and limitations
No access to real firm data. Client financial information is confidential, especially with AI involved.
We build the skeleton; testing uses mock / fake documents (Eric offered to draft mock versions, e.g., of the employee policy).
Some information is proprietary and won't be shared.
Document cleanup is out of scope. The firm will sort its own files.

# 8. Success measures
Main KPI: time to find a document. Goal: go from 10 to 15 minutes of searching to finding it almost instantly.
Ease of use compared to the current setup.
Pitch success: the prototype convinces the other partners to invest further.
Eric expects that once a visual prototype exists, staff will take document cleanup more seriously.

# 9. User testing
Eric is open to the team visiting the Rise CPA office to test the prototype with employees once it works.
Some staff could try it out once it's up and running.

# 10. Key takeaways
This is a proof-of-concept pitch tool, not a production system. Visual impact and a clear demo matter most.
The core problem is findability and organization, especially for new employees.
Stay in the Microsoft ecosystem unless we have a strong reason not to.
The chatbot is for questions only, mainly HR and policy questions.
Use mock data only. Confidentiality is a firm boundary.
Success = less time spent looking for documents.

# SECOND CLIENT MEETING
# 1. Key Clarifications on Organization & Department Structure
- Standardized Folder Hierarchy: Eric wants a consistent folder structure across all departments (e.g., HR, Marketing, Finance, Operations). Conceptually, every department should have the same core folders—such as Budgets, Reports, Minutes, and Projects—even if the actual documents inside them differ.
- Top Document-Heavy Departments:
HR: Generates the highest quantity of documents (contracts, resumes, policies).
Resource Management & Finance: Handle the bulkiest files, such as large Excel analysis sheets, capacity reports, and department budgets.
- Department Sizing: The accounting department is the largest (around 45 staff members), while other teams like tax are smaller (around 3 people). All departments will use the intranet, though volume of use will vary.

# 2. Permissions & Access Control
- Read vs. Write Access:
Partners: Have full read/write access and control the backend.
Staff & Employees: Will have read-only access to prevent ad-hoc, unorganized folder creation (solving the "everything everywhere all at once" mess).
The "Published Documents" Workflow: Employees will only access finalized, approved files. Working drafts remain restricted until moved into a designated "Published" folder that the intranet feeds from.
Onboarding/Interns: For the purpose of this project prototype, interns and new onboarding students will share the same standard staff access profile.

# 3. Technical Stack & Architecture Updates
- Tech Stack Pivot / React: You learned that Henry (program head) mentioned he does not want product built directly in SharePoint initially. Instead, he wants you to build the prototype out using a React framework, which can later be translated or recreated inside SharePoint.
- Search Functionality: The global search bar is considered one of the highest-priority features. It should allow cross-departmental searching (e.g., searching "budget" pulls up budgets across all departments without needing to click into individual folders) and filter by criteria like document type, date modified, and department.
- Filter System & Criteria: To help employees quickly narrow down search results and historical documents without manually drilling down through layers of folders or digging through old years (e.g., historical records from 2015).
Key Filter Categories Discussed:
Department: Ability to scope results to a specific team (e.g., HR, Marketing, Finance, Resource Management) or search globally across all departments simultaneously.
Document Type: Ability to filter by file format or classification (e.g., Word documents, PDFs, Excel sheets, templates, letterheads, or report types).
Date Modified / Year: Ability to filter by timeframe (e.g., specific months or years like 2026 budgets vs. 2027 budgets) to ensure staff are looking at current rather than outdated materials.
- Visual Structure: Sticking to a clean folder hierarchy view combined with robust search features is the preferred visual design.

# 4. Key Stakeholders & User Research
- Trevor (Internet Technology & Operations Partner): Handles third-party providers, remote desktops (AVD), subscriptions, and Internet Technology/operations strategy.
- Amy (Manager of Operations): Works closely with Trevor and sits on multiple department meetings. She is a key contact if you need operational insights.
- User Research Surveys: Eric is fully on board with helping distribute a user survey to staff and partners to gather feedback on what they like/dislike, and is open to potential follow-up interviews (with Amy assisting).

# 5. Rise CPA Branding
- Headings Font: Roboto Bold
- Text Font: Open Sans
- Main Colour: Green (#87B04B )
- Secondary Colour: Charcoal (#616261)
- Tertiary Colour: White (#FFFFFF)
- Note company should be stylized as RISE CPA in all capitals.

# Meeting 3 Notes

## 1. Survey Questions & Review

- **Survey Approval:** The drafted survey questions were reviewed and approved by Eric. The team needs to turn them into an actual, finalized survey link.
- **Distribution:** Eric offered to distribute the survey to staff and partners himself to save them time, and will coordinate with Amy (Manager of Operations) and Trevor (Internet Technology Partner) during their Operational meetings to gather feedback.

## 2. Sandbox Demonstration & Feature Feedback

- **Global Search & Filters:** The team showcased the search and filter sandbox. Eric confirmed that the search system and filters (department, document type, year modified) hit the mark. He noted that year modified is more helpful than month filters.
- **Table View Preference:** Eric specifically liked the table view format for search results, where documents are laid out in rows and columns showing:
  - Document name
  - Type
  - Department
  - Publishing month/year
  - Last updated date
- **Department Navigation:** Eric likes the idea of being able to navigate by department, though the exact format or layout choice can be confirmed in the next meeting.

## 3. Permissions & Visibility of Restricted Content

- **The "Ad-Hoc" Folder Problem:** Re-examined the root cause of the previous SharePoint mess — the admin drive containing policies and templates was locked down as read-only. Lacking write access for firm documents, staff began creating their own personal/ad-hoc folders in other directories just to find files more easily.
- **Hidden, Not Locked:** Eric clarified that employees should only see what is available to them. If content is restricted or locked (such as partner-only or inter-departmental files), staff should not see greyed-out or locked icons at all — those files must be completely hidden from their view.

## 4. Single-Page Hub Architecture & Key Components

- **Unified Single-Page Layout:** Eric prefers a unified single-page hub rather than jumping across multiple windows. The application should integrate:
  - Global search and filtering for documents.
  - Department navigation and resource access (accessing a department's resources is the main workflow to prioritize).
  - An announcement / News Hub section featuring staff and client anniversaries, birthdays, and new blog postings (such as summaries of federal/provincial budgets sent to clients so staff stay aligned).
  - An AI chatbot section on the landing page, mainly used for HR-related inquiries (e.g., vacation entitlement, bereavement leave).
  - A personal OneDrive button/link allowing employees a quick link to their individual personal OneDrive.
- **Onboarding Guide:** Eric would like an onboarding feature or simple user guide included to help new users navigate the system.

## 5. Role-Based & Department-Based Content

- **Role Differentiation:** Different content should be displayed based on user roles (Partner vs. Manager vs. Regular Employee/Staff/Co-op).
  - **Partners & Managers** (including Amy, who has partner-level access): Have access to management contexts, such as staff coaching, mentoring, and performance review records for direct reports.
  - **Regular Staff / Co-ops:** Focus on standard operating resources and templates.
- **Core Goal of Unification:** The overarching project goal is unification — not just creating a centralized file storage system, but aligning the firm culturally (avoiding 7 different partner styles) and establishing a standardized workflow with technology.

## 6. Success Metrics & Action Items

### Key Features to Demonstrate

Easier navigation and faster access to information are the absolute highest priorities for the prototype pitch.

### Action Items & Next Steps

- [ ] Finalize the approved survey questions into an actual digital survey and send the link to Eric.
- [ ] Continue building the React single-page prototype featuring the table-view search, department navigation, news hub, AI chatbot section, and personal OneDrive link.
- [ ] **Next Meeting Follow-Up:** Clarify the reasoning behind the AI chatbot creation with Eric using specific framing (e.g., *"If HR gets random, unpredictable questions from employees via Slack or email throughout the day, do those ad-hoc inquiries disrupt their workflow and cause delays with work they actually should be doing?"*).
- [ ] **Next Meeting Follow-Up:** Clarify the reasoning behind the department navigation creation with Eric (e.g., which format — cards, sidebar, or dropdown — and why this feature is needed).
- [ ] **Next Meeting Follow-Up:** Clarify the reasoning behind the personal OneDrive button creation with Eric (he mentioned it would be useful, but why aside from ease of access?).
- [ ] Confirm meeting invite for next week at the same time.

## 7. What Has Changed Between the Second and Third Meetings

- **Consolidation into a Single-Page Hub:** Moving from separate pages or a multi-window setup, Meeting 3 established a firm requirement for a single-page dashboard that seamlessly houses department navigation, a global search table, an announcement news hub, an AI chatbot section, and a personal OneDrive button.
- **Search Result Format Finalized:** While previous meetings discussed general filtering, Meeting 3 locked in a specific table view format displaying columns for name, type, department, publishing month/year, and last updated date.
- **Refined Visibility Rules:** Meeting 2 established read-only access for staff; Meeting 3 clarified that restricted content must be completely invisible rather than displayed as locked or greyed-out items.
- **Concrete Feature Prioritization:** Accessing department resources via global search and navigation was officially named the primary user workflow that the prototype must successfully execute.
- **Actionable Survey Deployment:** Transitioning from an abstract agreement to distribute surveys, the actual questions were reviewed and approved, with Eric set to coordinate distribution via Amy and Trevor.

# RISE CPA: Fourth Meeting Summary
## 1. Lo-Fi Prototype Review & Feedback
**Lo-fi walkthrough:** The team presented lo-fi screens. Unlike the single-page sandbox, they used a multi-tab layout:
- **Staff homepage:** Global search with filters at the top, quick-access links to frequently used resources and company policies, an AI assistant section, and a news section (birthdays, anniversaries, client updates). A collapsible sidebar gives quick access to departments.
- **Manager/Partner homepage:** A separate version with a team section for items like employee performance reviews.
- **Department page:** Shows where the user is in the hierarchy (e.g., the Tax department), lists its documents with file type, and includes filters.





- **AI assistant page:** A question input with a "+" button to attach documents, and an option to view the sources the AI used.
- **Search documents page:** Search bar with filters (file type, date, department), a file overview/preview panel shown before opening a file, and the AI assistant at the bottom.
- **Calendar page:** A larger calendar for firm events, with blogs and news on the side that can be expanded.
**Eric's preference:** The multi-tab lo-fi version is more useful, especially for breaking content out by department. He still likes the look and feel of the sandbox landing page.
**"Single page" clarified:** Eric's earlier single-page request was about consolidating multiple applications (File Explorer, Teams, Outlook, etc.) into one place, ideally one SharePoint tab or browser window. Multiple tabs *within* the hub are fine.
**Current workflow validated:** The team presented a diagram of the current staff workflow. Searching several drives, then asking coworkers, then needing manager or partner permission is "exactly what's happening right now." Eric gave his approval.
## 2. Onboarding / User Guide
**Pop-up timing:** Eric asked whether the onboarding guide could appear for a user's first month of logins and then stop appearing. The team will check feasibility.
- **Fallback:** Show on first login only, then make it reopenable from a button or link.
**User guide format:** Build it the same way as the sandbox version, placed in its own Help / User Guide tab in greater detail.
## 3. News Hub, Banner & Calendar
**Announcement banner:** Eric approved a banner for recent firm updates, separate from the News Hub, so updates are visible right away. It should rotate through the three most recent posts.
**Content sources:**
- **Firm news/blog posts:** Partners and managers should be able to post relevant articles to the hub. Eric's example was if CRA news on PST changes being announced and then postponed.
- **Manual entries:** Items like anniversaries, birthdays, and social events would be added manually by someone with special permission (e.g., a social committee member).
**Calendar:** Eric liked the calendar from the lo-fi. It would hold monthly social events (e.g., bowling, the Christmas party).
## 4. Personal OneDrive Button
**Reasoning confirmed:** A handy shortcut to each employee's personal space, and that is the main reason for it.
**How it links:** Unsure how the button would connect to each user's own OneDrive. Trevor may know, and the team should check feasibility.
**Prototype scope:** A non-functional button is fine. It only needs to show that the feature is possible, so check SharePoint validity.
## 5. Role-Based Views, Staff Breakdown & Department Navigation
**Permissions confirmed:** Junior staff and co-ops should not see management items such as performance reviews or coaching notes.
**Approximate staff breakdown (~50 total):**
| Group | Approx. count | Notes |
|---|---|---|
| Partners + 1 principal | ~8 | |
| Managers | ~6–7 | |
| **Management/partner level (total)** | **~14** | Partner/manager view |
| Specialized/admin staff | ~8 | Internal finance, admin assistants, non-CPA staff |
| Junior and senior accountants, co-ops | Remainder | All share the same staff permissions |
**Performance reviews:** Managed as **Excel documents**. Feedback is exchanged by email during the year, and there are review meetings. There is no special system.
**Department navigation (significant clarification):**
- Department navigation is mainly for **managers and partners**.
- Staff and co-ops rarely need department drives (Internet Technology, HR, Finance, Marketing). They mostly need a **few key links**: policy manuals, how-to guides, SOPs, Internet Technology service ticket guides, and other published documents.
**Department navigation format:** Eric liked both options:
- The pop-out **left sidebar** from the lo-fi
- The **cards/tabs** on the sandbox landing page
Eric is fine with having both (sidebar plus cards on the landing page).
## 6. AI Chatbot
**Reasoning confirmed:** The chatbot would cut down on "wandering and popping by": staff asking coworkers, then being sent to the HR partner, then booking meetings. Making answers searchable should limit that running around.
**Format:** Use a **floating pop-up chat button in the corner** that opens on click, instead of a fixed section on the page.
**Controls:**
- **Clear/reset button:** Yes.
- **Edit message button:** Not needed. Users can retype.
**Note from Program Head (Henry):** The AI chatbot could potentially be actually coded using API pulls with Google Gemini Flash-Lite with a Google Developer Account (check feasibility).
## 7. Prototype Scope & Tech Stack
**Component library:** The team will build with a component library Microsoft uses so the prototype looks like it was made in SharePoint. The firm could later recreate it in SharePoint. **Eric approved this.**
**SharePoint eligibility:** Eric wants to know whether any features **cannot be supported in SharePoint**. The team needs to check each feature.
**Open to alternatives:** The project is also fact-finding for the firm. SharePoint may not be the final answer. One possibility is a custom front end that uses the SharePoint drives as its data source.
- Eric's key concern is **maintenance and updating**, since the firm is "a bunch of accountants," not developers.
**Expected functionality:**
- **Front end only:** layout, user experience, and organization of information, using placeholder content.
- **Must work:** Department navigation and finding a file, which is the primary workflow.
- **Can be non-functional showcases:** The AI chatbot and the OneDrive button.
- **No back end:** The firm's own data and sources are still being sorted out.
- **No login needed:** Login would be handled by Microsoft sign-in if built in SharePoint, or built later if the product becomes custom software.
**Folder structure spreadsheet:** The Excel file Eric sent is his proposed **master folder structure**. The X's mark **who has access** to each folder (partners 100%, then specialized individuals, then others).
- The firm is currently cleaning up its drives.
- Some existing folders (e.g., Trevor's Internet Technology folders) follow a different format. The firm will check whether they fit the master structure or whether the structure needs to change.
## 8. Action Items & Next Steps
- [ ] Check whether the onboarding pop-up can show for a user's first month of logins (fallback: first login only, reopenable later).
- [ ] Add a Help / User Guide tab modelled on the sandbox guide.
- [ ] Build the multi-tab version of the lo-fi, including:
  - Rotating announcement banner (3 most recent posts)
  - Calendar
  - Floating AI chat button with a clear/reset option
  - Department sidebar plus department cards on the landing page
- [ ] Separate the staff view (key links: policies, SOPs, how-to guides, IT tickets) from the manager/partner view (department navigation, team performance section).
- [ ] Review all features for SharePoint compatibility and note anything SharePoint can't support.
- [ ] Look into how a OneDrive button could link to each user (possibly ask Trevor). The prototype can use a placeholder.
- [ ] Look into whether the AI chatbot can actually be coded using API pulls with Google Gemini Flash-Lite with a Google Developer Account.
## 9. What Has Changed Between the Third and Fourth Meetings
**Single-page hub became a multi-tab hub:** Meeting 3 called for a unified single-page hub. Meeting 4 clarified that Eric meant consolidating separate *applications* into one place. He now prefers the **multi-tab lo-fi layout** within a single browser window.
**Department navigation re-scoped:** Meeting 3 named department navigation the primary workflow. Meeting 4 clarified it is mainly for **managers and partners**. Staff and co-ops mostly need a small set of key links (policies, SOPs, how-to guides). The format was settled as **sidebar plus landing-page cards**.
**AI chatbot format changed:** It moved from a fixed section on the landing page to a **floating pop-up button in the corner**, with a clear/reset button and no edit-message feature. Its purpose (reducing HR interruptions and meetings) was confirmed. The AI chatbot could potentially be actually coded using API pulls with Google Gemini Flash-Lite with a Google Developer Account.
**New features added:**
- Rotating announcement banner (3 most recent posts)
- Calendar for social and firm events
- Separate Help / User Guide tab
- Onboarding pop-up, possibly time-limited to a user's first month
**News Hub workflow defined:** Partners and managers post firm news and articles. Delegated staff (e.g., the social committee) manually add birthdays, anniversaries, and events.
**Prototype scope narrowed:** The prototype is confirmed as **front end only**, with placeholder content, no login, and no back end. The chatbot and OneDrive button can be non-functional showcases.
**Platform outlook broadened:** The team got approval to use a Microsoft-style component library. Eric is now openly considering a non-SharePoint custom solution, with maintenance as the deciding concern. The team needs to check each feature for SharePoint compatibility.

# Product Direction Shift
## Project Problem
Project direction (based on client) is currently just a tool, not a solution ("Why do they need a new software, when they can just sort files better with stricter permission abilities with write functions.") according to Henry (Program Head). It seems the client can't necessarily word the true underlying issue this product should solve. The program head thinks this is really just a nicer looking system with extra features, such as an HR AI Chatbot and Firm News Hub, so a unique system is not necessary instead of fixing their old system. Henry suggested shifting efforts into just the issues about the process of files and folders being made, stored, and shifted around by employees. He suggested perhaps a tool that lets any employee upload files and lets AI sort them into folders (Note: misfiling of confidential documents, no clear accountability, and partners losing control are all hard sells to accountants). Even if the proposed idea is rejected by the client, a shift in direction is needed.

## Issue With Project Goals In Relation With Product
**The Current Product Goals Don't Just Need An Intranet Site: "The Core Goal: Unity**
The overarching goal of the entire intranet is **Unity**, which tackles two major cultural and operational problems at Rise CPA:
- **The "Different Partners, Different Styles" Problem:** Right now, Rise CPA has many partners with different personalities and preferences. Staff get pulled in different directions depending on whose project they are working on ("Eric's way" vs. "Trevor's way"). The intranet creates a single corporate truth and standardizes workflows so the firm operates as **one unified entity** rather than a collection of separate silos.
- **From "Glorified Storage" to a Living Hub:** SharePoint on its own was just acting as a static digital filing cabinet. The intranet transforms this into a living, breathing workspace that binds the firm together culturally and operationally.
- **Convenience and Friction:** The current structure causes user friction and lack of convenience going through many folders, hence why many staff began making their own personal folders in places they had write permission for better ease of access. This intranet site will minimize these issues by providing a convenient place where staff can find the information or resources they need with minimal friction."

**What about the core goal of this project really needs a separate intranet site rather than a stricter, refreshed file storage system?** Why can't they just sort the new file system based on the partner who has the most preferred preference in the firm and then add stricter write policies so files don't get rearranged? Why would an intranet site need to be the only thing that binds the firm together culturally and operationally? Why can't a better sorted file system that has been updated and is better suited for the employees be the solution for convenience and friction? All that is really understood is that RISE CPA would like to utilize updated technology rather than just standard business software, and would also like to try working with an external team for collaboration, but what should this collaborated product be?

**Perhaps the method of looking for company resources isn't the issue; perhaps the method of publishing files is?**

Could this issue of files being rearranged by other employees instead be the result of how files are published into this system? Those at partner and administrative levels at the firm could be publishing files in a workflow that works for them but might not be working for the other staff at those levels, let alone the rest of the staff at RISE CPA. What they want is just a file storage system that is updated with technology, but what they need is a product that gives partners a standardized system for publishing resources with a workflow that is intuitive for the entire firm.

**Currently the product solves the result of their issue (files being rearranged), not the issue as a whole (method of publishing).**
There is no sanctioned path for a file to go from someone's working draft to a correctly named, correctly placed, correctly permissioned published resource. Partners publish however suits them, staff have no legitimate way to contribute, and old versions are never retired.

## Product Scope Update
While RISE CPA doesn't mind if our product is only coded in front-end with React (they only need our version as a prototype that can be pitched to the rest of the firm for proper development, either in SharePoint or any framework that is manageable for an accounting firm to upkeep and maintain), Henry requires our React version to be fully coded both front-end and back-end. After the project term, RISE CPA and our team Good Company each get individual rights to change and adjust the product as we like, including letting other businesses use our individualized versions. So either the new product idea must be feasible in SharePoint, be feasible in another similar website building framework, or we make sure that the final version will be manageable at business employee level.

## Current Product State
Basically just a customized, firm-exclusive Microsoft SharePoint site built with Fluent UI. The current prototype is just a customized SharePoint template site which has content that can be browsed, not an app that can do anything. Our team had the mindset of building a SharePoint site for our client, RISE CPA. Henry is asking us to build a product that Rise CPA is the first customer of, rather than a site for Rise CPA.

## Product Mindset Shifts
1. **Product Problem Shift:** "The method of looking for company resources isn't the issue but instead a symptom of the greater problem; instead the method of publishing files is the problem the product must solve. There is no sanctioned path for a file to go from someone's working draft to a correctly named, correctly placed, correctly permissioned published resource. Partners publish however suits them, staff have no legitimate way to contribute, and old versions are never retired."
2. **Product Appearance Shift:** "Because we are using Fluent UI so our client can rebuild the product in SharePoint, which would be easier upkeep for them, our product should then instead look like a Microsoft product made for small and medium firms to better sort and publish resources among employees, not like a SharePoint template custom made for RISE CPA."
3. **Product Deliverable Shift:** "Instead of making RISE CPA's own SharePoint site, instead make a product that solves resource publishing and findability for small and medium firms, with RISE CPA as the first customer using a special RISE CPA theme. This product should only include features that a web app for making the unified process for publishing and getting resources that management level staff publish for employees would need, not what an intranet site made with SharePoint would instead."

## Summary
Our team had the mindset of building a SharePoint site for RISE CPA: pages of content and links that staff browse. Henry is asking us to build an application for RISE CPA instead: software, branded for Rise CPA and built with Fluent UI so it works like a Microsoft app, that solves a real workflow problem. That problem is how documents get published and read. The app should have a back end, user roles and actions (submit, approve, find), not just pages to read. Because both our team and RISE CPA keep rights to the product, nothing company-specific should be hard-coded, so this could be configured for another firm later.

## Web App Solution
Including an AI powered publishing workflow that can suggest best file names and what users should have access to, based on rules set when setting up our application.

# RISE CPA: Fifth Meeting Summary
## 1. RISE CPA File Processing Workflow
### The current process (internal documents)
1. **Drafting.** A partner's assistant prepares the draft for that partner's area of responsibility. Example: Nolan oversees HR, so his assistant drafts an HR policy.
2. **Partner review.** The responsible partner (Nolan) reviews the draft and requests changes if needed.
3. **Partner group approval.** Nolan presents the draft to all the partners, and the partners approve together.
4. **Publishing.** After approval, key admin staff (the people listed in the file structure Excel Eric sent) store the document in the right place in the file structure.
5. **Announcement.** A firm-wide email tells everyone the new document is available.

Regular employees can also start the process. If they help with a draft or have an idea for a new document, they submit that to a partner for review, and from there it follows the same path.

## 2. Who Does What
- **Employees:** can submit drafts or ideas for review, can view published documents.
- **Partner's assistants / admin staff:** draft documents, and after approval, publish, unpublish and organize them.
- **Responsible partner:** reviews drafts in their area and brings them to the partner group.
- **Partners (as a group):** give final approval.

The key rule is that **admin staff can publish, but only after partner approval.**

## 3. How This Could Translate Into the Publishing System
Each document could be modelled with a status that moves through stages:
**Draft -> Submitted for Review -> Under Partner Review -> Approved -> Published** (with **Rejected / Changes Requested** sending it back to Draft, and **Unpublished / Archived** for retired documents).

Features that would mirror Eric's process:
- **Submit for review** button for employees and assistants, where they choose the responsible partner or department.
- **Review queue** for partners showing drafts waiting on them, with approve, reject and comment options.
- **Approval record** that captures who approved and when, so there's an audit trail.
- **Publish permission** limited to designated admin staff, and only enabled once a document is marked Approved.
- **Folder selection** at publish time, using RISE's own structure (Eric confirmed we don't need to organize their files).
- **Automatic notification** when something is published, replacing the manual firm-wide email. This is a nice selling point since it removes a manual step.

## 4. Internal and External Documents
Eric drew an important line at the end:
- **Internal documents** (process and departmental documents) go through the approval workflow above. This is the project's focus.
- **External documents** (client files received and worked on daily) don't need approval. Staff "publish" and use them constantly as part of normal work.

# Rise/Folio MVP
Note: Transcribed from a low-resolution board image. Items marked (unclear) should be confirmed against the original board.

## 1. Product Summary
**What This Is**
A publishing and findability app for small and medium firms. RISE CPA is the first customer, with a RISE CPA theme. Main KPI is time getting a resource from the app.

**The Problem This Would Solve**
There is no sanctioned path from a working draft to a correctly named, correctly placed, correctly permissioned published document.
- Partners publish however suits them
- Staff have no legitimate way to contribute
- Old versions are never retired

**The Solution**
One path into the Published folder: Submit -> Partner approval -> Publish. The firm's own rules set the name, folder, and audience. AI pre-fills the work. A human always approves.
**Key Product Rule**
Nobody writes directly to the Published folder, partners included. This only fills through the pipeline.



## 2. User Roles (what a user can do)
- **Employee**
  - Find and view published documents (by viewing level)
  - Submit a draft or idea for review
  - Track own submissions
- **Manager (Partner's Assistants / Admin Staff)**
  - Everything an Employee can do
  - Publish approved documents: name, folder, audience
  - Unpublish / archive
- **Partner**
  - Everything an Employee can do
  - Review drafts for their department(s)
  - Approve, request changes, or reject
  - Record group approval note ("Approved at partners' meeting")
- **Admin Ability (on a Partner or Manager)**
  - Edits structure, access rules, and publishing rules
- **Department Ability (on a Manager or Employee)**
  - Give viewing ability based on department

## 3. Viewing Levels (what a user can see)
Each user has one level based on role and sees everything at or above that viewing level:
- Partner -> Everything
- Manager -> All-employee + Managers & Partners documents
- Employee -> All-employee documents

**Each published document has one viewing tag:**
- All staff
- Managers & Partners
- Partners only

**Each published document/folder has a department tag:**
- Decides what departments can view which resources
- Multiple department tags can be added depending on document use

**Hidden, not locked:** Documents above your level never appear anywhere, including search.

## 4. Structure Builder (recreates any firm's preferred file structure)
**Branding**
- Choose brand colours (primary, secondary, tertiary), font (heading, copy), upload company logo, or skip and use the default theme

**Departments**
- Name, code, lead partner(s)
- RISE CPA: 14 departments (HR, Accounting, Finance...)

**Folder template**
- Standard folders applied to every department
- One folder is marked as the Published folder
- RISE CPA: Calendar, Budget, Minutes, Projects, Process Documents, Templates, Reporting, Published Documents/Finalized Viewing

**Per department overrides**
- Add or remove folders for one department
- RISE CPA: Operations/Innovation has no Reporting folder

**Access rules**
- Who can see each folder: by role, by person, or across all departments
- RISE CPA: Jake -> all HR folders; Leo -> Budget in every department (unclear)
- Publisher = anyone with access to publish in a department's Published folder (typically needs Manager or Partner role)

**Default publisher**
- Publishes for departments with no publisher of their own

## 5. Folder Behavior
**Working folders (Budget, Templates, Process...)**
- Visible only to people with an access rule
- Files uploaded directly
- Status: Draft
- Drafts can be submitted for review from here

**Published folder**
- Visible to everyone, filtered by audience
- Only filled by Submit -> Approve -> Publish
- Status: Published
## 6. Document Publishing Flow
**Internal Documents:** Draft -> Submitted -> Under Partner Review -> Approved -> Smart Publish -> Published
- **Changes Requested** -> back to the submitter to revise and resubmit
- **Rejected** -> closed
- **Superseded** -> automatic when a new version is published (history only)
- **Unpublished / Archived** -> retired by a Publisher (history only)


**Who moves files**
- **Submitter:** Draft -> Submitted
- **Responsible partner:** Under Review -> Approved / Changes Requested / Rejected
- **Publisher:** Approved -> Published, Published -> Unpublished
- **System:** old version -> Superseded



**External Documents (client files):** Received -> Smart File -> Filed -> Final -> Archived
- **Received:** Staff upload a file from a client (email attachment, scan, client upload)
- **Filed:** Working copy, visible to the client team only. Can be replaced with newer versions (old versions kept in history)


- **Final:** Staff mark the file final when the engagement deliverable is done. Locked from further changes
- **Archived:** Automatic after the engagement year closes or the retention period ends. Read-only, hidden from day-to-day views

**External Access (client team)**
- Each client has a team: relationship partner, manager, assigned staff (matches RISE CPA's relationship-manager model)
- Only the client team sees that client's files
- Partners and admins can see all clients
- Hidden, not locked: other clients never appear, including in search
- **Confidentiality:** AI on real client files is a firm boundary. Default the AI toggle to OFF for external documents; it should only scan the current file name for data (unclear)
- Reuses the MVP's naming engine, structure builder, and access rules, so most of the work is already done

## 7. MVP Features
**Setup**
- **Structure builder:** departments, folder template, branding
- Access rules editor (department x folder x person grid)
- **Publishing rules:** types, naming template with live preview, default audience
- Multi-firm ready (firm_id on every table)

**Submit**
- Submit a draft or idea (file optional)
- Pick a department -> routes to its lead partner
- AI suggests department and type (toggle)
- **My Submissions:** track status, read comments, resubmit

**Review (Partners)**
- Review queue for their department(s)
- Approve, request changes, or reject, with comments
- Group approval note

**Publish (Smart Publish)**
- Publish queue of approved documents
- AI pre-fills title, type, effective date (toggle)
- Name built from the firm's template, e.g. HR_ProcessDoc_EmployeeHandbook_v8_2027-01
- Placed in the department's Published folder
- Viewing tag set
- "Replaces existing document?" (AI suggests the match)
- Old version auto-retired
- Unpublish / archive
- External / client documents (lighter flow, no approval)

**File (Smart File)**
- AI suggests client, year, engagement type, and document type (toggle)
- Name built from the firm's template, e.g. ACME-LTD_2026_T2_Bank-Statements_Dec (unclear)
- Placed in Client / Year / Engagement folder
- Duplicate check: "This looks like an existing file. Replace it?"
- No partner approval

**Announce**
- In-app notification on publish (replaces the firm-wide email)
- **What's New banner:** 3 latest publishes with change notes (repurposed Firm News Hub banner)

**Find**
- **Global search with table view:** Name, Type, Department, Published month/year, Last updated
- **Filters:** department, type, year
- Department sidebar
- **Document detail panel:** version, approved by/when, published by/when
- Hidden, not locked (enforced by database rules)

**Accountability**
- Record of who submitted, approved, and published, and when

**Help**
- Help / User Guide page

## 8. Stretch Features (only if the MVP is done)
- **AI sensitivity check:** flags content that doesn't match the audience
- **AI change summary:** "what changed" from old vs new version
- CSV / Excel import of a firm's structure -> AI reads the firm's structure spreadsheet and proposes the config
- **AI-assisted naming rules:** existing file names -> proposed convention
- Multi-partner sign-off in-app
- Email notifications
- Audit log page
- Needs Review badge (post review date)
- Favourites / My Resources
- Department landing cards
- First-login onboarding pop-up
- Second demo firm with a different theme

**Extra AI Features (AI cost to discuss with RISE CPA)**
- **Ask the Library chatbot:** answers from published, permitted documents only

**Out Of Project**
- Firm News Hub, OneDrive button (use existing Microsoft tools)

## 9. MVP Screens
1. Login + Sign Up / Role Switcher (Showcase Only)
2. **Admin:** structure builder, access rules, publishing rules
3. **Home:** search, table, filters, What's New banner, department sidebar
4. Document Detail Panel
5. Working Folder View
6. Submit Draft / Idea
7. My Submissions
8. Partner Review Queue + Review Screen
9. Publish Queue + Smart Publish screen
10. File Queue + Smart File screen
11. Help / User Guide
12. Document Update Record

## 10. AI Usage
- The product works fully without AI
- AI is a per-firm toggle that pre-fills forms
- AI extracts values; the firm's rules build the name and folder
- Code validates every result; low-confidence fields are highlighted
- A human always approves before anything is published
- **Good Company version:** Google Gemini Flash-Lite
- **RISE CPA version:** their choice whether to pay for AI (Microsoft Copilot)

## 11. Tech Stack
**Our Version**
- **Frontend:** React + Fluent UI v9
- **Backend:** Supabase (database, login, file storage, access rules)
- **AI:** Google Gemini Flash-Lite through a Supabase Edge Function
- Folders are database rows, not real storage paths

**RISE CPA Version**
- SharePoint + SPFx (React + Fluent UI)
- Document libraries + metadata columns
- Power Automate for approval, naming, publishing
- SharePoint groups for access rules