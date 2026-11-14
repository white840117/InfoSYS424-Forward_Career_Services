import { Feature, PageHead, Pill } from '../components/ui';
import employersData from '../data/employers.json';
import mergeData from '../data/mergeReviews.json';
import sheet from '../data/spreadsheet.json';
import type { Employer } from '../types';

const CANON = employersData as Employer[];
const CASE_FOR: Record<string, string> = { acme: mergeData[0].id, northstar: mergeData[1].id };
type Row = (typeof sheet.rows)[number];
const cell = (r: Row, c: string) => (r as unknown as Record<string, string>)[c];

export default function Import() {
  return (
    <>
      <PageHead eyebrow="Settings" title="Import preview"
        sub="One-time import of the case packet spreadsheet into the University CRM." />

      <Feature id="R7" title="Spreadsheet import preview" category="Configuration"
        description="Original rows on the left of the process, canonical employer records on the right. Duplicate rows are grouped and sent to merge review.">
        <h3>1. Original spreadsheet rows (case packet)</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Row</th>
                {sheet.columns.map((c) => <th key={c}>{c}{c === 'Student Notes?' && ' (not imported)'}</th>)}
                <th>Becomes</th>
              </tr>
            </thead>
            <tbody>
              {sheet.rows.map((r) => {
                const target = CANON.find((e) => e.id === r.becomes)!;
                return (
                  <tr key={r.row}>
                    <td>{r.row}</td>
                    {sheet.columns.map((c) => (
                      <td key={c} className={c === 'Student Notes?' ? 'struck' : undefined}>{cell(r, c)}</td>
                    ))}
                    <td>
                      <strong>{target.name}</strong>
                      {CASE_FOR[r.becomes] && <span className="sub">via merge review {CASE_FOR[r.becomes]}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="note-assume">
          The <strong>Student Notes?</strong> column is <strong>not carried into employer records</strong>. Student information
          belongs only in restricted advising cases (R3), never on an employer account.
        </div>

        <h3>2. Status split into two picklists</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Spreadsheet Status</th><th>Relationship status</th><th>Recruiting stage</th></tr></thead>
            <tbody>
              {sheet.statusMapping.map((m) => (
                <tr key={m.from}><td>{m.from}</td><td>{m.relationshipStatus}</td><td>{m.recruitingStage}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>3. Canonical records after import and merge review</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Employer</th><th>Alias</th><th>Contact</th><th>Owner</th><th>Relationship status</th><th>Recruiting stage</th><th>From rows</th></tr>
            </thead>
            <tbody>
              {CANON.map((e) => (
                <tr key={e.id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.aliases.join(', ') || <span className="muted">(none)</span>}</td>
                  <td>{e.contacts[0]?.name ?? <span className="muted">{e.contactNote}</span>}</td>
                  <td>{e.owner.name}</td>
                  <td><Pill value={e.relationshipStatus} /></td>
                  <td>{e.recruitingStage}</td>
                  <td>{sheet.rows.filter((r) => r.becomes === e.id).map((r) => r.row).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">Merge decisions for rows 1+2 and 3+5 are in Duplicate review → Merge history.</p>
      </Feature>
    </>
  );
}
