# FCS University CRM Prototype — Build Spec for Claude Code

INFOSYS 424 · Team 1 · Forward Career Services (FCS)
Sprint 2 increment (due Sun 11/15). The same prototype will be extended for Milestone 3 (due 11/22).

This file tells Claude Code what to build. Build only what is listed here. If something seems missing or worth adding, **ask before adding it**.

---

## 1. What this prototype is

A clickable, front-end-only mock-up of the university's existing CRM, configured for Forward Career Services.

- **Candidate direction (not final):** the university's existing CRM is the single system of record. Case-specific needs are met by **configuration**, **customization inside the CRM**, or **integration** with university systems. A separate portal is a fallback for M3 and is **not** built now.
- It is **not** production software: no backend, no real login, no API, no database. All data is sample data held in local JSON files.
- It merges two earlier artifacts into one site:
  - `reference/sprint1-prototype.html`: **the visual design reference** (Section 7) and the Sprint 1 screens (employer directory, employer record, event record, events directory, advisor view). Rebuild their content as CRM modules. Do **not** edit this file.
  - `../University CRM reference mock-up-html/Main.dc.html`: **content and module structure only** (Contacts, Cases, Workflows, Roles and access, Integrations). Do not use its visual style, and do not copy its runtime (`support.js`, `vendor/`).

## 2. Honesty rules (required by the course)

Milestone 3 requires that assumptions are clearly labeled and that nothing unconfirmed is presented as fact.

1. **Only these are confirmed** (Client Update 2): the university licenses an enterprise CRM that manages **contacts, cases, workflows, and role-based access**, and it **requires configuration and integration with university systems**. Nothing else about the CRM is known.
2. **Never name or brand a real CRM product** (no "Dynamics 365", "Salesforce", etc.). Call it **"University CRM"**.
3. Show a banner at the top of every page:
   > Reference mock-up, not the real product. Client Update 2 confirms only that the university licenses a CRM for contacts, cases, workflows and role-based access, which needs configuration and integration. The product is not named. Every feature below is labeled with how it would be delivered, as a team assumption. Sample data comes from the case packet and Sprint 1.
4. **Every feature carries exactly one category badge:**
   - `Configuration`: typical built-in CRM setting
   - `Customization`: needs custom work or an add-on inside the CRM
   - `Integration`: depends on a university system connection
5. Do not use "Confirmed" badges on features. Only the four Client Update 2 capability names in the header cards may say "Confirmed by Client Update 2".
6. Use only the sample data in Section 6. Do not invent new people, employers, or metrics.

## 3. Roles (simulated sign-in)

A "View as role" switcher simulates the university login. Label it **"Simulated university sign-in"**. No passwords.

| Role | Sample user |
|---|---|
| Employer-Relations Staff | Employer-relations staff member |
| Employer Relations Manager | Priya Shah |
| Career Advisor (assigned) | Amanda Brooks |
| Career Advisor (backup) | Backup advisor (sample) |
| Director | Thomas Nguyen |

## 4. Access matrix (enforce in the UI)

| Record type | ER Staff | ER Manager | Career Advisor | Director |
|---|---|---|---|---|
| Employer accounts and contacts | Edit | Edit | View (read-only) | View |
| Engagement activities and tasks | Edit | Edit | View summary | View |
| Merge review cases | Create | Approve or reject | None | View |
| Advising cases and notes | None | None | **Assigned or backup advisor only** | None |
| Engagement reports | Aggregate | Aggregate | Aggregate | Aggregate, de-identified |

Correction from the reference mock-up: advising access is **"Assigned or backup advisor only"**, not "Own students only".
When a role has no access, show a locked placeholder ("Hidden: your role has no access to …"), never the content.

## 5. Feature scope

### 5.1 Build now (Required)

