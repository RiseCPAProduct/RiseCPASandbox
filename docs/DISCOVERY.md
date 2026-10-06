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