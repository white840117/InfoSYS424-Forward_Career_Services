// Director dashboard (R12): Thomas Nguyen's landing page. Aggregate and de-identified only.
// All counts come from the sample data; candidate metrics are labeled unconfirmed.
import { Link } from 'react-router-dom';
import { dashboardAccess } from '../access';
import {
  CANDIDATE_NOTE, CategoryBadge, Feature, LockedPlaceholder, PageHead, Pill, ReadOnlyNote, Tiles,
} from '../components/ui';
import features from '../data/features.json';
import integrations from '../data/integrations.json';
import rules from '../data/rules.json';
import { formatDate, useStore } from '../store';
import type { Category } from '../types';
import { dataQuality, employerTiles, ruleCheck, sourceTiles } from './metrics';

function Readiness() {
  const { rule } = useStore();
  const counts = (['Configuration', 'Customization', 'Integration'] as Category[]).map((c) => ({
    c, n: features.filter((f) => f.category === c).length,
  }));
  return (
    <section className="card stack" aria-labelledby="readiness">
      <div className="page-head">
        <div className="eyebrow">Project status, not a CRM feature</div>
        <h2 id="readiness">Readiness of the CRM recommendation</h2>
        <p className="muted">How the prototype's features would be delivered, and what must be confirmed before the team commits to configuring the university's CRM.</p>
      </div>
      <div className="readiness">
        <div className="stack" style={{ gap: 10 }}>
          <h3>Features by delivery type</h3>
          <ul className="plain">
            {counts.map(({ c, n }) => (
              <li key={c}><CategoryBadge category={c} /> <strong>{n}</strong> of {features.length}</li>
            ))}
          </ul>
          <Link to="/reports" className="small">See the full engagement report</Link>
        </div>
        <div className="stack" style={{ gap: 10 }}>
          <h3>Needs university IT to confirm</h3>
          <ul className="plain bullets">
            {integrations.map((i) => <li key={i.name}>{i.name}: {i.status.toLowerCase()}</li>)}
            <li>Record-level access for advising cases (R3)</li>
            <li>Note access logging (R14)</li>
          </ul>
        </div>
        <div className="stack" style={{ gap: 10 }}>
          <h3>Waiting on the Director</h3>
          <ul className="plain bullets">
            <li>Confirm the report metrics</li>
            <li>Active employer rule, version 1: {rule.status === 'Approved' ? 'approved this session' : 'not yet approved'}</li>
            <li>Who designates backup advisors, and whether students are told</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const { role, employers, tasks, mergeReviews, advisingCases, rule, approveRule } = useStore();
  const access = dashboardAccess(role.id);
  const head = (
    <PageHead eyebrow="Director" title="Director dashboard"
      sub={`Engagement, rule status, data quality and readiness of the CRM recommendation. Aggregate and de-identified only. As of ${formatDate(new Date().toISOString().slice(0, 10))}.`} />
  );
  if (access === 'none') {
    return <>{head}<LockedPlaceholder what="the Director dashboard" /></>;
  }

  const rows = ruleCheck(employers);
  const issues = dataQuality(employers, mergeReviews, rows);

  return (
    <>
      {head}
      {access === 'view' && <ReadOnlyNote>Read-only: {role.label} can view the dashboard; only the Director approves the rule.</ReadOnlyNote>}

      <Feature id="R12" title="Engagement at a glance" category="Configuration"
        description="Built from employer records, activities and tasks already in the CRM.">
        <Tiles tiles={employerTiles(employers, tasks)} />
        <p className="note-assume">{CANDIDATE_NOTE}</p>
      </Feature>

      <Feature id="R10" title="Active employer rule check" category="Customization"
        description="Applies the proposed rule to each employer and compares it with the recorded status. Applying it automatically would need custom work in the CRM."
        actions={access === 'approve' && rule.status !== 'Approved'
          ? <button className="btn" type="button" onClick={approveRule}>Approve version 1</button>
          : undefined}>
        <blockquote className="rule-text">{rules.text}</blockquote>
        <div className="btn-row" style={{ alignItems: 'center' }}>
          <span className="muted small">Version 1 (Sprint 1 proposal) ·</span>
          <Pill value={rule.status} />
          {rule.approvedBy && <span className="muted small">by {rule.approvedBy}, {rule.approvedAt}</span>}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Employer</th><th>Recorded status</th><th>Last activity</th><th>Rule gives</th><th>Check</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.employer.id}>
                  <td><Link className="row-link" to={`/employers/${r.employer.id}`}>{r.employer.name}</Link></td>
                  <td><Pill value={r.employer.relationshipStatus} /></td>
                  <td>{r.last.iso ? formatDate(r.last.iso) : r.last.label}<span className="sub">{r.last.source}</span></td>
                  <td>{r.result}</td>
                  <td><Pill value={r.verdict} /><span className="sub">{r.note}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">Approval lasts for this browser session. It does not change recorded statuses: staff update them until the rule can be applied automatically.</p>
      </Feature>

      <Feature id="R12" title="Data-quality flags" category="Configuration"
        description="Problems to fix before these numbers go to leadership.">
        {issues.length === 0 ? <p className="muted">No open data-quality flags.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Where</th><th>Issue</th><th>Fix</th></tr></thead>
              <tbody>
                {issues.map((i, n) => (
                  <tr key={n}><td>{i.area}</td><td>{i.text}</td><td>{i.fix}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Feature>

      <Feature id="R6" title="Event and advising totals" category="Integration"
        description="Sample totals. Live values need the Event Platform and University Student System connections, which are not built yet.">
        <Tiles tiles={sourceTiles(employers, advisingCases)} />
        <p className="muted small">Advising data appears only as totals. No student name or note is shown here. Connection status: <Link to="/reports">Engagement report → Report data sources</Link>.</p>
      </Feature>

      <Readiness />
    </>
  );
}
