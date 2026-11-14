import { useState } from 'react';
import { mergeAccess } from '../access';
import { Feature, LockedPlaceholder, PageHead, Pill, ReadOnlyNote } from '../components/ui';
import { useStore } from '../store';
import type { MergeReview } from '../types';

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
  const decide = mergeAccess(role.id) === 'decide';
  return (
    <article className="item">
      <div className="item-head">
        <strong style={{ fontSize: 15, color: 'var(--heading)' }}>{m.id} · Possible duplicate: {m.recordA} / {m.recordB}</strong>
        <Pill value={m.status} />
      </div>
      <div className="kv">
        <div><span>Flag source</span>{m.flagSource}</div>
        <div><span>Flagged by</span>{m.flaggedBy}</div>
        <div><span>Routed to</span>{m.routedTo}</div>
      </div>
      {decide ? (
        <div className="btn-row">
          <button className="btn" onClick={() => decideMerge(m.id, true)}>Approve merge</button>
          <button className="btn danger" onClick={() => decideMerge(m.id, false)}>Reject</button>
        </div>
      ) : (
        <span className="muted small">Waiting for the Employer Relations Manager to approve or reject.</span>
      )}
    </article>
  );
}

export default function Duplicates() {
  const { role, mergeReviews } = useStore();
  const ma = mergeAccess(role.id);
  const open = mergeReviews.filter((m) => m.status === 'Pending manager decision');

  if (ma === 'none') {
    return (
      <>
        <PageHead eyebrow="Data quality" title="Duplicate review" />
        <LockedPlaceholder what="merge review cases" />
      </>
    );
  }

  return (
    <>
      <PageHead eyebrow="Data quality" title="Duplicate review"
        sub="Possible duplicate employer records, the manager's decision, and the history of every decision." />

      <Feature id="R4" title="Merge review cases" category="Configuration"
        description="A basic name/contact match, or a staff flag, creates a merge review case routed to the Employer Relations Manager, who approves or rejects. Manager as decider is a team assumption (M2 Decision Log).">
        {ma === 'view' && <ReadOnlyNote>Read-only: {role.label} can view merge reviews but does not decide them.</ReadOnlyNote>}
        {ma === 'create' && <FlagForm />}
        {open.length === 0 ? (
          <p className="muted">No open merge reviews.{ma === 'create' ? ' Flag a possible duplicate above to start one.' : ''}</p>
        ) : open.map((m) => <MergeCard key={m.id} m={m} />)}
      </Feature>

      <Feature id="R5" title="Merge history" category="Configuration"
        description="Change history for merge reviews: who flagged, who decided, when, and the outcome.">
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
      </Feature>
    </>
  );
}
