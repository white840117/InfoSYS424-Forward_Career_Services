import { importAccess } from '../access';
import { Feature, LockedPlaceholder, PageHead, Pill, ReadOnlyNote } from '../components/ui';
import { useStore } from '../store';
import employersData from '../data/employers.json';
import mergeData from '../data/mergeReviews.json';
import sheet from '../data/spreadsheet.json';
import type { Employer } from '../types';

const CANON = employersData as Employer[];
const CASE_FOR: Record<string, string> = { acme: mergeData[0].id, northstar: mergeData[1].id };
type Row = (typeof sheet.rows)[number];
const cell = (r: Row, c: string) => (r as unknown as Record<string, string>)[c];

export default function Import() {
  const { role } = useStore();
  const access = importAccess(role.id);
  const head = (
    <PageHead eyebrow="Settings" title="Import preview"
      sub="One-time import of the case packet spreadsheet into the University CRM." />
  );
  if (access === 'none') {
    return (
      <>
        {head}
        <LockedPlaceholder what="the spreadsheet import"
          why="Only University IT, the Administrator and the Employer Relations Manager work with the import." />
      </>
    );
  }
  return (
    <>
      {head}

      <Feature id="R7" title="Spreadsheet import preview" category="Configuration"
        description="Original rows on the left of the process, canonical employer records on the right. Duplicate rows are grouped and sent to merge review.">
        <ReadOnlyNote>
          {access === 'run'
            ? `Your role: Run import. ${role.label} runs the one-time import (simulated: no import action in this mock-up).`
            : `Your role: Review results. ${role.label}, as owner of employer data, reviews the imported records.`}
        </ReadOnlyNote>
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
              <tr><th>Employer</th><th>Alias</th><th>Contact</th><th>Owner</th><th>Relationship status</th><th>Recruiting stage</th><th>Last activity</th><th>From rows</th></tr>
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
                  <td>{e.importedLastActivity ?? <span className="muted">(none)</span>}</td>
                  <td>{sheet.rows.filter((r) => r.becomes === e.id).map((r) => r.row).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">Merge decisions for rows 1+2 and 3+5 are in Duplicate review → Merge history.</p>
      </Feature>

      <Feature id="R13" title="Spreadsheet retirement plan" category="Configuration"
        description="Client Update 3: the CRM must replace routine spreadsheet tracking, not add another place to update. This is the proposed path from import to a retired spreadsheet.">
        <h3>1. Where each spreadsheet column lives after import</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Spreadsheet column</th><th>In the University CRM</th><th>Feature</th></tr></thead>
            <tbody>
              {COLUMN_MAP.map((c) => (
                <tr key={c.column}>
                  <td className={c.column === 'Student Notes?' ? 'struck' : undefined}>{c.column}</td>
                  <td>{c.becomes}</td>
                  <td>{c.feature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>2. Cutover steps (proposed, dates not set)</h3>
        <ol className="steps">
          {CUTOVER.map((c, i) => (
            <li key={c.step}>
              <span className="who">Step {i + 1} · {c.who}</span>
              <span>{c.step}</span>
              <Pill value={i === 0 ? 'Done (sample)' : 'Pending'} />
            </li>
          ))}
        </ol>
        <p className="muted small">
          Step 1 used the case packet sample: {sheet.rows.length} spreadsheet rows became {CANON.length} employer
          records after {mergeData.length} approved merges.
        </p>

        <h3>3. What staff stop doing</h3>
        <ul className="plain bullets">
          <li>Updating the shared employer spreadsheet. New employers and changes go into the CRM only.</li>
          <li>Keeping relationship owners or status in separate lists. Each employer has one owner and two controlled fields (R1).</li>
          <li>Combining spreadsheets by hand for leadership. The Director reads the dashboard and report (R6, R12).</li>
        </ul>
        <div className="note-assume">
          Team assumption: retiring the spreadsheet still needs agreement from the Employer Relations Manager and the
          Director, and no archive date has been set. Until step 3 happens, the spreadsheet remains a parallel record.
        </div>
      </Feature>
    </>
  );
}

const COLUMN_MAP = [
  { column: 'Organization', becomes: 'Employer name (one canonical record); other spellings kept as aliases', feature: 'R1' },
  { column: 'Contact', becomes: 'Contact record linked to the employer', feature: 'R1' },
  { column: 'Owner', becomes: 'Relationship owner: exactly one per employer', feature: 'R1' },
  { column: 'Last Activity', becomes: 'Activity timeline; the latest date is calculated, not typed', feature: 'R2' },
  { column: 'Student Notes?', becomes: 'Not imported. Advising notes stay in restricted advising cases', feature: 'R3' },
  { column: 'Status', becomes: 'Relationship status and Recruiting stage picklists', feature: 'R1' },
];

const CUTOVER = [
  { who: 'University IT', step: 'Import the spreadsheet; duplicates go to merge review' },
  { who: 'Employer Relations Manager', step: 'Check the imported records and clear data-quality flags' },
  { who: 'Employer Relations Manager', step: 'Set the spreadsheet to a read-only archive' },
  { who: 'Employer-relations staff', step: 'Add and update employers only in the CRM' },
];
