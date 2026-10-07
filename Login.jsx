import { useState } from 'react';
import { useAuth } from '../lib/auth.jsx';

export default function Login() {
  const { authenticate } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try { await authenticate(mode, form); } catch (err) { setError(err.message); setBusy(false); }
  };

  return (
    <div className="login">
      <form className="panel" onSubmit={submit}>
        <h1>Study <mark>Assistant</mark></h1>
        <p className="muted">Courses, deadlines, study schedule and materials in one place, with AI advice on what to study next.</p>
        {mode === 'register' && (
          <label>Name<input type="text" value={form.name} onChange={set('name')} required autoComplete="name" /></label>
        )}
        <label>Email<input type="email" value={form.email} onChange={set('email')} required autoComplete="email" /></label>
        <label>Password<input type="password" value={form.password} onChange={set('password')} required minLength={8}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn primary" type="submit" disabled={busy}>{mode === 'login' ? 'Sign in' : 'Create account'}</button>
        <button className="btn ghost" type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
          {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
        </button>
      </form>
    </div>
  );
}
