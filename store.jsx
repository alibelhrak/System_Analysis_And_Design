import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from './api.js';
import { todayIso, addDays, today0, iso } from './dates.js';

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

const EMPTY = { courses: [], tasks: [], sessions: [], logs: [], materials: [], recs: [] };

/** Loads everything the signed-in student owns and exposes `run()` for mutations. */
export function DataProvider({ children }) {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const timer = useRef();

  const notify = useCallback((msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2600);
  }, []);

  const reload = useCallback(async () => {
    const [courses, tasks, sessions, logs, materials] = await Promise.all(
      ['courses', 'tasks', 'sessions', 'logs', 'materials'].map((p) => api.get(`/${p}`)),
    );
    setData((d) => ({ ...d, courses, tasks, sessions, logs, materials }));
    setLoading(false);
    // Recommendations may wait on the LLM, so they arrive after the rest of the page.
    try {
      const recs = await api.post(`/recommendations/generate?today=${todayIso()}`);
      setData((d) => ({ ...d, recs }));
    } catch (err) {
      notify(err.message);
    }
  }, [notify]);

  useEffect(() => { reload().catch((err) => { setLoading(false); notify(err.message); }); }, [reload, notify]);

  /** Run a mutation, refresh, and show `success` (or the error) as a toast. */
  const run = useCallback(async (fn, success) => {
    try {
      const result = await fn();
      await reload();
      if (success) notify(success);
      return result;
    } catch (err) {
      notify(err.message);
      return undefined;
    }
  }, [reload, notify]);

  const value = useMemo(() => {
    const courseById = new Map(data.courses.map((c) => [c.id, c]));
    const course = (id) => courseById.get(id) || { code: '?', name: 'Unknown', color: '#888', weeklyGoalHours: 0 };
    /** Hours studied for a course since a date: finished sessions plus manual logs. */
    const hoursSince = (courseId, from) =>
      data.sessions.filter((s) => s.course === courseId && s.done && s.date >= from).reduce((t, s) => t + s.hours, 0) +
      data.logs.filter((l) => l.course === courseId && l.date >= from).reduce((t, l) => t + l.hours, 0);
    const weekStart = iso(addDays(today0(), -6));
    return { ...data, loading, course, hoursSince, weekStart, run, notify, reload };
  }, [data, loading, run, notify, reload]);

  return (
    <DataContext.Provider value={value}>
      {children}
      {toast && <div className="toast" role="status">{toast}</div>}
    </DataContext.Provider>
  );
}
