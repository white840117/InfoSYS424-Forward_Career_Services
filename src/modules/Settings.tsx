import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { SETTINGS_FIXED } from '../access';
import { Feature, PageHead, ReadOnlyNote } from '../components/ui';
import { ROLES, useStore } from '../store';
import Access from './Access';
import Import from './Import';
import Integrations from './Integrations';
import Overview from './Overview';
import Rules from './Rules';

const TABS = [
  { to: 'about', label: 'About this mock-up' },
  { to: 'access', label: 'Roles and access' },
  { to: 'visibility', label: 'Settings access' },
  { to: 'import', label: 'Import preview' },
  { to: 'rules', label: 'Business rules' },
  { to: 'integrations', label: 'Integrations' },
];

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
      </Routes>
    </>
  );
}
