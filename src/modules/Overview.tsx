import { Link } from 'react-router-dom';
import { CategoryBadge, PageHead } from '../components/ui';
import { useStore } from '../store';

const CONFIRMED = [
  { name: 'Contacts', use: 'Employer accounts, aliases, owners and contacts', to: '/employers' },
  { name: 'Cases', use: 'Merge reviews and restricted advising cases', to: '/cases' },
  { name: 'Workflows', use: 'Merge approval, tasks and follow-up reminders', to: '/workflows' },
  { name: 'Role-based access', use: 'What each staff role can see or change', to: '/access' },
];

export default function Overview() {
  const { role } = useStore();
  return (
    <>
      <PageHead
        eyebrow="Forward Career Services workspace"
        title="University CRM, configured for FCS"
        sub="Candidate direction (not final): the university's existing CRM is the single system of record. Case needs are met by configuration, customization inside the CRM, or integration with university systems."
      />

      <section aria-label="Confirmed capabilities" className="cards">
        {CONFIRMED.map((c) => (
          <Link key={c.name} to={c.to} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="badge badge-confirmed" style={{ alignSelf: 'flex-start' }}>Confirmed by Client Update 2</span>
            <h3>{c.name}</h3>
            <span className="muted">{c.use}</span>
          </Link>
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
        <h2>Try it: switch roles</h2>
        <p className="muted">
          You are viewing as <strong>{role.label}</strong> ({role.user}). Use <em>Simulated university sign-in</em> in the
          top bar to change role. Visible content follows the access matrix on <Link to="/access">Roles and access</Link>.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li><Link to="/employers/acme">Acme Analytics Inc.</Link>: employer record with status and recruiting stage picklists and the activity timeline.</li>
          <li><Link to="/cases/CASE-0002">Jordan Lee advising case</Link>: open it as the assigned, backup and not-assigned advisor.</li>
          <li><Link to="/cases">Merge reviews</Link>: flag a duplicate as staff, then approve or reject it as the manager.</li>
          <li><Link to="/import">Import preview</Link>: the case packet spreadsheet and the records it becomes.</li>
        </ul>
        <p className="muted small">Changes you make (picklists, tasks, merge decisions) last only for this browser session. Nothing is saved to a server.</p>
      </section>
    </>
  );
}
