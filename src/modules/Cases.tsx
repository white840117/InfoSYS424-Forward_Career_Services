import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { canOpenAdvisingCase, mergeAccess } from '../access';
import { Feature, LockedPlaceholder, PageHead, Pill, ReadOnlyNote } from '../components/ui';
import { formatDate, useStore } from '../store';
import type { MergeReview } from '../types';
import { TaskView } from './Workflows';

function FlagForm() {
  const { employers, flagDuplicate } = useStore();
  const names = employers.flatMap((e) => [e.name, ...e.aliases]);
  const [a, setA] = useState(names[0]);
  const [b, setB] = useState(names[1]);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  return (
    <form className="form card" style={{ background: '#FAFBFA' }}
      onSubmit={(ev) => { ev.preventDefault(); if (a === b) return; flagDuplicate(a, b, note); setNote(''); setDone(true); }}>
      <label>Record A
        <select value={a} onChange={(e) => { setA(e.target.value); setDone(false); }}>{names.map((n) => <option key={n}>{n}</option>)}</select>
      </label>
      <label>Record B
        <select value={b} onChange={(e) => { setB(e.target.value); setDone(false); }}>{names.map((n) => <option key={n}>{n}</option>)}</select>
      </label>
      <label>Reason (optional)
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. same contact" />
      </label>
      <button className="btn" type="submit" disabled={a === b}>Flag possible duplicate</button>
      {a === b && <span className="muted small">Pick two different records.</span>}
      {done && <span role="status" style={{ color: 'var(--teal)' }}>Merge review case created and routed to the Employer Relations Manager.</span>}
    </form>
  );
}

function MergeCard({ m }: { m: MergeReview }) {
  const { role, decideMerge } = useStore();
  const pending = m.status === 'Pending manager decision';
  return (
    <article className="item">
      <div className="item-head">
        <strong style={{ fontSize: 15, color: 'var(--heading)' }}>{m.id} · Possible duplicate: {m.recordA} / {m.recordB}</strong>
        <Pill value={m.status} />
      </div>
      <div className="kv">
        <div><span>Case type</span>Employer merge review</div>
        <div><span>Flag source</span>{m.flagSource}</div>
        <div><span>Routed to</span>{m.routedTo}</div>
      </div>
      {pending && mergeAccess(role.id) === 'decide' && (
        <div className="btn-row">
          <button className="btn" onClick={() => decideMerge(m.id, true)}>Approve merge</button>
          <button className="btn danger" onClick={() => decideMerge(m.id, false)}>Reject</button>
        </div>
      )}
      {pending && mergeAccess(role.id) !== 'decide' && (
        <span className="muted small">Waiting for the Employer Relations Manager to approve or reject.</span>
      )}
    </article>
  );
}

