import { Link, useNavigate } from 'react-router-dom';
import { CategoryBadge, PageHead } from '../components/ui';
import { ROLES, useStore } from '../store';
import type { RoleId } from '../types';

const CONFIRMED = [
  { name: 'Contacts', use: 'Employer accounts, aliases, owners and contacts' },
  { name: 'Cases', use: 'Restricted advising cases (Student Notes) and merge reviews' },
  { name: 'Workflows', use: 'Merge approval, tasks and follow-up reminders' },
  { name: 'Role-based access', use: 'What each staff role can see or change' },
];

/** The one workflow this prototype demonstrates (Milestone 3): spreadsheet → governed employer record → Director view. */
const DEMO: { role: RoleId; to: string; step: string; proves: string; ids: string }[] = [
  { role: 'admin', to: '/settings/import', step: 'Import the employer spreadsheet',
    proves: '5 messy rows become 3 canonical records; the Student Notes? column is dropped; the retirement plan shows how the spreadsheet stops being updated.', ids: 'R7, R13' },
  { role: 'staff', to: '/duplicates', step: 'Flag a possible duplicate',
    proves: 'Staff raise a merge review instead of fixing records in a spreadsheet.', ids: 'R4' },
  { role: 'manager', to: '/duplicates', step: 'Approve or reject the merge',
    proves: 'The Employer Relations Manager decides; the decision is kept in merge history.', ids: 'R4, R5' },
  { role: 'staff', to: '/employers', step: 'Search "North Star"',
    proves: 'One Northstar Bank record with its alias, one owner, and controlled status fields.', ids: 'R1' },
  { role: 'director', to: '/dashboard', step: 'Review the Director dashboard',
    proves: 'Counts without manual cleanup, the active employer rule check and approval, and data-quality flags.', ids: 'R10, R12' },
  { role: 'admin', to: '/notes/CASE-0002', step: 'Guardrail: try to open an advising case',
    proves: 'Advising notes stay locked to the assigned or backup advisor, and the blocked attempt is logged.', ids: 'R3, R14' },
];

export default function Overview() {
  const { role, setRole } = useStore();
  const navigate = useNavigate();
  const go = (r: RoleId, to: string) => { setRole(r); navigate(to); };
  return (
    <>
      <PageHead
        eyebrow="Settings"
        title="University CRM, configured for FCS"
        sub="Recommended direction: the university's existing CRM is the single system of record for employer and advising data. Case needs are met by configuration, customization inside the CRM, or integration with university systems."
      />

      <section className="card stack" aria-labelledby="scope">
        <h2 id="scope">What this prototype demonstrates</h2>
        <p>
          One workflow from the recommended solution: replacing the shared employer spreadsheet with a single governed
          employer record in the university's existing CRM, reviewed by the Employer Relations Manager and reported to the
          Director without manual cleanup. Advising-note protection is shown as a guardrail. Other screens give context only.
        </p>
        <ol className="demo-path">
          {DEMO.map((d, i) => {
            const r = ROLES.find((x) => x.id === d.role)!;
            return (
              <li key={i}>
                <span className="who">Step {i + 1} · {r.label} · {d.ids}</span>
                <strong>{d.step}</strong>
                <span className="muted small">{d.proves}</span>
                <button className="btn secondary" type="button" onClick={() => go(d.role, d.to)}>
                  Go as {r.label}
                </button>
              </li>
            );
          })}
        </ol>
        <p className="muted small">
          Not built: integrations, record-level access in a real CRM, and confirmed report metrics. These need university IT
          and the Director to confirm.
        </p>
      </section>

      <section aria-label="Confirmed capabilities" className="cards">
        {CONFIRMED.map((c) => (
          <div key={c.name} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="badge badge-confirmed" style={{ alignSelf: 'flex-start' }}>Confirmed by Client Update 2</span>
            <h3>{c.name}</h3>
            <span className="muted">{c.use}</span>
          </div>
        ))}
      </section>

      <section className="card stack" aria-label="How to read this mock-up">
        <h2>How to read this mock-up</h2>
        <div className="legend">
          <span className="item-l"><CategoryBadge category="Configuration" /> typical built-in CRM setting</span>
          <span className="item-l"><CategoryBadge category="Customization" /> needs custom work or an add-on inside the CRM</span>
          <span className="item-l"><CategoryBadge category="Integration" /> depends on a university system connection</span>
        </div>
        <p className="muted">
          Each feature carries one badge and a feature ID (R1 to R14) that traces back to the team's requirements; see <Link to="/settings/trace">Requirements trace</Link>.
          The badge is a team assumption about how the feature would be delivered, not a confirmed product fact.
        </p>
      </section>

      <section className="card stack" aria-label="Demo guide">
        <h2>Demo guide: switch roles</h2>
        <p className="muted">
          You are viewing as <strong>{role.label}</strong> ({role.user}). Use <em>Simulated university sign-in</em> in the
          top bar to change role. Each role gets its own sidebar and landing page; page contents follow the matrix
          in <Link to="/settings/access">Roles and access</Link>.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li><strong>Employer-relations staff and manager</strong> land on Employers. Staff flag duplicates in Duplicate review; the manager approves or rejects.</li>
          <li><strong>Career Advisors</strong> land on Student Notes. Only the assigned and backup advisor can open Jordan Lee's notes and add a note.</li>
          <li><strong>Director</strong> lands on the Director dashboard: candidate metrics, the active employer rule check (and approval), data-quality flags, and readiness of the CRM recommendation. Everything is aggregate and de-identified.</li>
          <li><strong>University IT</strong> (demo role) sees only Settings. <strong>Administrator</strong> (demo role) sees every module, but contents still follow the access matrix, so advising notes stay locked.</li>
        </ul>
        <p className="muted small">Changes you make (picklists, tasks, notes, merge decisions, rule approval, Settings access, note access log) last only for this browser session. Nothing is saved to a server.</p>
      </section>
    </>
  );
}
