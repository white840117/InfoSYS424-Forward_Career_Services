import { Link } from 'react-router-dom';
import { dashboardAccess, reportAccess } from '../access';
import { CANDIDATE_NOTE, Feature, PageHead, Pill, Tiles } from '../components/ui';
import { useStore } from '../store';
import { employerTiles } from './metrics';

export default function Reports() {
  const { role, employers, tasks } = useStore();
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
        <Tiles tiles={employerTiles(employers, tasks)} />
        <p className="note-assume">{CANDIDATE_NOTE} Counts come from the sample data only.</p>
        {dashboardAccess(role.id) !== 'none' && (
          <p className="small">Rule check, data-quality flags and advising totals: <Link to="/dashboard">Director dashboard</Link>.</p>
        )}
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
