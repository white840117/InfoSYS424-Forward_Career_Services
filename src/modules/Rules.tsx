import { Feature, PageHead, Pill } from '../components/ui';
import rule from '../data/rules.json';

export default function Rules() {
  return (
    <>
      <PageHead eyebrow="Business rules" title="Business rules" sub="Rules that decide how records are classified." />
      <Feature id="R10" title={`"${rule.name}"`} category="Customization"
        description="Needs custom work inside the CRM to evaluate automatically, or a governance process outside the CRM.">
        <blockquote className="card" style={{ margin: 0, background: '#F5F8F7', border: 0, fontSize: 16, color: 'var(--heading)' }}>
          {rule.text}
        </blockquote>
        <dl className="fields">
          <dt>Version</dt><dd>{rule.version}</dd>
          <dt>Status</dt><dd><Pill value={rule.status} /></dd>
          <dt>Approver</dt><dd>{rule.approver}</dd>
        </dl>
        <p className="muted small">This rule is still a proposal. Relationship status on employer records is set by staff until the rule is approved.</p>
      </Feature>
    </>
  );
}
