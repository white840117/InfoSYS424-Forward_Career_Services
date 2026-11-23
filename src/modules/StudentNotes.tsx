import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { canOpenAdvisingCase } from '../access';
import { Feature, LockedPlaceholder, PageHead, Pill } from '../components/ui';
import { formatDate, useStore } from '../store';
import type { AdvisingCase } from '../types';
import { TaskView } from './Workflows';

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function StudentNotes() {
  const { role, advisingCases } = useStore();
  return (
    <>
      <PageHead eyebrow="Advising" title="Student Notes"
        sub="Advising cases and private session notes. Each case opens only for the student's assigned or backup advisor." />
      <Feature id="R3" title="My advising cases" category="Configuration"
        description="Record-level access: an advising case opens only for the student's assigned or backup advisor.">
        {advisingCases.map((c) =>
          canOpenAdvisingCase(role.id, c) ? (
            <article key={c.id} className="item">
              <div className="item-head">
                <strong style={{ fontSize: 15, color: 'var(--heading)' }}>{c.student}</strong>
                <Link className="btn secondary" to={`/notes/${c.id}`}>Open notes</Link>
              </div>
              <div className="kv">
                <div><span>Case</span>{c.id}</div>
                <div><span>Assigned advisor</span>{c.assignedAdvisor}</div>
                <div><span>Backup advisor</span>{c.backupAdvisor}</div>
                <div><span>Notes</span>{c.notes.length}</div>
              </div>
            </article>
          ) : (
            <LockedPlaceholder key={c.id} what="this advising case"
              why="Advising cases and private notes are visible only to the student's assigned or backup advisor." />
          ),
        )}
      </Feature>
    </>
  );
}

function AddNoteForm({ c, onDone }: { c: AdvisingCase; onDone: () => void }) {
  const { addNote } = useStore();
  const [date, setDate] = useState(today);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [due, setDue] = useState('');
  const needsText = !!due && !followUp.trim();
  const ok = title.trim() && body.trim() && !needsText;
  return (
    <form className="private-note" aria-label="Add note"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ok) return;
        addNote(c.id, { date, type: 'Career advising', title, body, followUp, followUpDue: due });
        onDone();
      }}>
      <strong style={{ fontSize: 16 }}>New advising note</strong>
      <div className="form" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <label>Session date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
        <label>Note type<input value="Career advising" readOnly aria-readonly="true" /></label>
      </div>
      <div className="form" style={{ gridTemplateColumns: '1fr' }}>
        <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
        <label>Note<textarea value={body} onChange={(e) => setBody(e.target.value)} required /></label>
      </div>
      <div className="form" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <label>Follow-up (optional)<input value={followUp} onChange={(e) => setFollowUp(e.target.value)} /></label>
        <label>Follow-up due date<input type="date" value={due} onChange={(e) => setDue(e.target.value)} /></label>
      </div>
      {needsText && <span className="muted small" role="status">Add the follow-up text to go with this due date.</span>}
      <div className="btn-row">
        <button className="btn" type="submit" disabled={!ok}>Save note</button>
        <button className="btn secondary" type="button" onClick={onDone}>Cancel</button>
      </div>
      <span className="muted small">Saved only for this browser session. A follow-up with text is also added to the case follow-ups (R9).</span>
    </form>
  );
}

