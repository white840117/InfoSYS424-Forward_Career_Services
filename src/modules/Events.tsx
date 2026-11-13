// The Events page reads the same activity records as the employer timeline, so an
// event can never appear in one place and not the other (Sprint 1 Review fix).
import { Link, useNavigate, useParams } from 'react-router-dom';
import { activityAccess } from '../access';
import { Feature, PageHead, ReadOnlyNote } from '../components/ui';
import { ACTIVITIES, formatDate, useStore } from '../store';

const EVENTS = ACTIVITIES.filter((a) => a.event);

export function EventsDirectory() {
  const { employers } = useStore();
  const nav = useNavigate();
  const name = (id: string) => employers.find((e) => e.id === id)?.name ?? id;
  return (
    <>
      <PageHead eyebrow="Events" title="Events" sub="Employer participation records" />
      <Feature id="R2" title="Employer event participation" category="Configuration"
        description="Event activities shown here are the same records that appear on each employer's activity timeline.">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Event</th><th>Date</th><th>Employer</th><th>Participation</th></tr></thead>
            <tbody>
              {EVENTS.map((ev) => (
                <tr key={ev.id} className="clickable" onClick={() => nav(`/events/${ev.id}`)}>
                  <td><Link className="row-link" to={`/events/${ev.id}`} onClick={(x) => x.stopPropagation()}>{ev.title}</Link></td>
                  <td>{formatDate(ev.date)}</td>
                  <td>{name(ev.employerId)}</td>
                  <td>{ev.event!.participation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Feature>
    </>
  );
}

export function EventRecord() {
  const { id } = useParams();
  const { role, employers } = useStore();
  const ev = EVENTS.find((x) => x.id === id);
  if (!ev) return <p>Event not found. <Link to="/events">Back to events</Link></p>;
  const emp = employers.find((e) => e.id === ev.employerId);
  const summary = activityAccess(role.id) === 'summary';
  const d = ev.event!;

  return (
    <>
      <div className="btn-row">
        <Link className="back" to="/events">← Events</Link>
        {emp && <Link className="back" to={`/employers/${emp.id}`} style={{ marginLeft: 16 }}>← {emp.name}</Link>}
      </div>
      <Feature id="R2" title={ev.title} category="Configuration" description="Employer event activity · related activity record">
        {summary && <ReadOnlyNote>Summary view: Career Advisors see the event and participation, not the contact details.</ReadOnlyNote>}
        <dl className="fields card" style={{ background: '#F5F8F7', border: 0 }}>
          <dt>Employer</dt><dd>{emp ? <Link to={`/employers/${emp.id}`}>{emp.name}</Link> : ev.employerId}</dd>
          <dt>Date</dt><dd>{formatDate(ev.date)}</dd>
          <dt>Participation</dt><dd>{d.participation}</dd>
          {!summary && (<><dt>Employer representative</dt><dd>{d.representative}</dd></>)}
        </dl>
        <div className="source-box">
          <strong>Source: {d.source}</strong>
          <span className="muted small">Last imported: {d.lastImported} (sample)</span>
          <span>Imported source record. Maintain participation in the event platform. The connection is not built yet; see <Link to="/integrations">Integrations</Link>.</span>
        </div>
      </Feature>
    </>
  );
}
