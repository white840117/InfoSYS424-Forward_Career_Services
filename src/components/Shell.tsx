import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MODULES, navFor, type ModuleId } from '../access';
import { ROLES, useStore } from '../store';
import type { RoleId } from '../types';
import { CategoryBadge } from './ui';

export function Banner() {
  return (
    <div className="banner" role="note">
      <strong>Reference mock-up, not the real product.</strong>{' '}
      Client Update 2 confirms only that the university licenses a CRM for contacts, cases, workflows and
      role-based access, which needs configuration and integration. The product is not named. Every feature
      below is labeled with how it would be delivered, as a team assumption. Sample data comes from the case
      packet and Sprint 1.
    </div>
  );
}

export function RoleSwitcher() {
  const { role, setRole } = useStore();
  const navigate = useNavigate();
  return (
    <div className="role-switcher">
      <label htmlFor="role-select">
        Simulated university sign-in <span className="feature-id on-dark">R8</span>
      </label>
      <div className="role-row">
        <select id="role-select" value={role.id} onChange={(e) => { setRole(e.target.value as RoleId); navigate('/'); }}>
          {ROLES.map((r) => (
            <option key={r.id} value={r.id}>{r.label}: {r.user}</option>
          ))}
        </select>
        <CategoryBadge category="Integration" />
      </div>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const { role, settingsRoles } = useStore();
  const nav = navFor(role.id, settingsRoles);
  const [navOpen, setNavOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => { setNavOpen(false); window.scrollTo(0, 0); }, [loc.pathname]);

  return (
    <div className="app">
      <a className="skip" href="#main">Skip to content</a>
      <header className="topbar">
        <div className="brand">
          <button
            className="nav-toggle"
            aria-expanded={navOpen}
            aria-controls="sidebar"
            onClick={() => setNavOpen((v) => !v)}
          >
            <span aria-hidden="true">☰</span><span className="sr-only">Menu</span>
          </button>
          <span className="product">University CRM</span>
          <span className="workspace">Forward Career Services</span>
        </div>
        <div className="topbar-right">
          <RoleSwitcher />
          <div className="signed-in">
            Signed in as <strong>{role.user}</strong> · {role.label}
          </div>
        </div>
      </header>
      <Banner />
      <div className="body">
        <nav id="sidebar" className={`sidebar ${navOpen ? 'open' : ''}`} aria-label="CRM modules">
          <ul>
            {nav.filter((m) => m !== 'settings').map((m) => (
              <li key={m}><NavLink to={MODULES[m].to}>{MODULES[m].label}</NavLink></li>
            ))}
          </ul>
          {nav.includes('settings') && (
            <ul className="nav-bottom">
              <li><NavLink to={MODULES.settings.to}>⚙ {MODULES.settings.label}</NavLink></li>
            </ul>
          )}
        </nav>
        <main id="main" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}

/** Sends "/" to the signed-in role's first module. */
export function HomeRedirect() {
  const { role, settingsRoles } = useStore();
  const first = navFor(role.id, settingsRoles)[0] ?? 'settings';
  return <Navigate to={MODULES[first].to} replace />;
}

/** Blocks a module that is not in the role's sidebar (e.g. opened by URL). */
export function ModuleGate({ module, children }: { module: ModuleId; children: ReactNode }) {
  const { role, settingsRoles } = useStore();
  if (navFor(role.id, settingsRoles).includes(module)) return <>{children}</>;
  return (
    <div className="locked" role="note">
      <div>
        <strong>Hidden: your role has no access to {MODULES[module].label}.</strong>
        <div className="muted small">{role.label} does not have this module in the navigation. Switch role in the top bar to view it.</div>
      </div>
    </div>
  );
}
