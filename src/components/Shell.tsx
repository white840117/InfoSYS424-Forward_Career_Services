import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  return (
    <div className="role-switcher">
      <label htmlFor="role-select">
        Simulated university sign-in <span className="feature-id on-dark">R8</span>
      </label>
      <div className="role-row">
        <select id="role-select" value={role.id} onChange={(e) => setRole(e.target.value as RoleId)}>
          {ROLES.map((r) => (
            <option key={r.id} value={r.id}>{r.label}: {r.user}</option>
          ))}
        </select>
        <CategoryBadge category="Integration" />
      </div>
    </div>
  );
}

const NAV: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Overview', end: true },
  { to: '/employers', label: 'Employers' },
  { to: '/events', label: 'Events' },
  { to: '/cases', label: 'Cases' },
  { to: '/workflows', label: 'Tasks and follow-ups' },
  { to: '/reports', label: 'Reports' },
  { to: '/import', label: 'Import preview' },
  { to: '/rules', label: 'Business rules' },
  { to: '/access', label: 'Roles and access' },
  { to: '/integrations', label: 'Integrations' },
];

export function Shell({ children }: { children: ReactNode }) {
  const { role } = useStore();
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
          <div className="eyebrow-gray">WORKSPACE</div>
          <div className="ws-name">Career Services</div>
          <ul>
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.end}>{n.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <main id="main" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}
