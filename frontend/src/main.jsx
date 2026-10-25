import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUI } from './store';
import { students } from './data';
import './styles.css';

const client = new QueryClient();
const empty = { first_name: '', last_name: '', email: '', student_number: '', course: '', year_of_study: '', bio: '' };
const initials = s => `${s.first_name[0] || ''}${s.last_name[0] || ''}`;
function useRoute() {
  const [route, setRoute] = useState(location.hash.slice(1) || '/profiles');
  useEffect(() => { const change = () => setRoute(location.hash.slice(1) || '/profiles'); window.addEventListener('hashchange', change); return () => window.removeEventListener('hashchange', change); }, []);
  return route;
}
const go = path => { location.hash = path; };
function App() {
  const route = useRoute();
  const registration = route === '/register';
  const { data: rows = [], isPending, error } = useQuery({ queryKey: ['students'], queryFn: students.list });
  const { search, setSearch, notice, setNotice } = useUI();
  const id = Number(route.split('/')[2]);
  const selected = rows.find(row => row.id === id);
  const filtered = rows.filter(s => `${s.first_name} ${s.last_name} ${s.course}`.toLowerCase().includes(search.toLowerCase()));
  useEffect(() => { document.title = `${registration ? 'Register student' : 'Student profiles'} — Studentfolio`; }, [registration]);
  return <div className="shell">
    <aside className="sidebar"><a className="brand" href="#/profiles"><span className="brand-mark">s.</span>studentfolio<span className="brand-dot">●</span></a><div className="workspace-label">STUDENT WORKSPACE</div><nav aria-label="Main navigation"><a className={!registration ? 'active' : ''} href="#/profiles"><span>▦</span> Student profiles <span className="count">{rows.length}</span></a><a className={registration ? 'active' : ''} href="#/register"><span>＋</span> Register student</a></nav><div className="sidebar-bottom"><div className="mini-icon">✦</div><strong>A little about you.<br/>A place to belong.</strong><p>Your student story starts here.</p><div className="sidebar-footer">STUDENTFOLIO / 2026</div></div></aside>
    <div className="workspace"><header className="topbar"><span>Workspace <span className="slash">/</span> <strong>{registration ? 'Registration' : 'Student profiles'}</strong></span><span className="workspace-badge"><i/> Student directory</span></header>
      <main id="main"><div className="eyebrow">YOUR CAMPUS, CONNECTED</div><div className="page-heading"><div><h1>{registration ? 'Every story starts here.' : 'People. Profiles. Possibilities.'}</h1><p>{registration ? 'Create a student profile and make your introduction.' : 'A space for student stories, interests, and what comes next.'}</p></div>{!registration && <a className="button primary" href="#/register">＋ Register student</a>}</div>
        <div className="demo-note"><span>◉</span> Student workspace <span className="note-divider">/</span> Student records are stored in MySQL through the Express API.</div>
        {notice && <div role="status" className="notice">{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}>×</button></div>}
        {error ? <p role="alert">Unable to load profiles: {error.message}</p> : isPending ? <p role="status">Loading students…</p> : registration ? <Registration/> : <>
          <div className="summary"><div><span className="summary-icon">▦</span><div><strong>{rows.length.toString().padStart(2, '0')}</strong><span>Student profiles</span></div></div><div><span className="summary-icon">↗</span><div><strong>{new Set(rows.map(s => s.course).filter(Boolean)).size.toString().padStart(2, '0')}</strong><span>Courses represented</span></div></div><p>Different paths.<br/><strong>One community.</strong></p></div>
          <div className="section-heading"><h2>Student directory <span>{rows.length}</span></h2><label className="search"><span>⌕</span><input aria-label="Search students" placeholder="Search name or course…" value={search} onChange={e => setSearch(e.target.value)}/></label></div>
          <div className="directory-layout"><section className="student-list" aria-label="Students">{filtered.length ? filtered.map((s, i) => <button key={s.id} className={`student-card ${id === s.id ? 'selected' : ''}`} onClick={() => go(`/profiles/${s.id}`)}><span className={`avatar tone-${i % 3}`}>{initials(s)}</span><span className="student-info"><strong>{s.first_name} {s.last_name}</strong><span>{s.course || 'Course not provided'}</span><small>{s.year_of_study ? `Year ${s.year_of_study}` : 'Student'} <span>·</span> {s.student_number || 'No student number'}</small></span><span className="card-arrow">↗</span></button>) : <div className="empty"><h3>{rows.length ? 'No matching students' : 'A fresh start'}</h3><p>{rows.length ? 'Try another name or course.' : 'Register your first student to get started.'}</p><a href="#/register">Register a student →</a></div>}</section><section className="detail" aria-label="Student profile">{selected ? <Profile key={selected.id} student={selected}/> : <div className="profile-placeholder"><span>✳</span><h2>{id ? 'Profile not found' : 'Get to know someone.'}</h2><p>{id ? 'This profile may have been deleted. Select another student.' : 'Choose a student to explore their profile, or register a new story.'}</p><span className="placeholder-line"/> <small>EVERY STUDENT HAS A STORY</small></div>}</section></div>
        </>}
        <footer className="page-footer"><span>Made for the people behind the profiles.</span><span>Studentfolio <span>✦</span></span></footer>
      </main>
    </div>
  </div>;
}
function StudentForm({ student, onDone }) {
  const [form, setForm] = useState(student || empty);
  const query = useQueryClient();
  const setNotice = useUI(s => s.setNotice);
  const save = useMutation({ mutationFn: students.save, onSuccess: async saved => { await query.invalidateQueries({ queryKey: ['students'] }); setNotice(student ? 'Profile updated successfully.' : 'Student registered successfully.'); onDone?.(); go(`/profiles/${saved.id}`); } });
  function submit(e) { e.preventDefault(); const clean = Object.fromEntries(Object.entries(form).map(([k,v]) => [k, typeof v === 'string' ? v.trim() : v])); if (!clean.first_name || !clean.last_name) { e.currentTarget.querySelector('input').focus(); return; } save.mutate(clean); }
  const field = (key, label, options = {}) => <label className="field">{label}{options.required && <span className="required"> *</span>}<input {...options} name={key} value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })}/></label>;
  return <form onSubmit={submit}><div className="form-grid">{field('first_name','First name',{required:true,maxLength:100,placeholder:'e.g. Amara'})}{field('last_name','Last name',{required:true,maxLength:100,placeholder:'e.g. Okafor'})}{field('email','Email address',{required:true,type:'email',maxLength:254,placeholder:'student@example.com'})}{field('student_number','Student number',{maxLength:50,placeholder:'e.g. STU-2026-004'})}{field('course','Course',{maxLength:150,placeholder:'e.g. Digital Media'})}<label className="field">Year of study<select value={form.year_of_study} onChange={e=>setForm({...form,year_of_study:e.target.value})}><option value="">Select a year</option>{Array.from({length:10},(_,i)=><option key={i+1} value={i+1}>Year {i+1}</option>)}</select></label><label className="field full">About the student<textarea maxLength={2000} rows={5} value={form.bio || ''} placeholder="Interests, aspirations, and a little personality…" onChange={e=>setForm({...form,bio:e.target.value})}/><span className="field-hint">A short introduction, in your own words. <span>{form.bio?.length || 0}/2000</span></span></label></div>{save.error && <p role="alert" className="form-error">{save.error.message}</p>}<div className="form-actions"><button type="button" className="button secondary" onClick={()=>onDone ? onDone() : go('/profiles')}>Cancel</button><button className="button primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : student ? 'Save changes ↗' : 'Create student profile ↗'}</button></div></form>;
}
function Registration() { return <div className="registration-layout"><section className="form-panel"><div className="panel-heading"><span className="step">01</span><div><h2>The essentials</h2><p>Tell us a little about the student. Fields marked * are required.</p></div></div><StudentForm/></section><aside className="registration-aside"><span className="big-spark">✳</span><div className="eyebrow">MORE THAN A NAME</div><h2>Your journey.<br/>Your profile.</h2><p>Bring your interests, ambitions, and experiences together in one place.</p><hr/><strong>Room to grow</strong><p>Your story can change. Update your details or bio whenever you need.</p><span className="aside-caption">A SMALL INTRODUCTION.<br/>A WORLD OF POSSIBILITIES.</span></aside></div>; }
function Profile({ student }) {
  const [editing,setEditing]=useState(false); const query=useQueryClient(); const setNotice=useUI(s=>s.setNotice); const dialog=useRef(null);
  const remove=useMutation({mutationFn:()=>students.remove(student.id),onSuccess:async()=>{dialog.current?.close();await query.invalidateQueries({queryKey:['students']});setNotice('Student profile deleted.');go('/profiles');}});
  return <>{editing ? <div className="edit-panel"><h2>Edit profile</h2><StudentForm student={student} onDone={()=>setEditing(false)}/></div> : <><div className="profile-banner"><span>STUDENT PROFILE</span><span>✳</span></div><div className="profile-content"><div className="profile-top"><span className="avatar large">{initials(student)}</span><button className="button secondary compact" onClick={()=>setEditing(true)}>Edit profile ↗</button></div><h2>{student.first_name} {student.last_name}</h2><p className="profile-course">{student.course || 'Course not provided'} {student.year_of_study && `· Year ${student.year_of_study}`}</p><div className="profile-meta"><div><small>STUDENT NUMBER</small><span>{student.student_number || 'Not provided'}</span></div><div><small>EMAIL ADDRESS</small><a href={`mailto:${student.email}`}>{student.email}</a></div></div><h3>A little about me</h3><p className="bio">{student.bio || 'No introduction added yet. Edit this profile to tell your story.'}</p><div className="profile-bottom"><span>Part of the student community</span><button className="delete-link" onClick={()=>dialog.current.showModal()}>Delete profile</button></div></div></>}
    <dialog ref={dialog} aria-labelledby="delete-title"><h2 id="delete-title">Delete this profile?</h2><p>This removes {student.first_name}’s record from the student directory. This action cannot be undone here.</p>{remove.error && <p role="alert">{remove.error.message}</p>}<div className="form-actions"><button className="button secondary" onClick={()=>dialog.current.close()}>Keep profile</button><button className="button danger" disabled={remove.isPending} onClick={()=>remove.mutate()}>Delete profile</button></div></dialog></>;
}
createRoot(document.getElementById('root')).render(<QueryClientProvider client={client}><App/></QueryClientProvider>);
