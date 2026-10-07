import { useState } from 'react';
import { api } from '../lib/api.js';
import { useData } from '../lib/store.jsx';
import { addDays, fmtH, iso, today0, todayIso } from '../lib/dates.js';
import { CourseSelect } from '../components.jsx';

const blank = () => ({ course: '', date: todayIso(), startTime: '18:00', hours: 1.5, note: '' });
const short = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export default function Schedule() {
  const { sessions, tasks, course, run } = useData();
  const [form, setForm] = useState(blank);
  const [offset, setOffset] = useState(0);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const ok = await run(() => api.post('/sessions', { ...form, hours: Number(form.hours) }), 'Session added');
    if (ok) setForm({ ...form, note: '' });
  };

  const t = today0();
  const monday = addDays(t, -((t.getDay() + 6) % 7) + offset * 7);
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  return (
    <div className="view">
      <div className="panel">
        <div className="panel-head"><h2>Add a study session</h2></div>
        <form className="inline" onSubmit={submit}>
          <label>Course<CourseSelect value={form.course} onChange={(v) => setForm({ ...form, course: v })} required /></label>
          <label>Date<input type="date" value={form.date} onChange={set('date')} required /></label>
          <label>Start<input type="time" value={form.startTime} onChange={set('startTime')} required /></label>
          <label>Hours<input type="number" min="0.25" step="0.25" value={form.hours} onChange={set('hours')} required /></label>
          <label>Focus<input type="text" placeholder="e.g. Chapter 4 review" value={form.note} onChange={set('note')} /></label>
          <button className="btn primary" type="submit">Add session</button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>{short(monday)} – {short(days[6])}</h2>
          <div className="filters">
            <button className="btn sm" type="button" onClick={() => setOffset(offset - 1)}>← Previous</button>
            <button className="btn sm" type="button" onClick={() => setOffset(0)}>This week</button>
            <button className="btn sm" type="button" onClick={() => setOffset(offset + 1)}>Next →</button>
          </div>
        </div>
        <div className="week-wrap">
          <div className="week">
            {days.map((d) => {
              const di = iso(d);
              return (
                <div className={`day ${di === todayIso() ? 'today' : ''}`} key={di}>
                  <div className="day-h"><span>{d.toLocaleDateString(undefined, { weekday: 'short' })}</span><span className="mono">{d.getDate()}</span></div>
                  {tasks.filter((k) => k.dueDate === di && !k.done).map((k) => (
                    <div className="dl" key={k.id}>Due: {course(k.course).code} {k.title}</div>
                  ))}
                  {sessions.filter((s) => s.date === di).map((s) => {
                    const c = course(s.course);
                    return (
                      <div className={`sess ${s.done ? 'done' : ''}`} style={{ '--c': c.color }} key={s.id}>
                        <span className="t">{s.startTime} · {fmtH(s.hours)} h</span>
                        <b>{c.code}</b>
                        {s.note && <span>{s.note}</span>}
                        <span className="acts">
                          <label className="check">
                            <input type="checkbox" checked={s.done}
                              onChange={(e) => run(() => api.patch(`/sessions/${s.id}`, { done: e.target.checked }),
                                e.target.checked ? `${fmtH(s.hours)} h added to your progress` : 'Session marked not done')} />Done
                          </label>
                          <button className="btn ghost sm" type="button" aria-label="Delete session"
                            onClick={() => run(() => api.del(`/sessions/${s.id}`), 'Session deleted')}>✕</button>
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <p className="note">Tick a session when you finish it and the hours count toward your progress. Red boxes are deadlines.</p>
      </div>
    </div>
  );
}
