import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardAccess, employerAccess } from '../access';
import { Feature, PageHead, Pill, ReadOnlyNote } from '../components/ui';
import { ACTIVITIES, formatDate, useStore } from '../store';

export function lastActivity(employerId: string) {
  return ACTIVITIES.filter((a) => a.employerId === employerId).sort((a, b) => b.date.localeCompare(a.date))[0];
}

export default function Contacts() {
  const { role, employers, rule } = useStore();
  const nav = useNavigate();
  const access = employerAccess(role.id);
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();
  const shown = term
    ? employers.filter((e) => [e.name, ...e.aliases, ...e.contacts.map((c) => c.name)]
      .some((v) => v.toLowerCase().includes(term)))
    : employers;

  return (
    <>
      <PageHead eyebrow="Employers / Accounts" title="All employers" sub="Employer account view: owners, contacts and recent engagement" />
      <Feature
        id="R1"
        title="Employer accounts and contacts"
        category="Configuration"
        description="Standard contact records. Aliases, relationship owner, Relationship status and Recruiting stage are configured fields with controlled values. Search matches the canonical name, any alias, or a contact."
      >
        {access === 'view' && (
          <ReadOnlyNote>
            Read-only: {role.label} can view employer records but cannot change them.
          </ReadOnlyNote>
        )}
        <div className="search-row">
          <label htmlFor="emp-search" className="sr-only">Search employers by name, alias or contact</label>
          <input id="emp-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, alias or contact (try North Star)" />
          <span className="muted" role="status" style={{ fontWeight: 500 }}>
            {term ? `${shown.length} of ${employers.length} employers` : `${employers.length} employers`}
          </span>
        </div>
        <p className="muted small" style={{ margin: 0 }}>
          Relationship status follows the active employer rule, version 1 ({rule.status === 'Approved' ? 'approved' : 'pending Director approval'}):
          active if there is any recorded engagement in the last 12 months.
          {dashboardAccess(role.id) !== 'none' && <> See the rule check on the <Link to="/dashboard">Director dashboard</Link>.</>}
        </p>
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
              {shown.length === 0 && (
                <tr><td colSpan={6} className="muted">No employer matches "{q.trim()}". Check the spelling, or add the employer if it is new.</td></tr>
              )}
              {shown.map((e) => {
                const last = lastActivity(e.id);
                return (
                  <tr key={e.id} className="clickable" onClick={() => nav(`/employers/${e.id}`)}>
                    <td>
                      <Link className="row-link" to={`/employers/${e.id}`} onClick={(ev) => ev.stopPropagation()}>{e.name}</Link>
                      <span className="sub">{e.aliases.length ? `Alias: ${e.aliases.join(', ')}` : 'No alias'}</span>
                      {term && !e.name.toLowerCase().includes(term) && e.aliases.some((a) => a.toLowerCase().includes(term)) && (
                        <span className="sub" style={{ color: 'var(--teal)' }}>Matched by alias</span>
                      )}
                    </td>
                    <td>{e.owner.name}</td>
                    <td>{e.contacts[0]?.name ?? <span className="muted">{e.contactNote}</span>}</td>
                    <td><Pill value={e.relationshipStatus} /></td>
                    <td>{e.recruitingStage === '(none)' ? <span className="muted">(none)</span> : <Pill value={e.recruitingStage} />}</td>
                    <td>
                      {last ? (<>{formatDate(last.date)}<span className="sub">{last.type}</span></>)
                        : e.importedLastActivity ? (<>{e.importedLastActivity}<span className="sub">From spreadsheet import</span></>)
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
