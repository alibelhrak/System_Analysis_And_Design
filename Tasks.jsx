import { useState } from 'react';
import { api } from '../lib/api.js';
import { useData } from '../lib/store.jsx';
import { addDays, iso, today0 } from '../lib/dates.js';
import { CourseSelect, TaskRow } from '../components.jsx';

const TYPES = ['Assignment', 'Exam', 'Quiz', 'Project', 'Reading'];
const blank = () => ({ title: '', course: '', type: 'Assignment', dueDate: iso(addDays(today0(), 7)), priority: 'med', hoursNeeded: 4 });

export default function Tasks() {
  const { tasks, run } = useData();
  const [form, setForm] = useState(blank);
  const [fCourse, setFCourse] = useState('all');
  const [fStatus, setFStatus] = useState('open');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const ok = await run(() => api.post('/tasks', { ...form, hoursNeeded: Number(form.hoursNeeded) || 0 }), 'Added. Check the Dashboard for study suggestions');
    if (ok) setForm({ ...form, title: '' });
  };

  const shown = tasks.filter((t) => (fCourse === 'all' || t.course === fCourse) && (fStatus === 'all' || (fStatus === 'done') === t.done));

  return (
    <div className="view">
      <div className="panel">
        <div className="panel-head"><h2>Add an assignment, exam or task</h2></div>
        <form className="inline" onSubmit={submit}>
          <label>Title<input type="text" placeholder="e.g. Midterm 1" value={form.title} onChange={set('title')} required /></label>
          <label>Course<CourseSelect value={form.course} onChange={(v) => setForm({ ...form, course: v })} required /></label>
          <label>Type<select value={form.type} onChange={set('type')}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label>Due date<input type="date" value={form.dueDate} onChange={set('dueDate')} required /></label>
          <label>Priority
            <select value={form.priority} onChange={set('priority')}>
              <option value="high">High</option><option value="med">Medium</option><option value="low">Low</option>
            </select>
          </label>
          <label>Study hours needed<input type="number" min="0" step="0.5" value={form.hoursNeeded} onChange={set('hoursNeeded')} /></label>
          <button className="btn primary" type="submit">Add</button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>All work</h2>
          <div className="filters">
            <CourseSelect all value={fCourse} onChange={setFCourse} aria-label="Filter by course" />
            <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} aria-label="Filter by status">
              <option value="open">Not done</option><option value="all">All</option><option value="done">Done</option>
            </select>
          </div>
        </div>
        <div className="list">
          {shown.length ? shown.map((t) => <TaskRow key={t.id} task={t} canDelete />) : <p className="empty">No tasks match this filter.</p>}
        </div>
      </div>
    </div>
  );
}
