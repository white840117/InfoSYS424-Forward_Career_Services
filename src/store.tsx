// In-memory session state. Nothing is saved to a server; a page reload resets the
// sample data. Only the selected role is remembered (localStorage, guarded).
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import rolesData from './data/roles.json';
import employersData from './data/employers.json';
import activitiesData from './data/activities.json';
import advisingData from './data/advising.json';
import mergeData from './data/mergeReviews.json';
import { SETTINGS_FIXED } from './access';
import type {
  AdvisingCase, Activity, Employer, MergeReview, NoteAccessEntry, Role, RoleId, RuleState, Task,
} from './types';

export const ROLES = rolesData as Role[];
export const ACTIVITIES = activitiesData.activities as Activity[];

const ROLE_KEY = 'fcs-crm-role';

function readRole(): RoleId {
  try {
    const v = window.localStorage.getItem(ROLE_KEY);
    if (v && ROLES.some((r) => r.id === v)) return v as RoleId;
  } catch {
    /* storage unavailable: fall back to default */
  }
  return 'staff';
}

function writeRole(r: RoleId) {
  try {
    window.localStorage.setItem(ROLE_KEY, r);
  } catch {
    /* ignore */
  }
}

function nowLabel() {
  return new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  }) + ' (this session)';
}

interface Store {
  role: Role;
  setRole: (id: RoleId) => void;
  employers: Employer[];
  updateEmployer: (id: string, patch: Partial<Employer>) => void;
  tasks: Task[];
  toggleTask: (id: string) => void;
  advisingCases: AdvisingCase[];
  toggleFollowUp: (caseId: string, fuId: string) => void;
  mergeReviews: MergeReview[];
  flagDuplicate: (a: string, b: string, note: string) => void;
  decideMerge: (id: string, approve: boolean) => void;
  addNote: (caseId: string, note: NewNote) => void;
  settingsRoles: RoleId[];
  setSettingsAccess: (id: RoleId, on: boolean) => void;
  /** R10: approval of the active-employer rule (session only). */
  rule: RuleState;
  approveRule: () => void;
  /** R14: who opened, or was blocked from, an advising case. No note content is stored. */
  noteLog: NoteAccessEntry[];
  logNoteAccess: (caseId: string, action: NoteAccessEntry['action']) => void;
}

export interface NewNote {
  date: string;
  type: string;
  title: string;
  body: string;
  followUp: string;
  followUpDue: string;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [roleId, setRoleId] = useState<RoleId>(readRole);
  const [employers, setEmployers] = useState<Employer[]>(employersData as Employer[]);
  const [tasks, setTasks] = useState<Task[]>(activitiesData.tasks as Task[]);
  const [advisingCases, setAdvising] = useState<AdvisingCase[]>(advisingData as AdvisingCase[]);
  const [mergeReviews, setMerge] = useState<MergeReview[]>(mergeData as MergeReview[]);
  const [settingsRoles, setSettingsRoles] = useState<RoleId[]>(SETTINGS_FIXED);
  const [rule, setRule] = useState<RuleState>({ status: 'Pending Director approval' });
  const [noteLog, setNoteLog] = useState<NoteAccessEntry[]>([]);

  const value = useMemo<Store>(() => {
    const role = ROLES.find((r) => r.id === roleId) ?? ROLES[0];
    const log = (caseId: string, action: NoteAccessEntry['action']) =>
      setNoteLog((list) => [
        { id: `log-${Date.now()}-${list.length}`, caseId, who: role.user, role: role.label, action, at: nowLabel() },
        ...list,
      ]);
    return {
      role,
      setRole: (id) => { setRoleId(id); writeRole(id); },
      employers,
      updateEmployer: (id, patch) =>
        setEmployers((list) => list.map((e) => (e.id === id ? { ...e, ...patch } : e))),
      tasks,
      toggleTask: (id) =>
        setTasks((list) => list.map((t) => (t.id === id ? { ...t, status: t.status === 'Open' ? 'Done' : 'Open' } : t))),
      advisingCases,
      toggleFollowUp: (caseId, fuId) =>
        setAdvising((list) => list.map((c) => c.id !== caseId ? c : {
          ...c,
          followUps: c.followUps.map((f) => f.id === fuId ? { ...f, status: f.status === 'Open' ? 'Done' : 'Open' } : f),
        })),
      mergeReviews,
      flagDuplicate: (a, b, note) =>
        setMerge((list) => [
          {
            id: `MR-${String(list.length + 1).padStart(4, '0')}`,
            recordA: a,
            recordB: b,
            flagSource: note.trim() ? `Staff: ${note.trim()}` : 'Staff: flagged as a possible duplicate',
            flaggedBy: role.user,
            flaggedAt: nowLabel(),
            routedTo: 'Employer Relations Manager',
            status: 'Pending manager decision',
          },
          ...list,
        ]),
      decideMerge: (id, approve) =>
        setMerge((list) => list.map((m) => m.id !== id ? m : {
          ...m,
          status: approve ? 'Approved' : 'Rejected',
          decidedBy: role.user,
          decidedAt: nowLabel(),
          outcome: approve
            ? `Approved for merge (simulated: records are not changed in this mock-up)`
            : 'Rejected: records stay separate',
        })),
      addNote: (caseId, n) => {
        log(caseId, 'Added note');
        setAdvising((list) => list.map((c) => {
          if (c.id !== caseId) return c;
          const fu = n.followUp.trim();
          return {
            ...c,
            notes: [{ date: n.date, type: n.type, title: n.title.trim(), body: n.body.trim(), author: role.user, followUp: fu || undefined }, ...c.notes],
            followUps: fu
              ? [...c.followUps, {
                id: `fu-${Date.now()}`,
                title: fu,
                assignedTo: role.user,
                due: n.followUpDue ? formatDate(n.followUpDue) : 'No due date set',
                reminder: n.followUpDue ? '1 day before due date (sample)' : 'None',
                status: 'Open',
              }]
              : c.followUps,
          };
        }));
      },
      settingsRoles,
      setSettingsAccess: (id, on) =>
        setSettingsRoles((list) => SETTINGS_FIXED.includes(id) ? list
          : on ? [...new Set([...list, id])] : list.filter((x) => x !== id)),
      rule,
      approveRule: () => setRule({ status: 'Approved', approvedBy: role.user, approvedAt: nowLabel() }),
      noteLog,
      logNoteAccess: log,
    };
  }, [roleId, employers, tasks, advisingCases, mergeReviews, settingsRoles, rule, noteLog]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside StoreProvider');
  return s;
}

export function formatDate(iso: string, upper = false) {
  const d = new Date(iso + 'T12:00:00');
  const s = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return upper ? s.toUpperCase() : s;
}
