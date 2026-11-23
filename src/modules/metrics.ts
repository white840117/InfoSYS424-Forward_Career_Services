// Calculations shared by the Director dashboard (R12) and the Engagement report (R6).
// Every number is counted from the sample data in src/data. Nothing is invented.
import { employerAccess } from '../access';
import { ACTIVITIES, ROLES } from '../store';
import type { Tile } from '../components/ui';
import type { AdvisingCase, Employer, MergeReview, Task } from '../types';

/** Most recent engagement for an employer: a dated timeline activity, else the spreadsheet value. */
export interface LastSeen {
  label: string;
  iso?: string;
  source: 'Activity timeline' | 'Spreadsheet import (no year)' | 'None';
}

export function lastSeen(e: Employer): LastSeen {
  const latest = ACTIVITIES.filter((a) => a.employerId === e.id).sort((a, b) => b.date.localeCompare(a.date))[0];
  if (latest) return { label: latest.date, iso: latest.date, source: 'Activity timeline' };
  if (e.importedLastActivity) return { label: e.importedLastActivity, source: 'Spreadsheet import (no year)' };
  return { label: 'None', source: 'None' };
}

/** Start of the rule's 12-month window, counted back from today. */
function windowStart(today: Date) {
  const d = new Date(today);
  d.setFullYear(d.getFullYear() - 1);
  return d;
}

export type RuleResult = 'Active' | 'Dormant' | 'Cannot evaluate';
export type Verdict = 'Matches' | 'Differs' | 'Needs review';

export interface RuleRow {
  employer: Employer;
  last: LastSeen;
  result: RuleResult;
  verdict: Verdict;
  note: string;
}

/** Applies the proposed rule (v1): active if any recorded engagement in the last 12 months. */
export function ruleCheck(employers: Employer[], today = new Date()): RuleRow[] {
  const start = windowStart(today);
  return employers.map((e) => {
    const last = lastSeen(e);
    let result: RuleResult;
    if (last.iso) result = new Date(last.iso + 'T12:00:00') >= start ? 'Active' : 'Dormant';
    else if (last.source === 'None') result = 'Dormant';
    else result = 'Cannot evaluate';

    let verdict: Verdict;
    let note: string;
    if (result === 'Cannot evaluate') {
      verdict = 'Needs review';
      note = e.relationshipStatus === 'Dormant'
        ? `Recorded as Dormant, but the last activity (${last.label}) has no year. If it falls in the last 12 months, the rule makes this employer Active.`
        : `The last activity (${last.label}) came from the spreadsheet without a year, so the rule cannot confirm the status.`;
    } else if (result === e.relationshipStatus) {
      verdict = 'Matches';
      note = 'Recorded status agrees with the rule.';
    } else {
      verdict = 'Differs';
      note = `Recorded as ${e.relationshipStatus}; the rule gives ${result}.`;
    }
    return { employer: e, last, result, verdict, note };
  });
}


/** Candidate employer-side metrics (Sprint 2 Review, AI-simulated; not confirmed by the Director). */
export function employerTiles(employers: Employer[], tasks: Task[], today = new Date()): Tile[] {
  const active = employers.filter((e) => e.relationshipStatus === 'Active').length;
  const start = windowStart(today);
  const recent = ACTIVITIES.filter((a) => new Date(a.date + 'T12:00:00') >= start);
  const byType = new Map<string, number>();
  recent.forEach((a) => byType.set(a.type, (byType.get(a.type) ?? 0) + 1));
  const typeText = [...byType.entries()].map(([t, n]) => `${n} ${t.toLowerCase()}`).join(' · ');
  const openTasks = tasks.filter((t) => t.status === 'Open').length;
  return [
    { label: 'Active employers', value: `${active} of ${employers.length}`, sub: 'Recorded Relationship status' },
    { label: 'Employer activities, last 12 months', value: String(recent.length), sub: typeText || 'None logged' },
    { label: 'Open employer tasks', value: String(openTasks), sub: 'Due dates in the sample are placeholders' },
  ];
}

/** Totals that depend on the Event Platform and University Student System connections. */
export function sourceTiles(employers: Employer[], cases: AdvisingCase[]): Tile[] {
  const events = ACTIVITIES.filter((a) => a.event);
  const attending = new Set(events.filter((a) => a.event!.participation === 'Attended').map((a) => a.employerId));
  const notes = cases.reduce((n, c) => n + c.notes.length, 0);
  const openFollowUps = cases.reduce((n, c) => n + c.followUps.filter((f) => f.status === 'Open').length, 0);
  return [
    { label: 'Employers at events', value: `${attending.size} of ${employers.length}`, sub: `${events.length} event participation record${events.length === 1 ? '' : 's'}` },
    { label: 'Advising cases', value: String(cases.length), sub: 'Total only, never by student' },
    { label: 'Advising notes', value: String(notes), sub: `${openFollowUps} open follow-up${openFollowUps === 1 ? '' : 's'}` },
  ];
}

export interface Issue {
  area: string;
  text: string;
  fix: string;
}

/** Data-quality flags the Director should see before trusting the numbers. */
export function dataQuality(employers: Employer[], merges: MergeReview[], rows: RuleRow[]): Issue[] {
  const issues: Issue[] = [];
  employers.forEach((e) => {
    if (e.contacts.length === 0) {
      issues.push({ area: e.name, text: 'No contact on record.', fix: 'Employer-relations staff add a primary contact.' });
    }
    const ownerRole = ROLES.find((r) => r.user === e.owner.name);
    if (ownerRole && employerAccess(ownerRole.id) !== 'edit') {
      issues.push({
        area: e.name,
        text: `Relationship owner is ${e.owner.name} (${ownerRole.label}), whose access to employer records is view-only.`,
        fix: 'Employer Relations Manager assigns an owner from employer relations.',
      });
    }
  });
  rows.filter((r) => r.verdict !== 'Matches').forEach((r) => {
    issues.push({ area: r.employer.name, text: r.note, fix: 'Confirm the last activity date, then apply the approved rule.' });
  });
  const pending = merges.filter((m) => m.status === 'Pending manager decision').length;
  if (pending) {
    issues.push({
      area: 'Duplicate review',
      text: `${pending} possible duplicate${pending === 1 ? '' : 's'} waiting for a decision.`,
      fix: 'Employer Relations Manager approves or rejects.',
    });
  }
  return issues;
}
