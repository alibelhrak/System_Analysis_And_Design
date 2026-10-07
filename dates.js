// All dates in the app are local calendar days stored as "YYYY-MM-DD" strings.
const DAY = 864e5;
const pad = (n) => String(n).padStart(2, '0');

export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const today0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
export const todayIso = () => iso(today0());
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const daysUntil = (s) => Math.round((parse(s) - today0()) / DAY);
export const fmtDate = (s) => parse(s).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
export const relDay = (n) => (n < 0 ? `${-n}d overdue` : n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : `in ${n} days`);
export const fmtH = (h) => String(Math.round(h * 100) / 100);
export const fmtSize = (b) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);
