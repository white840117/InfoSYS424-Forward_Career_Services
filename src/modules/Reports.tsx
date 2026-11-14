import { reportAccess } from '../access';
import { Feature, PageHead, Pill } from '../components/ui';
import { useStore } from '../store';

export default function Reports() {
  const { role } = useStore();
  const deid = reportAccess(role.id) === 'deidentified';

  return (
    <>
      <PageHead eyebrow="Reports" title="Director engagement report"
        sub="Cross-domain reporting across employer engagement, events and advising." />

      <Feature id="R6" title="Engagement report" category="Configuration"
        description="Built with the CRM's report tools. Shows aggregate counts only; no individual student or note is ever listed.">
        <div className="note-info">
          {deid
            ? 'You are viewing as Director: aggregate, de-identified counts only. Advising data appears only as totals, never by student.'
            : `You are viewing as ${role.label}: aggregate counts only.`}
        </div>
        <div className="metric-placeholder" role="status">
          <strong>Metrics pending team decision</strong>
          Thomas Nguyen's required metrics were not confirmed in the Sprint 1 Review. The numbers will appear here once the team agrees on the list.
        </div>
      </Feature>

      <Feature id="R6" title="Report data sources" category="Integration"
        description="Event and advising counts depend on university system connections that are not built yet.">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Data</th><th>Comes from</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Employer engagement activities</td><td>University CRM (this system)</td><td><Pill value="Available in CRM" /></td></tr>
              <tr><td>Event participation</td><td>Event Platform</td><td><Pill value="Not connected" /></td></tr>
              <tr><td>Advising activity (de-identified counts)</td><td>Advising cases in the CRM, student reference data from the University Student System</td><td><Pill value="Not connected" /></td></tr>
            </tbody>
          </table>
        </div>
        <p className="muted small">Open questions on each connection are listed in Settings → Integrations.</p>
      </Feature>
    </>
  );
}
