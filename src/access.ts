// Access rules from README Section 4. All UI permission checks go through here.
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
  if (r === 'director') return 'view';
  return 'none';
}

/** Advising cases and notes: assigned or backup advisor only */
export function canOpenAdvisingCase(r: RoleId, c: AdvisingCase): boolean {
  return c.accessRoles.includes(r);
}

/** Engagement reports */
export function reportAccess(r: RoleId): 'aggregate' | 'deidentified' {
  return r === 'director' ? 'deidentified' : 'aggregate';
}
