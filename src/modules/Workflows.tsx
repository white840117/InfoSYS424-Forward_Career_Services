import { Link } from 'react-router-dom';
import { activityAccess, canOpenAdvisingCase } from '../access';
import { Feature, LockedPlaceholder, PageHead, Pill, ReadOnlyNote } from '../components/ui';
import { useStore } from '../store';
import type { Task } from '../types';

/** One task or follow-up. `onToggle` is passed only when the role may change it. */
export function TaskView({ task, onToggle, summary }: { task: Task; onToggle?: () => void; summary?: boolean }) {
  return (
    <div className="item">
      <div className="item-head">
        <strong style={{ fontSize: 15, color: 'var(--heading)' }}>{task.title}</strong>
        <Pill value={task.status} />
      </div>
      {!summary && (
        <div className="kv">
          <div><span>Assigned to</span>{task.assignedTo}</div>
          <div><span>Due date</span>{task.due}</div>
          <div><span>Reminder</span>{task.reminder}</div>
        </div>
      )}
      {onToggle && (
        <div className="btn-row">
          <button className="btn secondary" onClick={onToggle}>
            {task.status === 'Open' ? 'Mark as done' : 'Reopen'}
          </button>
        </div>
      )}
    </div>
  );
}

/** Employer task, applying the "Engagement activities and tasks" access row. */
export function TaskItem({ task }: { task: Task }) {
  const { role, toggleTask } = useStore();
  const a = activityAccess(role.id);
  return <TaskView task={task} summary={a === 'summary'} onToggle={a === 'edit' ? () => toggleTask(task.id) : undefined} />;
}

export default function Workflows() {
  const { role, tasks, employers, advisingCases, toggleFollowUp } = useStore();
  const a = activityAccess(role.id);
  const empName = (id?: string) => employers.find((e) => e.id === id)?.name;

  return (
    <>
      <PageHead eyebrow="Workflows" title="Tasks and follow-ups"
        sub="Employer tasks and advising follow-ups, each with a due date, status and reminder." />

      <Feature id="R9" title="Employer tasks" category="Configuration"
        description="Engagement tasks with due date, status and a reminder to the assignee.">
        {a === 'summary' && <ReadOnlyNote>Summary view: Career Advisors see the task and its status only.</ReadOnlyNote>}
        {a === 'view' && <ReadOnlyNote>Read-only for {role.label}.</ReadOnlyNote>}
        {tasks.map((t) => (
          <div key={t.id} className="stack" style={{ gap: 6 }}>
            {t.employerId && (
              <span className="muted small">Employer: <Link to={`/employers/${t.employerId}`}>{empName(t.employerId)}</Link></span>
            )}
            <TaskItem task={t} />
          </div>
        ))}
      </Feature>

      <Feature id="R9" title="Advising follow-ups" category="Configuration"
        description="Follow-ups on advising cases. Same access as the case: assigned or backup advisor only.">
        {advisingCases.map((c) =>
          canOpenAdvisingCase(role.id, c) ? (
            <div key={c.id} className="stack" style={{ gap: 6 }}>
              <span className="muted small">Advising case: <Link to={`/notes/${c.id}`}>{c.id} · {c.student}</Link></span>
              {c.followUps.map((f) => (
                <TaskView key={f.id} task={f} onToggle={() => toggleFollowUp(c.id, f.id)} />
              ))}
            </div>
          ) : (
            <LockedPlaceholder key={c.id} what="advising follow-ups"
              why="Only the student's assigned or backup advisor can see advising follow-ups." />
          ),
        )}
      </Feature>

      <section className="card stack" aria-label="Workflow definitions">
        <h2>Workflow definitions</h2>
        <p className="muted">How the two workflows above and the merge review are set up. Each belongs to the feature shown.</p>
        <div className="stack" style={{ gap: 8 }}>
          <div className="feature-meta"><span className="badge badge-configuration">Configuration</span><span className="feature-id">R9</span><strong>Follow-up reminder</strong></div>
          <ol className="steps">
            <li><span className="who">Step 1 · Staff or advisor</span>Save a task or follow-up with a due date</li>
            <li><span className="who">Step 2 · System</span>Remind the assignee before the due date</li>
            <li><span className="who">Step 3 · Assignee</span>Mark it done when complete</li>
          </ol>
        </div>
        <div className="stack" style={{ gap: 8 }}>
          <div className="feature-meta"><span className="badge badge-configuration">Configuration</span><span className="feature-id">R4</span><strong>Employer merge review</strong></div>
          <ol className="steps">
            <li><span className="who">Step 1 · System or staff</span>Basic name/contact match, or staff flag a possible duplicate</li>
            <li><span className="who">Step 2 · System</span>Create a merge review case and route it to the Employer Relations Manager</li>
            <li><span className="who">Step 3 · Manager</span>Compare both records; approve or reject</li>
            <li><span className="who">Step 4 · System</span>Record who flagged, who decided, when and the outcome (R5)</li>
          </ol>
        </div>
      </section>
    </>
  );
}
