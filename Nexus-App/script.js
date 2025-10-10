/* script.js
   Frontend logic for NEXUS demo pages.
   This script is loaded on all pages and runs page-specific code
   based on body[data-page].
*/

const API_BASE = ''; // same origin: http://localhost:8000 when running AppServer

// small utils
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.classList.add('show'),20);
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),220); }, 2000);
}

// fetch helpers
async function apiGet(path){ try { const r = await fetch(API_BASE + path); if (!r.ok) return null; return await r.json(); } catch(e){ console.error(e); return null; } }
async function apiPost(path, body){ try { const r = await fetch(API_BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: body.toString() }); if (!r.ok) return null; return await r.json(); } catch(e){ console.error(e); return null; } }

// page dispatcher
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || 'home';
  if (page === 'home') pageHome();
  if (page === 'login') pageLogin();
  if (page === 'student') pageStudent();
  if (page === 'company') pageCompany();
});

/* ========== HOME ========== */
async function pageHome(){
  $('#btn-continue')?.addEventListener('click', ()=>{ location.href = 'empresa.html'; });
  $$('.demo').forEach(b => b.addEventListener('click', ()=>toast('Modo demonstração: funcionalidade simulada')));

  // load jobs preview
  const jobs = await apiGet('/api/vagas');
  const el = document.getElementById('home-jobs');
  if (!el) return;
  if (!jobs || jobs.length === 0) el.innerHTML = '<div class="small muted">Nenhuma vaga demo.</div>';
  else el.innerHTML = jobs.slice(0,5).map(j => `<div class="item"><strong>${escapeHtml(j.title)}</strong><div class="muted">${escapeHtml(j.company)}</div></div>`).join('');
}

/* ========== LOGIN / REGISTER ========== */
function pageLogin(){
  const tabLogin = $('#tab-login'), tabRegister = $('#tab-register');
  const loginArea = $('#login-area'), registerArea = $('#register-area');

  tabLogin?.addEventListener('click', ()=>{ tabLogin.classList.add('active'); tabRegister.classList.remove('active'); loginArea.classList.remove('hidden'); registerArea.classList.add('hidden'); });
  tabRegister?.addEventListener('click', ()=>{ tabRegister.classList.add('active'); tabLogin.classList.remove('active'); registerArea.classList.remove('hidden'); loginArea.classList.add('hidden'); });

  $('#form-login')?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fm = new FormData(e.target);
    const body = new URLSearchParams();
    body.append('action','login');
    body.append('email', fm.get('email'));
    body.append('password', fm.get('password'));
    body.append('profileType', fm.get('profileType') || 'student');
    const res = await apiPost('/api/auth', body);
    if (res && res.id) { localStorage.setItem('nexus_user', JSON.stringify(res)); toast('Login realizado'); location.href = (res.type === 'company' ? 'empresa.html' : 'estudante.html'); }
    else toast('Credenciais inválidas (demo)');
  });

  $('#form-register')?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fm = new FormData(e.target);
    const body = new URLSearchParams();
    body.append('action','register');
    body.append('name', fm.get('name'));
    body.append('email', fm.get('email'));
    body.append('password', fm.get('password'));
    body.append('type', fm.get('type'));
    const res = await apiPost('/api/auth', body);
    if (res && res.id) { localStorage.setItem('nexus_user', JSON.stringify(res)); toast('Conta criada'); location.href = (res.type === 'company' ? 'empresa.html' : 'estudante.html'); }
    else toast('Erro ao criar conta (demo)');
  });

  $('#forgot')?.addEventListener('click', (e)=>{ e.preventDefault(); toast('Recuperação de senha simulada (demo)'); });
}