| ID | Feature | Category | Traces to |
|---|---|---|---|
| R1 | Employer record: contacts, aliases, relationship owner, **Relationship status** (Active / Dormant) and **Recruiting stage** as separate picklists | Configuration | M1 FR, BR (status split), NFR (controlled values) |
| R2 | Activity timeline per employer (calls, tasks, events) in one view | Configuration | M1 FR (unified history) |
| R3 | Advising cases and private notes visible only to the assigned or backup advisor; locked placeholder for everyone else | Configuration (record-level access) | M1 BR, Client Update 1, Client Update 3, M2 Decision Log |
| R4 | Duplicate detection (basic name/contact match, or flagged by staff) creates a merge review case routed to the Employer Relations Manager, who approves or rejects | Configuration (workflow) | M1 FR. Manager as decider is a team assumption (M2 Decision Log) |
| R5 | Merge history: who flagged, who decided, when, outcome | Configuration (change history) | M1 FR (audit trail) |
| R6 | Director engagement report: aggregate, de-identified counts only | Configuration (reports) + Integration (event and advising data) | M1 FR, BR (cross-domain reports aggregate or de-identified). **Metrics: OPEN ITEM, see Section 10** |
| R7 | Spreadsheet import preview: the case packet sample spreadsheet rows (Section 6.2) and the canonical records they become | Configuration (one-time import) | Client Update 3, case packet |
| R8 | Simulated university sign-in (role switcher) | Integration | M1 FR (university login) |
| R9 | Employer tasks and advising follow-ups with due date, status, and reminder | Configuration (workflow) | Case packet (Amanda: manageable follow-up), M2 Decision Log |
| R10 | "Active employer" rule panel: the proposed rule, its version, and status "Pending Director approval" | Customization (or a governance process outside the CRM) | M1 BR, Client Update 1 |
| R11 | Integrations panel: University Login Service, University Student System, Event Platform, each marked "Not connected" with its open question | Integration | Client Update 2, M2 context diagram |

Proposed rule text for R10 (from Sprint 1, still a proposal): *An employer is active if it has at least one recorded engagement activity (recruiting, event, or direct contact) in the last 12 months.*

### 5.2 Do not build now (Optional, kept for later)