export default function Cases() {
  const { role, mergeReviews, advisingCases } = useStore();
  const ma = mergeAccess(role.id);
  const open = mergeReviews.filter((m) => m.status === 'Pending manager decision');

  return (
    <>
      <PageHead eyebrow="Cases" title="Cases"
        sub="Two case types are configured: employer merge reviews and advising cases. Which cases appear depends on the signed-in role." />

      <Feature id="R4" title="Merge review cases" category="Configuration"
        description="A basic name/contact match, or a staff flag, creates a merge review case routed to the Employer Relations Manager, who approves or rejects. Manager as decider is a team assumption (M2 Decision Log).">
        {ma === 'none' ? (
          <LockedPlaceholder what="merge review cases" why="Career Advisors do not work on employer records." />
        ) : (
          <>
            {ma === 'view' && <ReadOnlyNote>Read-only: the Director can view merge reviews but does not decide them.</ReadOnlyNote>}
            {ma === 'create' && <FlagForm />}
            {open.length === 0 ? (
              <p className="muted">No open merge reviews. {ma === 'create' ? 'Flag a possible duplicate above to start one.' : ''}</p>
            ) : open.map((m) => <MergeCard key={m.id} m={m} />)}
          </>
        )}
      </Feature>

      <Feature id="R5" title="Merge history" category="Configuration"
        description="Change history for merge reviews: who flagged, who decided, when, and the outcome.">
        {ma === 'none' ? (
          <LockedPlaceholder what="merge history" />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Case</th><th>Records</th><th>Flagged by</th><th>Decided by</th><th>Outcome</th></tr>
              </thead>
              <tbody>
                {mergeReviews.map((m) => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{m.recordA}<span className="sub">{m.recordB}</span></td>
                    <td>{m.flaggedBy}<span className="sub">{m.flaggedAt}</span></td>
                    <td>{m.decidedBy ?? <span className="muted">Not decided yet</span>}{m.decidedAt && <span className="sub">{m.decidedAt}</span>}</td>
                    <td><Pill value={m.status} />{m.outcome && <span className="sub">{m.outcome}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Feature>

      <Feature id="R3" title="Advising cases" category="Configuration"
        description="Record-level access: an advising case opens only for the student's assigned or backup advisor.">
        {advisingCases.map((c) =>
          canOpenAdvisingCase(role.id, c) ? (
            <article key={c.id} className="item">
              <div className="item-head">
                <strong style={{ fontSize: 15, color: 'var(--heading)' }}>{c.id} · {c.student}</strong>
                <Link className="btn secondary" to={`/cases/${c.id}`}>Open case</Link>
              </div>
              <div className="kv">
                <div><span>Case type</span>Advising case (restricted)</div>
                <div><span>Assigned advisor</span>{c.assignedAdvisor}</div>
                <div><span>Backup advisor</span>{c.backupAdvisor}</div>
                <div><span>Who can open it</span>Assigned or backup advisor only</div>
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

export function AdvisingCaseView() {
  const { id } = useParams();
  const { role, advisingCases, toggleFollowUp } = useStore();
  const c = advisingCases.find((x) => x.id === id);
  if (!c) return <p>Case not found. <Link to="/cases">Back to cases</Link></p>;
  const allowed = canOpenAdvisingCase(role.id, c);
  const isBackup = role.id === 'advisorBackup';

  return (
    <>
      <Link className="back" to="/cases">← Cases</Link>
      {!allowed ? (
        <Feature id="R3" title="Advising case" category="Configuration"
          description="Record-level access: assigned or backup advisor only.">
          <LockedPlaceholder what="this advising case or its notes"
            why="Only the student's assigned or backup advisor can open it. Switch to Career Advisor (assigned) or (backup) to see the content." />
        </Feature>
      ) : (
        <>
          <div className="page-head">
            <div className="eyebrow">Student notes · {c.id}</div>
            <h1>{c.student}</h1>
          </div>
          <div className="grid-2" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)' }}>
            <Feature id="R3" title="Advising case" category="Configuration"
              description="Record-level access: assigned or backup advisor only.">
              <div className="card" style={{ background: '#F5F7FA', border: 0 }}>
                <dl className="fields">
                  <dt>Assigned advisor</dt><dd>{c.assignedAdvisor}<span className="muted small" style={{ display: 'block', fontWeight: 400 }}>{c.assignedAdvisorEmail}</span></dd>
                  <dt>Backup advisor</dt><dd>{c.backupAdvisor}</dd>
                </dl>
              </div>
              <div>
                <h3 style={{ marginBottom: 8 }}>Advising follow-up</h3>
                {c.followUps.map((f) => <TaskView key={f.id} task={f} onToggle={() => toggleFollowUp(c.id, f.id)} />)}
                <p className="muted small" style={{ marginTop: 6 }}>Follow-up workflow: R9 (Tasks and follow-ups).</p>
              </div>
            </Feature>

            <section className="private" aria-label="Private advising notes">
              <h2>Private advising notes</h2>
              <div className="private-head">
                <div className="t-meta">Advisor only</div>
                <div style={{ fontWeight: 500 }}>{role.user} · {isBackup ? 'Backup advisor' : 'Assigned advisor'}</div>
                <div className="muted small">Visible only to the assigned or backup advisor.</div>
              </div>
              {c.notes.map((n) => (
                <div key={n.date + n.title} className="stack" style={{ gap: 8 }}>
                  <span className="muted small">{formatDate(n.date)} · {n.type}</span>
                  <div className="private-note">
                    <strong style={{ fontSize: 17 }}>{n.title}</strong>
                    <p>{n.body}</p>
                    <span className="side-label">Follow-up</span>
                    <p>{c.followUps[0]?.title}</p>
                    <span style={{ color: 'var(--teal)', fontSize: 12, fontWeight: 500 }}>
                      Private to {c.assignedAdvisor} and backup advisor | Do not share
                    </span>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </>
      )}
    </>
  );
}
