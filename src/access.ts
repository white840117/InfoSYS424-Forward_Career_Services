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

// ---------- Navigation by role ----------

export type ModuleId =
  | 'employers' | 'events' | 'notes' | 'duplicates' | 'workflows' | 'reports' | 'import' | 'settings';

export const MODULES: Record<ModuleId, { to: string; label: string }> = {
  employers: { to: '/employers', label: 'Employers' },
  events: { to: '/events', label: 'Events' },
  notes: { to: '/notes', label: 'Student Notes' },
  duplicates: { to: '/duplicates', label: 'Duplicate review' },
  workflows: { to: '/workflows', label: 'Tasks and follow-ups' },
  reports: { to: '/reports', label: 'Engagement report' },
  import: { to: '/import', label: 'Import preview' },
  settings: { to: '/settings', label: 'Settings' },
};

/** Sidebar order per role; the first item is the role's landing page. Settings is added separately. */
const ADVISOR_NAV: ModuleId[] = ['notes', 'workflows', 'employers', 'events', 'reports'];
export const NAV_BY_ROLE: Record<RoleId, ModuleId[]> = {
  staff: ['employers', 'events', 'workflows', 'duplicates', 'import', 'reports'],
  manager: ['employers', 'events', 'duplicates', 'workflows', 'import', 'reports'],
  advisorAssigned: ADVISOR_NAV,
  advisorBackup: ADVISOR_NAV,
  advisorOther: ADVISOR_NAV,
  director: ['reports', 'employers', 'events', 'duplicates', 'workflows'],
  it: [],
  admin: ['employers', 'events', 'notes', 'duplicates', 'workflows', 'reports', 'import'],
};

/** Roles that always see Settings; others are granted by the Settings access panel. */
export const SETTINGS_FIXED: RoleId[] = ['it', 'admin'];

export function navFor(r: RoleId, settingsRoles: RoleId[]): ModuleId[] {
  const list = [...NAV_BY_ROLE[r]];
  if (settingsRoles.includes(r)) list.push('settings');
  return list;
}
