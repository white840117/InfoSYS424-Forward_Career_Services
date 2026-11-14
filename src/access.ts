// Access rules from README Section 4, plus the two demo roles added after team
// feedback (University IT, Administrator). All UI permission checks go through here.
import type { AdvisingCase, RoleId } from './types';

const isAdvisor = (r: RoleId) =>
  r === 'advisorAssigned' || r === 'advisorBackup' || r === 'advisorOther';

/** Employer accounts and contacts */
export function employerAccess(r: RoleId): 'edit' | 'view' {
  return r === 'staff' || r === 'manager' ? 'edit' : 'view';
}

/** Engagement activities and tasks */
export function activityAccess(r: RoleId): 'edit' | 'summary' | 'view' {
  if (r === 'staff' || r === 'manager') return 'edit';
  if (isAdvisor(r)) return 'summary';
  return 'view';
}

/** Merge review cases */
export function mergeAccess(r: RoleId): 'create' | 'decide' | 'view' | 'none' {
  if (r === 'staff') return 'create';
  if (r === 'manager') return 'decide';
  if (r === 'director' || r === 'admin') return 'view';
  return 'none';
}

/** Advising cases and notes: assigned or backup advisor only */
export function canOpenAdvisingCase(r: RoleId, c: AdvisingCase): boolean {
  return c.accessRoles.includes(r);
}

/** Engagement reports */
export function reportAccess(r: RoleId): 'aggregate' | 'deidentified' {
  return r === 'director' || r === 'admin' ? 'deidentified' : 'aggregate';
}

/** Spreadsheet import (R7): IT and the Administrator run it; the ER Manager, as owner of employer data, reviews the result. */
export function importAccess(r: RoleId): 'run' | 'review' | 'none' {
  if (r === 'it' || r === 'admin') return 'run';
  if (r === 'manager') return 'review';
  return 'none';
}

// ---------- Navigation by role ----------

export type ModuleId =
  | 'employers' | 'events' | 'notes' | 'duplicates' | 'workflows' | 'reports' | 'settings';

export const MODULES: Record<ModuleId, { to: string; label: string }> = {
  employers: { to: '/employers', label: 'Employers' },
  events: { to: '/events', label: 'Events' },
  notes: { to: '/notes', label: 'Student Notes' },
  duplicates: { to: '/duplicates', label: 'Duplicate review' },
  workflows: { to: '/workflows', label: 'Tasks and follow-ups' },
  reports: { to: '/reports', label: 'Engagement report' },
  settings: { to: '/settings', label: 'Settings' },
};

/** One fixed sidebar order for every role. Each role only hides what it cannot open. */
const NAV_ORDER: ModuleId[] = ['employers', 'events', 'notes', 'duplicates', 'workflows', 'reports'];

const ADVISOR_NAV: ModuleId[] = ['notes', 'workflows', 'employers', 'events', 'reports'];
const ALLOWED: Record<RoleId, ModuleId[]> = {
  staff: ['employers', 'events', 'workflows', 'duplicates', 'reports'],
  manager: ['employers', 'events', 'duplicates', 'workflows', 'reports'],
  advisorAssigned: ADVISOR_NAV,
  advisorBackup: ADVISOR_NAV,
  advisorOther: ADVISOR_NAV,
  director: ['reports', 'employers', 'events', 'duplicates', 'workflows'],
  it: [],
  admin: NAV_ORDER,
};

/** Landing page after sign-in: each role's main module. */
const LANDING: Record<RoleId, ModuleId> = {
  staff: 'employers',
  manager: 'employers',
  advisorAssigned: 'notes',
  advisorBackup: 'notes',
  advisorOther: 'notes',
  director: 'reports',
  it: 'settings',
  admin: 'employers',
};

/** Roles that always see Settings; others are granted by the Settings access panel. */
export const SETTINGS_FIXED: RoleId[] = ['it', 'admin'];

export function navFor(r: RoleId, settingsRoles: RoleId[]): ModuleId[] {
  const list = NAV_ORDER.filter((m) => ALLOWED[r].includes(m));
  if (settingsRoles.includes(r)) list.push('settings');
  return list;
}

export function landingFor(r: RoleId): ModuleId {
  return LANDING[r];
}
