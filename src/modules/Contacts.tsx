import { Link, useNavigate } from 'react-router-dom';
import { employerAccess } from '../access';
import { Feature, PageHead, Pill, ReadOnlyNote } from '../components/ui';
import { ACTIVITIES, formatDate, useStore } from '../store';

export function lastActivity(employerId: string) {
  return ACTIVITIES.filter((a) => a.employerId === employerId).sort((a, b) => b.date.localeCompare(a.date))[0];
}

export default function Contacts() {
  const { role, employers } = useStore();
  const nav = useNavigate();
  const access = employerAccess(role.id);

  return (
    <>
      <PageHead eyebrow="Employers / Accounts" title="All employers" sub="Employer account view: owners, contacts and recent engagement" />
      <Feature
        id="R1"
        title="Employer accounts and contacts"
        category="Configuration"
        description="Standard contact records. Aliases, relationship owner, Relationship status and Recruiting stage are configured fields with controlled values."
      >
        {access === 'view' && (
          <ReadOnlyNote>
            Read-only: {role.label} can view employer records but cannot change them.
          </ReadOnlyNote>
        )}
        <div className="muted" style={{ fontWeight: 500 }}>{employers.length} employers</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employer</th>
                <th>Relationship owner</th>
                <th>Primary contact</th>
                <th>Relationship status</th>
                <th>Recruiting stage</th>
                <th>Last engagement</th>
              </tr>
            </thead>
            <tbody>
              {employers.map((e) => {
                const last = lastActivity(e.id);
                return (
                  <tr key={e.id} className="clickable" onClick={() => nav(`/employers/${e.id}`)}>
                    <td>
                      <Link className="row-link" to={`/employers/${e.id}`} onClick={(ev) => ev.stopPropagation()}>{e.name}</Link>
                      <span className="sub">{e.aliases.length ? `Alias: ${e.aliases.join(', ')}` : 'No alias'}</span>
                    </td>
                    <td>{e.owner.name}</td>
                    <td>{e.contacts[0]?.name ?? <span className="muted">{e.contactNote}</span>}</td>
                    <td><Pill value={e.relationshipStatus} /></td>
                    <td>{e.recruitingStage === '(none)' ? <span className="muted">(none)</span> : <Pill value={e.recruitingStage} />}</td>
                    <td>
                      {last ? (<>{formatDate(last.date)}<span className="sub">{last.type}</span></>)
                        : <span className="muted">No activity in sample data</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Feature>
    </>
  );
}
