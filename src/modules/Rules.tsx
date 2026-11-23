import { Feature, PageHead, Pill } from '../components/ui';
import rule from '../data/rules.json';
import { useStore } from '../store';

export default function Rules() {
  const { rule: state } = useStore();
  const history = [
    { version: rule.version, event: 'Proposed by the project team', by: 'Project team', when: 'Sprint 1', status: 'Proposed' },
    ...(state.status === 'Approved'
      ? [{ version: rule.version, event: 'Approved', by: state.approvedBy ?? '', when: state.approvedAt ?? '', status: 'Approved' }]
      : []),
  ];
  return (
    <>
      <PageHead eyebrow="Settings" title="Business rules" sub="Rules that decide how records are classified." />
      <Feature id="R10" title={`"${rule.name}"`} category="Customization"
        description="Needs custom work inside the CRM to evaluate automatically and keep versions, or a governance process outside the CRM.">
        <blockquote className="rule-text">{rule.text}</blockquote>
        <dl className="fields">
          <dt>Version</dt><dd>{rule.version}</dd>
          <dt>Status</dt><dd><Pill value={state.status} /></dd>
          <dt>Approver</dt><dd>{rule.approver}</dd>
        </dl>
        <h3>Version history</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Version</th><th>Change</th><th>By</th><th>When</th></tr></thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}><td>{h.version}</td><td><Pill value={h.status} /><span className="sub">{h.event}</span></td><td>{h.by}</td><td>{h.when}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">
          {state.status === 'Approved'
            ? 'Approved for this browser session. Recorded statuses do not change: applying the rule automatically needs custom work in the CRM.'
            : 'Still a proposal. The Director approves it from the Director dashboard. Relationship status on employer records is set by staff until then.'}
        </p>
      </Feature>
    </>
  );
}
