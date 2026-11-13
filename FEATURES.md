# Built features: FCS University CRM prototype (Sprint 2)

Copy of README Section 5.1, with where each feature appears in the prototype.
Categories are team assumptions about how each feature would be delivered in the University CRM.

| ID | Feature | Category | Traces to | Where in the prototype |
|---|---|---|---|---|
| R1 | Employer record: contacts, aliases, relationship owner, **Relationship status** (Active / Dormant) and **Recruiting stage** as separate picklists | Configuration | M1 FR, BR (status split), NFR (controlled values) | Employers; Employer record |
| R2 | Activity timeline per employer (calls, tasks, events) in one view | Configuration | M1 FR (unified history) | Employer record; Events (same records) |
| R3 | Advising cases and private notes visible only to the assigned or backup advisor; locked placeholder for everyone else | Configuration (record-level access) | M1 BR, Client Update 1, Client Update 3, M2 Decision Log | Cases → Advising cases; Jordan Lee case; Roles and access |
| R4 | Duplicate detection (basic name/contact match, or flagged by staff) creates a merge review case routed to the Employer Relations Manager, who approves or rejects | Configuration (workflow) | M1 FR. Manager as decider is a team assumption (M2 Decision Log) | Cases → Merge review cases; Import preview |
| R5 | Merge history: who flagged, who decided, when, outcome | Configuration (change history) | M1 FR (audit trail) | Cases → Merge history |
| R6 | Director engagement report: aggregate, de-identified counts only | Configuration (reports) + Integration (event and advising data) | M1 FR, BR (cross-domain reports aggregate or de-identified). Metrics: OPEN ITEM | Reports (shows "Metrics pending team decision") |
| R7 | Spreadsheet import preview: the case packet sample spreadsheet rows and the canonical records they become | Configuration (one-time import) | Client Update 3, case packet | Import preview |
| R8 | Simulated university sign-in (role switcher) | Integration | M1 FR (university login) | Top bar, every page |
| R9 | Employer tasks and advising follow-ups with due date, status, and reminder | Configuration (workflow) | Case packet (Amanda: manageable follow-up), M2 Decision Log | Tasks and follow-ups; Employer record; Jordan Lee case |
| R10 | "Active employer" rule panel: the proposed rule, its version, and status "Pending Director approval" | Customization (or a governance process outside the CRM) | M1 BR, Client Update 1 | Business rules |
| R11 | Integrations panel: University Login Service, University Student System, Event Platform, each marked "Not connected" with its open question | Integration | Client Update 2, M2 context diagram | Integrations |

## Notes on the build

- **R6** is shown as two blocks so each carries exactly one badge: "Engagement report" (Configuration) and "Report data sources" (Integration).
- **Roles:** a sixth demo role, *Career Advisor (not assigned)*, sample user "Other advisor (sample)", was added (team decision) so the locked placeholder for Jordan Lee's notes can be demonstrated for an advisor who is neither assigned nor backup.
- **Merge reviews:** the two Sprint 1 merges (MR-0001 Acme, MR-0002 Northstar) appear in merge history as already approved. Decision dates are not in the sample data and are labeled "sample date". New flags and decisions made during a demo last only for the browser session and do not change the records.
- **Sample placeholders:** task and follow-up due dates and reminders are labeled "(sample)", as the README asks.
- Not built (README 5.2 / 5.3): alias search, hiding the Student Notes menu, advisor employer summary, note-open log, fuzzy matching, automatic alias on merge, automatic reassignment to the backup advisor, any backend or real branding.
