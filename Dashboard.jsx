import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useData } from '../lib/store.jsx';
import { daysUntil, fmtDate, fmtH, relDay, todayIso } from '../lib/dates.js';
import { CourseSelect, PriorityPill, SessionRow, TaskRow } from '../components.jsx';

function Reminders() {
  const { tasks, course } = useData();
  const soon = tasks.filter((t) => !t.done && daysUntil(t.dueDate) <= 2);
  if (!soon.length) return null;
  return (
    <div className="reminders">
      {soon.map((t) => {
        const n = daysUntil(t.dueDate);
        return (
          <div key={t.id} className={`reminder ${n <= 0 ? 'crit' : ''}`} role="status">
            <span><strong>{course(t.course).code}</strong> · {t.title}</span>
            <span className="when">{relDay(n)}</span>
          </div>
        );
      })}
    </div>
  );
}

function Recommendations() {
  const { recs, tasks, course, run } = useData();
  const taskById = new Map(tasks.map((t) => [t.id, t]));
  return (
    <div className="panel assistant">
      <div className="panel-head"><h2>What to study next</h2><span className="ai-tag">AI recommendations</span></div>
      <div className="recs">
        {recs.length === 0 && (
          <p className="empty">You are on track. Every deadline in the next two weeks has enough study time planned.
            Add tasks with “study hours needed” to get suggestions.</p>
        )}
        {recs.map((r) => {
          const c = course(r.course);
          const task = taskById.get(r.task);
          const pct = Math.min(100, Math.round(((r.studiedHours + r.plannedHours) / (r.neededHours || 1)) * 100));
          return (
            <div className="rec" key={r.id}>
              <div className="rec-top"><h3>{r.message}</h3>{task && <PriorityPill p={task.priority} />}</div>
              <p className="why">{r.reason}</p>
              <div className="meter" title={`${pct}% of needed hours studied or planned`}>
                <span style={{ width: `${pct}%`, background: c.color }} />
              </div>
              <div className="plan">Suggested plan: add {fmtH(r.gapHours)} h of study
                <ul>{r.plan.map((p, i) => <li key={i}><span className="mono">{fmtDate(p.date)}</span> · {fmtH(p.hours)} h</li>)}</ul>
              </div>
              <div className="rec-actions">
                <button className="btn primary sm" type="button"
                  onClick={() => run(() => api.post(`/recommendations/${r.id}/accept`), `Added ${r.plan.length} session${r.plan.length > 1 ? 's' : ''} to your schedule`)}>
                  Accept and add to schedule
                </button>
                <button className="btn ghost sm" type="button"
                  onClick={() => run(() => api.post(`/recommendations/${r.id}/dismiss`), 'Recommendation dismissed')}>Dismiss</button>
                <span className="note">{r.source === 'llm' ? 'Written by the language model' : 'Rule-based text'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Progress() {
  const { courses, hoursSince, weekStart } = useData();
  return (
    <div className="panel">
      <div className="panel-head"><h2>Study progress</h2><span className="note">Last 7 days</span></div>
      <div className="prog">
        {courses.map((c) => {
          const h = hoursSince(c.id, weekStart);
          const pct = c.weeklyGoalHours ? Math.min(100, (h / c.weeklyGoalHours) * 100) : 0;
          return (
            <div className="prog-item" key={c.id}>
              <div className="lab"><span>{c.code}</span><span className="mono">{fmtH(h)} / {fmtH(c.weeklyGoalHours)} h</span></div>
              <div className="bar-track"><span style={{ width: `${pct}%`, background: c.color }} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LogTime() {
  const { run } = useData();
  const [course, setCourse] = useState('');
  const [hours, setHours] = useState(1);
  const submit = (e) => {
    e.preventDefault();
    run(() => api.post('/logs', { course, hours: Number(hours), date: todayIso() }), `${hours} h logged`);
  };
  return (
    <div className="panel">
      <div className="panel-head"><h2>Log study time</h2></div>
      <form className="inline" onSubmit={submit}>
        <label>Course<CourseSelect value={course} onChange={setCourse} required /></label>
        <label>Hours<input type="number" min="0.25" step="0.25" value={hours} onChange={(e) => setHours(e.target.value)} required /></label>
        <button className="btn primary" type="submit">Log time</button>
      </form>
    </div>
  );
}

export default function Dashboard() {
  const { courses, tasks, sessions } = useData();
  if (!courses.length) {
    return (
      <div className="panel">
        <h2>Start by adding your courses</h2>
        <p className="muted">Once you have a course, add its assignments and exams. The assistant uses your deadlines and study time to suggest what to work on.</p>
        <p><Link className="btn primary" to="/courses">Add a course</Link></p>
      </div>
    );
  }
  const upcoming = tasks.filter((t) => { const n = daysUntil(t.dueDate); return !t.done && n >= 0 && n <= 14; });
  const todays = sessions.filter((s) => s.date === todayIso());
  return (
    <div className="view">
      <Reminders />
      <div className="grid2">
        <div className="col">
          <Recommendations />
          <div className="panel">
            <div className="panel-head"><h2>Upcoming deadlines</h2><span className="note">Next 14 days</span></div>
            <div className="list">
              {upcoming.length ? upcoming.map((t) => <TaskRow key={t.id} task={t} />) : <p className="empty">Nothing due in the next two weeks.</p>}
            </div>
          </div>
        </div>
        <div className="col">
          <Progress />
          <div className="panel">
            <div className="panel-head"><h2>Today’s sessions</h2></div>
            <div className="list">
              {todays.length ? todays.map((s) => <SessionRow key={s.id} session={s} />)
                : <p className="empty">No sessions today. Accept a recommendation or add one in Study Schedule.</p>}
            </div>
          </div>
          <LogTime />
        </div>
      </div>
    </div>
  );
}
