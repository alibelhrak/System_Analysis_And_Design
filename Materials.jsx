import { useRef, useState } from 'react';
import { api } from '../lib/api.js';
import { useData } from '../lib/store.jsx';
import { fmtDate, fmtSize } from '../lib/dates.js';
import { CourseSelect, Dot } from '../components.jsx';

export default function Materials() {
  const { materials, course, run, notify } = useData();
  const [filter, setFilter] = useState('all');
  const [target, setTarget] = useState('');
  const [link, setLink] = useState({ name: '', url: '' });
  const [over, setOver] = useState(false);
  const input = useRef();

  const upload = (files) => {
    if (!target) return notify('Choose a course for these files first');
    if (!files.length) return undefined;
    const form = new FormData();
    form.append('course', target);
    [...files].forEach((f) => form.append('files', f));
    return run(() => api.post('/materials/upload', form), `${files.length} file${files.length > 1 ? 's' : ''} uploaded`);
  };

  const addLink = async (e) => {
    e.preventDefault();
    if (!target) return notify('Choose a course for this link first');
    const ok = await run(() => api.post('/materials/link', { ...link, course: target }), 'Link added');
    if (ok) setLink({ name: '', url: '' });
    return undefined;
  };

  const shown = materials.filter((m) => filter === 'all' || m.course === filter);

  return (
    <div className="grid2">
      <div className="panel">
        <div className="panel-head"><h2>Course materials</h2><CourseSelect all value={filter} onChange={setFilter} aria-label="Filter by course" /></div>
        <div className="list">
          {shown.length === 0 && <p className="empty">No materials yet for this course.</p>}
          {shown.map((m) => {
            const c = course(m.course);
            return (
              <div className="row" key={m.id}>
                <span className="pill type">{m.kind === 'link' ? 'Link' : 'File'}</span>
                <div className="grow">
                  <div className="title">
                    {m.kind === 'link'
                      ? <a href={m.url} target="_blank" rel="noopener noreferrer">{m.name}</a>
                      : <button className="linklike" type="button" onClick={() => api.download(`/materials/${m.id}/file`, m.name).catch((err) => notify(err.message))}>{m.name}</button>}
                  </div>
                  <div className="sub"><Dot color={c.color} />{c.code} · {m.kind === 'link' ? 'Link' : fmtSize(m.size)} · added {fmtDate(m.createdAt.slice(0, 10))}</div>
                </div>
                <button className="btn ghost sm" type="button" aria-label="Remove material"
                  onClick={() => run(() => api.del(`/materials/${m.id}`), 'Removed')}>✕</button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="col">
        <div className="panel">
          <div className="panel-head"><h2>Add to a course</h2></div>
          <label>Course<CourseSelect value={target} onChange={setTarget} /></label>
        </div>
        <div className="panel">
          <div className="panel-head"><h2>Upload files</h2></div>
          <div className={`drop ${over ? 'over' : ''}`} role="button" tabIndex={0}
            onClick={() => input.current.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.current.click(); } }}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files); }}>
            Drop files here or click to choose<br /><span className="note">PDFs, slides, notes, images. Up to 20 MB each.</span>
          </div>
          <input ref={input} type="file" multiple hidden onChange={(e) => { upload(e.target.files); e.target.value = ''; }} />
        </div>
        <div className="panel">
          <div className="panel-head"><h2>Add a link</h2></div>
          <form className="inline" onSubmit={addLink}>
            <label>Name<input type="text" placeholder="Lecture recording" value={link.name} onChange={(e) => setLink({ ...link, name: e.target.value })} required /></label>
            <label>URL<input type="url" placeholder="https://" value={link.url} onChange={(e) => setLink({ ...link, url: e.target.value })} required /></label>
            <button className="btn primary" type="submit">Add link</button>
          </form>
        </div>
      </div>
    </div>
  );
}
