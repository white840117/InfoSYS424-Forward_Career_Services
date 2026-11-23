import { Link, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { noteLogAccess, SETTINGS_FIXED } from '../access';
import { CategoryBadge, Feature, LockedPlaceholder, PageHead, ReadOnlyNote } from '../components/ui';
import features from '../data/features.json';
import type { Category } from '../types';
import { ROLES, useStore } from '../store';
import Access from './Access';
import Import from './Import';
import Integrations from './Integrations';
import Overview from './Overview';
import Rules from './Rules';
import { AccessLogTable } from './StudentNotes';

const TABS = [
  { to: 'about', label: 'About this mock-up' },
  { to: 'access', label: 'Roles and access' },
  { to: 'visibility', label: 'Settings access' },
  { to: 'import', label: 'Import preview' },
  { to: 'rules', label: 'Business rules' },
  { to: 'integrations', label: 'Integrations' },
  { to: 'note-log', label: 'Note access log' },
  { to: 'trace', label: 'Requirements trace' },
];

function RequirementsTrace() {
  return (
    <>
      <PageHead eyebrow="Settings" title="Requirements trace"
        sub="Every feature in this mock-up, how it would be delivered, the requirement it traces to, and where to see it." />
      <section className="card stack" aria-label="Feature list">
        <p className="muted">Delivery types are team assumptions, not confirmed product facts. Features added for Milestone 3 are marked M3.</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Feature</th><th>Delivered by</th><th>Traces to</th><th>Where</th></tr></thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.id}>
                  <td><strong>{f.id}</strong><span className="sub">{f.added}</span></td>
                  <td>{f.feature}</td>
                  <td><CategoryBadge category={f.category as Category} /></td>
                  <td>{f.trace}</td>
                  <td><Link to={f.path}>{f.where}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function NoteLog() {
  const { role, noteLog } = useStore();
  return (
    <>
      <PageHead eyebrow="Settings" title="Note access log"
        sub="Who opened, added to, or was blocked from an advising case. No note content is stored here." />
      <Feature id="R14" title="Advising note access log" category="Configuration"
        description="Audit history for advising cases (M1: log who accessed advising notes). Team assumption: the CRM keeps this history for record-level access; university IT must confirm.">
        {noteLogAccess(role.id)
          ? <AccessLogTable entries={noteLog} showCase />
          : <LockedPlaceholder what="the note access log" why="Only University IT and the Administrator review it." />}
        <p className="muted small">Entries last only for this browser session. To add entries, open Jordan Lee's case (Student Notes → Open notes) as Career Advisor (assigned), then switch to Career Advisor (not assigned) and go to #/notes/CASE-0002 to record a blocked attempt.</p>
      </Feature>
    </>
  );
}

function SettingsAccess() {
  const { role, settingsRoles, setSettingsAccess } = useStore();
  const canManage = SETTINGS_FIXED.includes(role.id);
  return (
    <>
    <PageHead eyebrow="Settings" title="Settings access" sub="Decide which roles can open the Settings area." />
    <Feature id="A1" title="Who can open Settings" category="Configuration"
      description="Role-based access to the Settings area. University IT and the Administrator always have it; other roles can be granted here.">
      {!canManage && <ReadOnlyNote>Read-only: only University IT and the Administrator can change this.</ReadOnlyNote>}
      <div className="stack" style={{ gap: 4 }}>
        {ROLES.map((r) => {
          const fixed = SETTINGS_FIXED.includes(r.id);
          return (
            <label key={r.id} className="toggle-row">
              <input type="checkbox" checked={settingsRoles.includes(r.id)} disabled={fixed || !canManage}
                onChange={(e) => setSettingsAccess(r.id, e.target.checked)} />
              <span><strong>{r.label}</strong> <span className="muted">· {r.user}{fixed ? ' · always' : ''}</span></span>
            </label>
          );
        })}
      </div>
      <p className="muted small">Changes last only for this browser session. A role that is granted access sees Settings at the bottom of its sidebar.</p>
    </Feature>
    </>
  );
}

export default function Settings() {
  return (
    <>
      <nav className="subtabs" aria-label="Settings sections">
        {TABS.map((t) => <NavLink key={t.to} to={t.to}>{t.label}</NavLink>)}
      </nav>
      <Routes>
        <Route index element={<Navigate to="about" replace />} />
        <Route path="about" element={<Overview />} />
        <Route path="access" element={<Access />} />
        <Route path="visibility" element={<SettingsAccess />} />
        <Route path="import" element={<Import />} />
        <Route path="rules" element={<Rules />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="note-log" element={<NoteLog />} />
        <Route path="trace" element={<RequirementsTrace />} />
      </Routes>
    </>
  );
}
