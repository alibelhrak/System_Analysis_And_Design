import { api } from './lib/api.js';
import { useData } from './lib/store.jsx';
import { daysUntil, fmtDate, fmtH, relDay } from './lib/dates.js';

const PRIORITY_LABEL = { high: 'High', med: 'Medium', low: 'Low' };
export const PriorityPill = ({ p }) => <span className={`pill p-${p}`}>{PRIORITY_LABEL[p]}</span>;
export const Dot = ({ color }) => <span className="dot" style={{ background: color }} />;

export function CourseSelect({ value, onChange, all = false, ...rest }) {
  const { courses } = useData();
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} {...rest}>
      {all ? <option value="all">All courses</option> : <option value="" disabled>Choose a course</option>}
      {courses.map((c) => <option key={c.id} value={c.id}>{c.code} · {c.name}</option>)}
    </select>
  );
}

export function TaskRow({ task, canDelete = false }) {
  const { course, run } = useData();
  const c = course(task.course);
  const n = daysUntil(task.dueDate);
  const urgency = task.done ? '' : n <= 1 ? 'crit' : n <= 3 ? 'warn' : '';
  return (
    <div className={`row ${task.done ? 'done' : ''}`}>
      <input type="checkbox" checked={task.done} aria-label={`Mark ${task.title} done`}
        onChange={(e) => run(() => api.patch(`/tasks/${task.id}`, { done: e.target.checked }), e.target.checked ? 'Marked done' : 'Marked not done')} />
      <div className="grow">
        <div className="title">{task.title}</div>
        <div className="sub"><Dot color={c.color} />{c.code} <span className="pill type">{task.type}</span> <PriorityPill p={task.priority} /></div>
      </div>
      <div className="right">
        <div className={`due ${urgency}`}>{fmtDate(task.dueDate)}<br />{task.done ? 'Done' : relDay(n)}</div>
        {canDelete && <button className="btn ghost sm" type="button" aria-label="Delete task"
          onClick={() => run(() => api.del(`/tasks/${task.id}`), 'Task deleted')}>✕</button>}
      </div>
    </div>
  );
}

export function SessionRow({ session }) {
  const { course, run } = useData();
  const c = course(session.course);
  return (
    <div className={`row ${session.done ? 'done' : ''}`}>
      <input type="checkbox" checked={session.done} aria-label="Mark session done"
        onChange={(e) => run(() => api.patch(`/sessions/${session.id}`, { done: e.target.checked }),
          e.target.checked ? `${fmtH(session.hours)} h added to your progress` : 'Session marked not done')} />
      <div className="grow">
        <div className="title">{c.code}{session.note ? ` · ${session.note}` : ''}</div>
        <div className="sub"><Dot color={c.color} /><span className="mono">{session.startTime} · {fmtH(session.hours)} h</span></div>
      </div>
      <span />
    </div>
  );
}
