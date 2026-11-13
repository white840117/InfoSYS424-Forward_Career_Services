import { Link, useParams } from 'react-router-dom';
import { activityAccess, employerAccess } from '../access';
import { Feature, Pill, ReadOnlyNote } from '../components/ui';
import picklists from '../data/picklists.json';
import { ACTIVITIES, formatDate, useStore } from '../store';
import { TaskItem } from './Workflows';

export default function EmployerRecord() {
  const { id } = useParams();
  const { role, employers, updateEmployer, tasks } = useStore();
  const e = employers.find((x) => x.id === id);
  if (!e) return <p>Employer not found. <Link to="/employers">Back to all employers</Link></p>;

  const canEdit = employerAccess(role.id) === 'edit';
  const act = activityAccess(role.id);
  const timeline = ACTIVITIES.filter((a) => a.employerId === e.id).sort((a, b) => b.date.localeCompare(a.date));
  const myTasks = tasks.filter((t) => t.employerId === e.id);

  return (
    <>
      <Link className="back" to="/employers">← All employers</Link>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <h1>{e.name}</h1>
        <span className="muted small">Relationship status</span><Pill value={e.relationshipStatus} />
        <span className="muted small">Recruiting stage</span>
        {e.recruitingStage === '(none)' ? <span className="muted">(none)</span> : <Pill value={e.recruitingStage} />}
      </div>

      <div className="grid-2">
        <Feature
          id="R2"
          title="Activity timeline"
          category="Configuration"
          description="Calls, tasks and employer events for this employer in one view."
        >
          {act === 'summary' && (
            <ReadOnlyNote>Summary view: Career Advisors see what happened and when, not the activity details.</ReadOnlyNote>
          )}
          {timeline.length === 0 && myTasks.length === 0 ? (
            <p className="muted">No activities recorded for this employer in the sample data.</p>
          ) : (
            <ol className="timeline">
              {myTasks.map((t) => (
                <li key={t.id}>
                  <span className="t-meta">Task · {t.status === 'Open' ? `Due ${t.due}` : 'Done'}</span>
                  <span className="t-title">{t.title}</span>
                  {act !== 'summary' && <span className="muted small">Assigned to {t.assignedTo} · see Follow-up task</span>}
                </li>
              ))}
              {timeline.map((a) => (
                <li key={a.id}>
                  <span className="t-meta">{formatDate(a.date, true)} · {a.type}</span>
                  <span className="t-title">{a.title}</span>
                  {act !== 'summary' && <p className="muted">{a.body}</p>}
                  {act !== 'summary' && a.loggedBy && <span className="muted small">Logged by {a.loggedBy} · Employer relations</span>}
                  {a.event && (
                    <span className="muted small">
                      Source: {a.event.source} (last imported {a.event.lastImported}) ·{' '}
                      <Link to={`/events/${a.id}`}>View event details →</Link>
                    </span>
                  )}
                </li>
              ))}
            </ol>
          )}
        </Feature>

        <div className="stack">
          <Feature id="R1" title="Employer record" category="Configuration"
            description="Relationship status and Recruiting stage are separate picklists with controlled values.">
            {!canEdit && <ReadOnlyNote>Read-only for {role.label}.</ReadOnlyNote>}
            <dl className="fields">
              <dt>Account name</dt><dd>{e.name}</dd>
              <dt>Aliases</dt><dd>{e.aliases.length ? e.aliases.join(', ') : <span className="muted">(none)</span>}</dd>
              <dt>Relationship owner</dt>
              <dd>
                {e.owner.name}
                <span className="sub muted small" style={{ display: 'block', fontWeight: 400 }}>
                  {e.owner.title}{e.owner.email && <> · {e.owner.email}</>}
                </span>
              </dd>
              <dt><label htmlFor="rel-status">Relationship status</label></dt>
              <dd>
                {canEdit ? (
                  <select id="rel-status" className="picklist" value={e.relationshipStatus}
                    onChange={(ev) => updateEmployer(e.id, { relationshipStatus: ev.target.value })}>
                    {picklists.relationshipStatus.map((v) => <option key={v}>{v}</option>)}
                  </select>
                ) : <Pill value={e.relationshipStatus} />}
              </dd>
              <dt><label htmlFor="rec-stage">Recruiting stage</label></dt>
              <dd>
                {canEdit ? (
                  <select id="rec-stage" className="picklist" value={e.recruitingStage}
                    onChange={(ev) => updateEmployer(e.id, { recruitingStage: ev.target.value })}>
                    {picklists.recruitingStage.map((v) => <option key={v}>{v}</option>)}
                  </select>
                ) : e.recruitingStage}
              </dd>
            </dl>
            <div>
              <div className="side-label" style={{ marginBottom: 8 }}>Associated contacts</div>
              {e.contacts.length === 0 ? (
                <p className="muted">{e.contactNote}</p>
              ) : e.contacts.map((c) => (
                <div key={c.name} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <strong style={{ fontSize: 16, color: 'var(--heading)' }}>{c.name}</strong>
                  <span className="muted">{c.title}</span>
                  {c.email && <span style={{ color: 'var(--teal)' }}>{c.email}</span>}
                </div>
              ))}
            </div>
          </Feature>

          {myTasks.length > 0 && (
            <Feature id="R9" title="Follow-up task" category="Configuration"
              description="Due date, status and reminder are configured workflow fields.">
              {myTasks.map((t) => <TaskItem key={t.id} task={t} />)}
            </Feature>
          )}
        </div>
      </div>
    </>
  );
}
