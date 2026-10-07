import { useState } from 'react';
import { api } from '../lib/api.js';
import { useData } from '../lib/store.jsx';
import { daysUntil, fmtH, relDay } from '../lib/dates.js';

const BLANK = { code: '', name: '', weeklyGoalHours: 5, color: '#2b4fd8' };

export default function Courses() {
  const { courses, tasks, materials, hoursSince, weekStart, run } = useData();
  const [form, setForm] = useState(BLANK);
  const [confirming, setConfirming] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const ok = await run(() => api.post('/courses', { ...form, weeklyGoalHours: Number(form.weeklyGoalHours) || 0 }), 'Course added');
    if (ok) setForm(BLANK);
  };

  return (
    <div className="view">
      <div className="panel">
        <div className="panel-head"><h2>Add a course</h2></div>
        <form className="inline" onSubmit={submit}>
          <label>Course code<input type="text" placeholder="e.g. CIS 162" value={form.code} onChange={set('code')} required /></label>
          <label>Course name<input type="text" placeholder="e.g. Computer Science I" value={form.name} onChange={set('name')} required /></label>
          <label>Weekly study goal (hrs)<input type="number" min="0" step="0.5" value={form.weeklyGoalHours} onChange={set('weeklyGoalHours')} /></label>
          <label>Color<input type="color" value={form.color} onChange={set('color')} /></label>
          <button className="btn primary" type="submit">Add course</button>
        </form>
      </div>

      <div className="courses">
        {courses.length === 0 && <p className="empty">No courses yet. Add your first course above.</p>}
        {courses.map((c) => {
          const open = tasks.filter((t) => t.course === c.id && !t.done);
          const next = open[0];
          return (
            <div className="course" key={c.id} style={{ '--c': c.color }}>
              <div><div className="mono muted">{c.code}</div><h3>{c.name}</h3></div>
              <div className="stats">
                <div><b>{open.length}</b>open tasks</div>
                <div><b>{fmtH(hoursSince(c.id, weekStart))}h</b>this week</div>
                <div><b>{materials.filter((m) => m.course === c.id).length}</b>materials</div>
              </div>
              <div className="note">{next ? `Next: ${next.title} · ${relDay(daysUntil(next.dueDate))}` : 'No upcoming work'}</div>
              {confirming === c.id ? (
                <div className="rec-actions">
                  <span className="note">Remove this course and all its tasks, sessions and files?</span>
                  <button className="btn sm danger" type="button" onClick={() => run(() => api.del(`/courses/${c.id}`), 'Course removed')}>Remove</button>
                  <button className="btn sm" type="button" onClick={() => setConfirming(null)}>Keep</button>
                </div>
              ) : (
                <div><button className="btn ghost sm" type="button" onClick={() => setConfirming(c.id)}>Remove course</button></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