- Search by alias
- Hide the Student Notes menu by role (R3's locked placeholder covers the protection)
- Read-only employer summary inside the advisor view
- Log of who opened a note (downgraded from M1 by team decision)
- Fuzzy alias matching
- Automatically keep the merged name as an alias
- Automatically reassign follow-ups to the backup advisor

### 5.3 Out of scope (belongs to Milestone 4 or never)

Real backend, auth, API, or database · a separate portal · architecture diagram · UAT tables · data migration plan · security and privacy analysis · any real CRM branding.

## 6. Sample data (use only this)

### 6.1 Canonical records (Sprint 1 merge results)

| Employer | Alias | Contact | Owner | Relationship status | Recruiting stage |
|---|---|---|---|---|---|
| Acme Analytics Inc. | Acme Analytics | Michael Harris | Priya Shah | Active | Recruiting |
| Northstar Bank | North Star Bank | Lisa Kim | Priya Shah | Active | Event partner |
| BrightPath | (none) | Not assigned (data-quality follow-up) | Thomas Nguyen | Dormant | (none) |

Acme timeline (Sprint 1):
- Oct 20, 2026 · Recruiting call · "Spring recruiting plans": Michael confirmed interest in the spring career fair. Priya will send the participation details. Logged by Priya Shah.
- Oct 8, 2026 · Employer event · Fall Employer Networking Session: Acme Analytics attended. Source: Event platform (last imported Oct 9, 2026, 9:00 AM).
- Sep 4, 2026 · Outreach · "Recruiting relationship established": initial conversation with Michael Harris about campus recruiting.

Acme task: "Send spring career fair details", assigned to Priya Shah. Due date: use a placeholder labeled "sample".

**Data consistency fix (Sprint 1 Review):** every event shown on an employer timeline must also appear on the Events page, and the reverse. Sprint 1 showed a Northstar event on Oct 12 that was missing from the Events page; do not repeat this.

Advising sample (Sprint 1):
- Student: Jordan Lee · Assigned advisor: Amanda Brooks
- Oct 28, 2026 · Career advising · "Interview confidence and preparation": Jordan shared concerns about answering behavioral interview questions. Practiced a STAR example and agreed to prepare two additional examples before the next meeting.
- Follow-up: Review two STAR examples at the next appointment.

### 6.2 Original spreadsheet rows (case packet, for R7)

| Organization | Contact | Owner | Last Activity | Student Notes? | Status |
|---|---|---|---|---|---|
| Acme Analytics | M. Harris | Priya | Sep 4 | No | Active |
| ACME Analytics Inc. | Mike Harris | Amanda | Aug 28 | ? | Recruiting |
| Northstar Bank | L. Kim | Priya | Sep 1 | No | Active |
| BrightPath | - | Thomas | Jul 15 | No | Dormant |
| North Star Bank | Lisa Kim | Amanda | Sep 7 | Yes? | Event |

In the import preview, show that the "Student Notes?" column is **not** carried into employer records.

## 7. Tech stack

- React 18 + Vite + TypeScript, plain CSS with design tokens taken from `reference/sprint1-prototype.html`:
  - Font: Inter
  - Top bar `#172C51` with white text; page background `#F5F5F5`; white left sidebar for module navigation
  - Active nav item: background `#EAF1FB`, text `#115EA3`
  - Headings `#172E35`; secondary text `#667A80`; teal labels `#136F63`
  - Table header `#EDF2EF`; borders `#DEE7E4`
  - "Active" pill: background `#E9F4EE`, text `#136F63`; "Dormant" pill: background `#F0F0F0`
  - Private-notes panel: background `#EAF4EF`, border `#BDD5D1`
  - The top-bar product name reads **"University CRM"**, never "Dynamics 365".
  - The Sprint 1 file is a fixed 1504px artboard; the new site must be responsive instead.
- `react-router-dom` with **HashRouter** (GitHub Pages has no server-side routing).
- Data in `src/data/*.json`. No `localStorage` needed. If used for remembering the selected role, wrap it in try/catch.
- Responsive down to phone width; buttons at least 44px high; keyboard focus visible.
- Public GitHub repo **`InfoSYS424-Foward_Career_Services`**. Deploy to **GitHub Pages** with a GitHub Actions workflow; set Vite `base` to `/InfoSYS424-Foward_Career_Services/`.

Suggested structure:

```
src/
  data/          employers.json, activities.json, advising.json, mergeReviews.json,
                 spreadsheet.json, rules.json, integrations.json, access.json
  components/    Banner, CategoryBadge, RoleSwitcher, LockedPlaceholder, ...
  modules/       Contacts, EmployerRecord, Events, Cases, Workflows, Reports,
                 Import, Rules, Access, Integrations
  App.tsx
```

## 8. Acceptance checklist

- [ ] `npm run build` passes; the GitHub Pages link opens in an incognito window.
- [ ] The banner from Section 2 appears on every page.
- [ ] Every feature shows exactly one category badge.
- [ ] Switching roles changes what is visible exactly as in Section 4.
- [ ] A Career Advisor who is not assigned or backup sees a locked placeholder for Jordan Lee's notes.
- [ ] No real CRM product name appears anywhere.
- [ ] Only Section 6 data is used; events match between timeline and Events page.
- [ ] Nothing from Section 5.2 or 5.3 was built.
- [ ] A `FEATURES.md` file lists every built feature with its ID, category, and requirement trace (copy of the Section 5.1 table), for the Sprint 2 and M3 write-ups.

## 9. Workflow for Claude Code

1. Read this file, `reference/sprint1-prototype.html`, and `../University CRM reference mock-up-html/Main.dc.html`.
2. Resolve the open item in Section 10 with the user before building R6.
3. Build in this order: shell (banner, role switcher, module nav) → R1, R2 → R3 → R4, R5 → R9 → R6 → R7 → R10 → R11 → deploy.
4. Commit after each feature with a clear message.

## 10. Open item (ask the user before building R6)

**Director report metrics (R6):** Thomas's required metrics were never confirmed (Sprint 1 Review follow-up), and the team is still deciding. Until the user gives the list, build the report page layout with the heading, the "aggregate, de-identified" note, and the category badges, and show "Metrics pending team decision" in place of numbers. Do not invent metrics.
