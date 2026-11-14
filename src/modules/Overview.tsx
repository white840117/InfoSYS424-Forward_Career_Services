import { Link } from 'react-router-dom';
import { CategoryBadge, PageHead } from '../components/ui';
import { useStore } from '../store';

const CONFIRMED = [
  { name: 'Contacts', use: 'Employer accounts, aliases, owners and contacts' },
  { name: 'Cases', use: 'Restricted advising cases (Student Notes) and merge reviews' },
  { name: 'Workflows', use: 'Merge approval, tasks and follow-up reminders' },
  { name: 'Role-based access', use: 'What each staff role can see or change' },
];

export default function Overview() {
  const { role } = useStore();
  return (
    <>
      <PageHead
        eyebrow="Settings"
        title="University CRM, configured for FCS"
        sub="Candidate direction (not final): the university's existing CRM is the single system of record. Case needs are met by configuration, customization inside the CRM, or integration with university systems."
      />

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
          Each feature carries one badge and a feature ID (R1 to R11) that traces back to the team's requirements.
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
          <li><strong>Director</strong> lands on the Engagement report (aggregate, de-identified).</li>
          <li><strong>University IT</strong> (demo role) sees only Settings. <strong>Administrator</strong> (demo role) sees every module, but contents still follow the access matrix, so advising notes stay locked.</li>
        </ul>
        <p className="muted small">Changes you make (picklists, tasks, notes, merge decisions, Settings access) last only for this browser session. Nothing is saved to a server.</p>
      </section>
    </>
  );
}
