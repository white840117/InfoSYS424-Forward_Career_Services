import { Feature, PageHead } from '../components/ui';
import access from '../data/access.json';
import { useStore } from '../store';

export default function Access() {
  const { role } = useStore();
  const col = role.matrixColumn;
  return (
    <>
      <PageHead eyebrow="Settings" title="Roles and access"
        sub="Role-based access is confirmed by Client Update 2. The highlighted column is the role you are viewing as." />
      <Feature id="R3" title="Access matrix" category="Configuration"
        description="Security roles plus record-level access on advising cases. Every screen in this mock-up follows this table.">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Record type</th>
                {access.columns.map((c) => <th key={c.id} className={c.id === col ? 'hl' : undefined}>{c.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {access.rows.map((r) => (
                <tr key={r.record}>
                  <td style={{ fontWeight: 600 }}>{r.record}</td>
                  {access.columns.map((c) => {
                    const v = (r.cells as Record<string, string>)[c.id];
                    const cls = [c.id === col ? 'hl' : '', v === 'None' ? 'none' : ''].join(' ').trim();
                    return <td key={c.id} className={cls || undefined} style={c.id === col ? { fontWeight: 600 } : undefined}>{v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="note-assume">
          Assumed, to confirm with university IT: the CRM can limit an advising case to the student's assigned or backup
          advisor (record-level access). Role-level access alone would let every advisor see every note.
        </div>
        <div className="note-assume">
          Import roles are a team assumption: IT runs the one-time import and the Employer Relations Manager, as owner
          of employer data, reviews the result.
        </div>
      </Feature>
    </>
  );
}
