# Built features: FCS University CRM prototype (Sprint 2)

Copy of README Section 5.1, with where each feature appears in the prototype.
Categories are team assumptions about how each feature would be delivered in the University CRM.

| ID | Feature | Category | Traces to | Where in the prototype |
|---|---|---|---|---|
| R1 | Employer record: contacts, aliases, relationship owner, **Relationship status** (Active / Dormant) and **Recruiting stage** as separate picklists | Configuration | M1 FR, BR (status split), NFR (controlled values) | Employers; Employer record |
| R2 | Activity timeline per employer (calls, tasks, events) in one view | Configuration | M1 FR (unified history) | Employer record; Events (same records) |
| R3 | Advising cases and private notes visible only to the assigned or backup advisor; locked placeholder for everyone else | Configuration (record-level access) | M1 BR, Client Update 1, Client Update 3, M2 Decision Log | Student Notes; Jordan Lee case; Settings → Roles and access |
| R4 | Duplicate detection (basic name/contact match, or flagged by staff) creates a merge review case routed to the Employer Relations Manager, who approves or rejects | Configuration (workflow) | M1 FR. Manager as decider is a team assumption (M2 Decision Log) | Duplicate review; Settings → Import preview |
| R5 | Merge history: who flagged, who decided, when, outcome | Configuration (change history) | M1 FR (audit trail) | Duplicate review → Merge history |
| R6 | Director engagement report: aggregate, de-identified counts only | Configuration (reports) + Integration (event and advising data) | M1 FR, BR (cross-domain reports aggregate or de-identified). Metrics: OPEN ITEM | Engagement report (shows "Metrics pending team decision") |
| R7 | Spreadsheet import preview: the case packet sample spreadsheet rows and the canonical records they become | Configuration (one-time import) | Client Update 3, case packet | Settings → Import preview |
| R8 | Simulated university sign-in (role switcher) | Integration | M1 FR (university login) | Top bar, every page |
| R9 | Employer tasks and advising follow-ups with due date, status, and reminder | Configuration (workflow) | Case packet (Amanda: manageable follow-up), M2 Decision Log | Tasks and follow-ups; Employer record; Student Notes → Jordan Lee |
| R10 | "Active employer" rule panel: the proposed rule, its version, and status "Pending Director approval" | Customization (or a governance process outside the CRM) | M1 BR, Client Update 1 | Settings → Business rules |
| R11 | Integrations panel: University Login Service, University Student System, Event Platform, each marked "Not connected" with its open question | Integration | Client Update 2, M2 context diagram | Settings → Integrations |

## Changes after team feedback (Sprint 2 review)

| Change | Category | Where |
|---|---|---|
| Sidebar shows only the modules the signed-in role can open, always in one fixed order (Employers, Events, Student Notes, Duplicate review, Tasks and follow-ups, Engagement report, Settings). Each role lands on its main module: staff and manager → Employers, advisors → Student Notes, Director → Engagement report, University IT → Settings | Configuration (role-based access) | Every page |
| Removed the duplicate "Workspace / Career Services" heading from the sidebar | (layout only) | Sidebar |
| "Cases" split into **Student Notes** (R3, advising cases only) and **Duplicate review** (R4 merge review cases + R5 merge history) | (reorganization of R3, R4, R5) | Student Notes; Duplicate review |
| **Add note** on an advising case: the assigned or backup advisor can add a session note with an optional follow-up and due date. Saved for the browser session only | Configuration (part of R3; follow-up feeds R9) | Student Notes → Jordan Lee |
| **Settings** area at the bottom of the sidebar, with sub-tabs: About this mock-up (former Overview), Roles and access, Settings access, Import preview (R7, moved from the sidebar), Business rules (R10), Integrations (R11) | (reorganization) | Settings |
| **A1 Settings access**: University IT and Administrator always see Settings; they can grant it to other roles | Configuration (role-based access) | Settings → Settings access |
| Two **demo roles** added to the sign-in switcher: *University IT (demo role)*, sees only Settings; *Administrator (demo role)*, sees every module but contents still follow the access matrix (view only, advising notes locked). Both are labeled as demo roles, not confirmed university roles | Integration (part of R8) | Top bar |

## Notes on the build

- **R6** is shown as two blocks so each carries exactly one badge: "Engagement report" (Configuration) and "Report data sources" (Integration).
- **Roles:** a sixth demo role, *Career Advisor (not assigned)*, sample user "Other advisor (sample)", was added (team decision) so the locked placeholder for Jordan Lee's notes can be demonstrated for an advisor who is neither assigned nor backup.
- **Merge reviews:** the two Sprint 1 merges (MR-0001 Acme, MR-0002 Northstar) appear in merge history as already approved. Decision dates are not in the sample data and are labeled "sample date". New flags and decisions made during a demo last only for the browser session and do not change the records.
- **Sample placeholders:** task and follow-up due dates and reminders are labeled "(sample)", as the README asks.
- Not built (README 5.2 / 5.3): alias search, hiding the Student Notes menu, advisor employer summary, note-open log, fuzzy matching, automatic alias on merge, automatic reassignment to the backup advisor, any backend or real branding.

## Fixes before submission

| Fix | Where |
|---|---|
| ⓘ button next to the role switcher explains that Settings is visible to the University IT and Administrator demo roles, with a "Switch to Administrator" button. Opens on click or keyboard focus, closes with Esc or an outside click | Top bar, every page |
| Repo renamed to `InfoSYS424-Forward_Career_Services`: Vite `base`, README and git remote updated. Live site: https://white840117.github.io/InfoSYS424-Forward_Career_Services/ (the old "Foward" URL no longer works) | vite.config.ts; README.md |
| Access matrix gains a "Spreadsheet import (R7)" row: University IT and Administrator run the import, the Employer Relations Manager reviews the result, all other roles have none. The manager can open Settings → Import preview from Duplicate review without other Settings access; other roles see a locked placeholder. Import roles are a team assumption | Settings → Roles and access; Settings → Import preview; Duplicate review |
| Employers without timeline activity show their latest "Last Activity" from the case packet spreadsheet (Northstar Bank Sep 7, BrightPath Jul 15), labeled "From spreadsheet import". No year, activity type or timeline entry is added. Import preview section 3 shows the same values (Acme Sep 4) | Employers; Settings → Import preview |