export function AdvisingCaseView() {
  const { id } = useParams();
  const { role, advisingCases, toggleFollowUp, noteLog, logNoteAccess } = useStore();
  const [adding, setAdding] = useState(false);
  const c = advisingCases.find((x) => x.id === id);
  const allowed = !!c && canOpenAdvisingCase(role.id, c);

  // R14: record each opening (or blocked attempt) once per case and role.
  const logged = useRef('');
  useEffect(() => {
    if (!c) return;
    const key = `${c.id}|${role.id}`;
    if (logged.current === key) return;
    logged.current = key;
    logNoteAccess(c.id, allowed ? 'Opened case' : 'Blocked: no access');
  }, [c?.id, role.id, allowed]);

  if (!c) return <p>Case not found. <Link to="/notes">Back to Student Notes</Link></p>;
  const isBackup = role.id === 'advisorBackup';

  return (
    <>
      <Link className="back" to="/notes">← Student Notes</Link>
      {!allowed ? (
        <Feature id="R3" title="Advising case" category="Configuration"
          description="Record-level access: assigned or backup advisor only.">
          <LockedPlaceholder what="this advising case or its notes"
            why="Only the student's assigned or backup advisor can open it. Switch to Career Advisor (assigned) or (backup) to see the content." />
        </Feature>
      ) : (
        <>
          <div className="page-head">
            <div className="eyebrow">Student Notes · {c.id}</div>
            <h1>{c.student}</h1>
          </div>
          <div className="grid-2" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.3fr)' }}>
            <Feature id="R3" title="Advising case" category="Configuration"
              description="Record-level access: assigned or backup advisor only.">
              <div className="card" style={{ background: '#F5F7FA', border: 0 }}>
                <dl className="fields stacked">
                  <dt>Assigned advisor</dt><dd>{c.assignedAdvisor}<span className="muted small" style={{ display: 'block', fontWeight: 400 }}>{c.assignedAdvisorEmail}</span></dd>
                  <dt>Backup advisor</dt><dd>{c.backupAdvisor}</dd>
                </dl>
              </div>
              <div className="stack" style={{ gap: 8 }}>
                <h3>Advising follow-ups</h3>
                {c.followUps.map((f) => <TaskView key={f.id} task={f} onToggle={() => toggleFollowUp(c.id, f.id)} />)}
                <p className="muted small">Follow-up workflow: R9 (Tasks and follow-ups).</p>
              </div>
            </Feature>

            <section className="private" aria-label="Private advising notes">
              <div className="item-head">
                <h2>Private advising notes</h2>
                {!adding && <button className="btn" onClick={() => setAdding(true)}>+ Add note</button>}
              </div>
              <div className="private-head">
                <div className="t-meta">Advisor only</div>
                <div style={{ fontWeight: 500 }}>{role.user} · {isBackup ? 'Backup advisor' : 'Assigned advisor'}</div>
                <div className="muted small">Visible only to the assigned or backup advisor.</div>
              </div>
              {adding && <AddNoteForm c={c} onDone={() => setAdding(false)} />}
              {c.notes.map((n, i) => (
                <div key={i} className="stack" style={{ gap: 8 }}>
                  <span className="muted small">{formatDate(n.date)} · {n.type} · by {n.author}</span>
                  <div className="private-note">
                    <strong style={{ fontSize: 17 }}>{n.title}</strong>
                    <p>{n.body}</p>
                    {n.followUp && (<><span className="side-label">Follow-up</span><p>{n.followUp}</p></>)}
                    <span style={{ color: 'var(--teal)', fontSize: 12, fontWeight: 500 }}>
                      Private to {c.assignedAdvisor} and backup advisor | Do not share
                    </span>
                  </div>
                </div>
              ))}
            </section>
          </div>
          <Feature id="R14" title="Access history for this case" category="Configuration"
            description="Every time someone opens this case, adds a note, or is blocked, the CRM records who and when. The log holds no note content.">
            <AccessLogTable entries={noteLog.filter((e) => e.caseId === c.id)} />
          </Feature>
        </>
      )}
    </>
  );
}

/** R14 log rows. Shared with Settings → Note access log. */
export function AccessLogTable({ entries, showCase }: { entries: { id: string; caseId: string; who: string; role: string; action: string; at: string }[]; showCase?: boolean }) {
  if (entries.length === 0) {
    return <p className="muted">No access recorded yet in this session. Open an advising case as any role to add an entry.</p>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{showCase && <th>Case</th>}<th>Who</th><th>Action</th><th>When</th></tr></thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
              {showCase && <td>{e.caseId}</td>}
              <td>{e.who}<span className="sub">{e.role}</span></td>
              <td><Pill value={e.action === 'Blocked: no access' ? 'Blocked' : e.action} /></td>
              <td>{e.at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