/* ========== STUDENT PAGE ========== */
async function pageStudent(){
  const user = getUser();
  // show local demo user if none
  const profile = user ? user : (await apiGet('/api/demo/student')) || { id: '1', name: 'João Paulo', bio: 'Desenvolvedor Full Stack apaixonado', skills: 'React,Node.js,Python' };

  // render profile
  $('#student-avatar') && ($('#student-avatar').textContent = (profile.name || 'U')[0] );
  $('#student-name') && ($('#student-name').textContent = profile.name || 'Usuário');
  $('#student-bio') && ($('#student-bio').textContent = profile.bio || '');
  $('#student-role') && ($('#student-role').textContent = profile.role || 'Estudante');
  $('#student-skills') && ($('#student-skills').innerHTML = (profile.skills||'').split(',').filter(Boolean).map(s => `<span class="chip">${escapeHtml(s.trim())}</span>`).join(''));

  // projects
  const projects = await apiGet('/api/projects?authorId=' + encodeURIComponent(profile.id || '1')) || [];
  $('#student-projects') && ($('#student-projects').innerHTML = (projects.length ? projects.map(p => `<div class="item"><strong>${escapeHtml(p.title)}</strong><div class="muted">${escapeHtml(p.description)}</div></div>`).join('') : '<div class="muted small">Sem projetos ainda.</div>'));

  // edit profile (simple modal-like behavior)
  $('#edit-profile')?.addEventListener('click', ()=>{
    const name = prompt('Nome:', profile.name || '');
    if (name !== null) {
      const bio = prompt('Biografia:', profile.bio || '');
      // update in demo server
      const body = new URLSearchParams();
      body.append('id', profile.id || '1');
      body.append('name', name);
      body.append('bio', bio || '');
      apiPost('/api/profile/update', body).then(res => { if (res) { toast('Perfil atualizado (demo)'); location.reload(); } });
    }
  });

  // create project
  $('#project-create')?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fm = new FormData(e.target);
    const body = new URLSearchParams();
    body.append('title', fm.get('title'));
    body.append('description', fm.get('description'));
    body.append('authorId', profile.id || '1');
    const res = await apiPost('/api/projects', body);
    if (res && res.id) { toast('Projeto adicionado'); location.reload(); } else toast('Erro ao adicionar projeto');
  });
}

/* ========== COMPANY PAGE ========== */
async function pageCompany(){
  const user = getUser();
  const profile = user ? user : (await apiGet('/api/demo/company')) || { id: '1', name: 'Tech Solutions', location: 'São Paulo, SP', bio: 'Soluções web e mobile', openings: '8', employees: '120', rating: '4.5' };

  $('#company-avatar') && ($('#company-avatar').textContent = (profile.name||'T')[0]);
  $('#company-name') && ($('#company-name').textContent = profile.name || '');
  $('#company-loc') && ($('#company-loc').textContent = profile.location || '');
  $('#company-bio') && ($('#company-bio').textContent = profile.bio || '');
  $('#company-openings') && ($('#company-openings').textContent = profile.openings || '0');
  $('#company-employees') && ($('#company-employees').textContent = profile.employees || '0');
  $('#company-rating') && ($('#company-rating').textContent = profile.rating || '0');

  const jobs = await apiGet('/api/vagas') || [];
  $('#company-jobs') && ($('#company-jobs').innerHTML = (jobs.length ? jobs.map(j => `<div class="item"><strong>${escapeHtml(j.title)}</strong><div class="muted">${escapeHtml(j.description)}</div></div>`).join('') : '<div class="muted small">Sem vagas publicadas.</div>'));

  $('#job-create')?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fm = new FormData(e.target);
    const body = new URLSearchParams();
    body.append('title', fm.get('title'));
    body.append('description', fm.get('description'));
    body.append('company', profile.name || 'Empresa Demo');
    body.append('tags', fm.get('tags') || '');
    const r = await apiPost('/api/vagas', body);
    if (r && r.id) { toast('Vaga publicada'); location.reload(); } else toast('Erro ao publicar');
  });
}

/* ========== HELPERS ========== */
function getUser(){
  try { return JSON.parse(localStorage.getItem('nexus_user') || 'null'); } catch(e){ return null; }
}
function escapeHtml(s){ if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
