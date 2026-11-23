export type RoleId =
  | 'staff'
  | 'manager'
  | 'advisorAssigned'
  | 'advisorBackup'
  | 'advisorOther'
  | 'director'
  | 'it'
  | 'admin';

export type MatrixColumn = 'staff' | 'manager' | 'advisor' | 'director' | 'it' | 'admin';

export interface Role {
  id: RoleId;
  label: string;
  user: string;
  matrixColumn: MatrixColumn;
}

export type Category = 'Configuration' | 'Customization' | 'Integration';

export interface Person {
  name: string;
  title: string;
  email: string;
}

export interface Employer {
  id: string;
  name: string;
  aliases: string[];
  owner: Person;
  contacts: Person[];
  contactNote?: string;
  relationshipStatus: string;
  recruitingStage: string;
  /** Latest "Last Activity" from the case packet spreadsheet (no year or type given). */
  importedLastActivity?: string;
}

export interface EventDetails {
  participation: string;
  representative: string;
  source: string;
  lastImported: string;
}

export interface Activity {
  id: string;
  employerId: string;
  date: string;
  type: string;
  title: string;
  body: string;
  loggedBy?: string;
  event?: EventDetails;
}

export interface Task {
  id: string;
  employerId?: string;
  title: string;
  assignedTo: string;
  due: string;
  reminder: string;
  status: 'Open' | 'Done';
}

export interface AdvisingNote {
  date: string;
  type: string;
  title: string;
  body: string;
  author: string;
  followUp?: string;
}

export interface AdvisingCase {
  id: string;
  student: string;
  assignedAdvisor: string;
  assignedAdvisorEmail: string;
  backupAdvisor: string;
  accessRoles: RoleId[];
  notes: AdvisingNote[];
  followUps: Task[];
}

/** One entry in the advising-note access log (R14). Holds no note content. */
export interface NoteAccessEntry {
  id: string;
  caseId: string;
  who: string;
  role: string;
  action: 'Opened case' | 'Added note' | 'Blocked: no access';
  at: string;
}

/** Approval state of the "Active employer" rule (R10), for this browser session. */
export interface RuleState {
  status: 'Pending Director approval' | 'Approved';
  approvedBy?: string;
  approvedAt?: string;
}

export interface MergeReview {
  id: string;
  recordA: string;
  recordB: string;
  flagSource: string;
  flaggedBy: string;
  flaggedAt: string;
  routedTo: string;
  status: 'Pending manager decision' | 'Approved' | 'Rejected';
  decidedBy?: string;
  decidedAt?: string;
  outcome?: string;
}
