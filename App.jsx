import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './lib/auth.jsx';
import { DataProvider, useData } from './lib/store.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Courses from './pages/Courses.jsx';
import Tasks from './pages/Tasks.jsx';
import Schedule from './pages/Schedule.jsx';
import Materials from './pages/Materials.jsx';

const TABS = [
  ['/', 'Dashboard'],
  ['/courses', 'Courses'],
  ['/tasks', 'Assignments & Exams'],
  ['/schedule', 'Study Schedule'],
  ['/materials', 'Materials'],
];

function Shell() {
  const { user, signOut } = useAuth();
  const { loading } = useData();
  return (
    <>
      <header>
        <div className="bar">
          <div className="brand"><h1>Study <mark>Assistant</mark></h1></div>
          <span className="note">{user.name}</span>
          <button className="btn ghost sm" type="button" onClick={signOut}>Sign out</button>
          <nav>
            {TABS.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>{label}</NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main>
        {loading ? <p className="empty">Loading your courses…</p> : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </>
  );
}

export default function App() {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) return <Login />;
  return <DataProvider key={user.id}><Shell /></DataProvider>;
}
