// script.js - SPA simples para NEXUS demo
const API_BASE = ''; // mesmo host (http://localhost:8000)

/* util */
const $ = sel => document.querySelector(sel);
const app = document.getElementById('app');

function navigate(hash) {
  location.hash = hash;
}

function mountListeners() {
  document.querySelectorAll('.nav .btn, .topbar .btn').forEach(b=>{
    const link = b.getAttribute('data-link');
    if(link) b.addEventListener('click', ()=>navigate(link));
  });
}

/* --- TEMPLATES / RENDERERS --- */

async function renderRoute() {
  const hash = location.hash || '#/';
  const [route, param] = hash.slice(2).split('/');
  if (hash.startsWith('#/demo')) { await renderDemo(); }
  else if (hash === '#/' || hash === '#') { renderLogin(); }
  else if (hash === '#/feed') { await renderFeed(); }
  else if (hash === '#/vagas') { await renderVagas(); }
  else if (hash === '#/empresas') { await renderEmpresas(); }
  else if (hash.startsWith('#/perfil')) {
    const id = hash.split('/')[2];
    await renderPerfil(id);
  } else if (hash === '#/candidaturas') { await renderCandidaturas(); }
  else { renderNotFound(); }
}

/* ========== DEMO EMPRESAS ========== */
async function renderDemo() {
  app.innerHTML = `
    <section class="hero card">
      <div class="left">
        <h2>Bem-vindo ao NEXUS Empresas - Conecte-se com os melhores talentos do mercado.</h2>
        <p class="small">Plataforma para encontrar estagiários qualificados, publicar vagas e acompanhar métricas de candidaturas.</p>
        <div class="actions">
          <button id="continue-company" class="btn primary">Continuar como Empresa</button>
          <button id="go-login" class="btn ghost">Voltar ao Login</button>
        </div>
        <div style="margin-top:14px;color:var(--muted)">
          <strong>O que você pode fazer:</strong>
          <ul>
            <li>Encontre Talentos</li>
            <li>Publique Vagas</li>
            <li>Analytics em tempo real</li>
          </ul>
        </div>
      </div>
      <div class="right">
        <div class="card">
          <h3>Benefícios da Plataforma</h3>
          <ul class="small">
            <li>Acesso a milhares de candidatos qualificados</li>
            <li>Publicação ilimitada de vagas</li>
            <li>Sistema de mensagens integrado</li>
            <li>Dashboard com estatísticas</li>
          </ul>
        </div>
        <div style="margin-top:12px" class="card">
          <h3>Modo Demonstração</h3>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button id="demo-dashboard" class="btn">Dashboard</button>
            <button id="demo-busca" class="btn">Busca de Estagiários</button>
            <button id="demo-publicar" class="btn">Publicar Vagas</button>
            <button id="demo-mensagens" class="btn">Mensagens</button>
          </div>
        </div>
      </div>
    </section>
    <section style="margin-top:14px" class="grid">
      <div class="card">
        <h3>Vagas em destaque</h3>
        <div id="demo-jobs" class="small"></div>
      </div>
      <div class="card">
        <h3>Empresas Parceiras</h3>
        <div id="demo-companies" class="small"></div>
      </div>
    </section>
  `;
  document.getElementById('go-login').addEventListener('click', ()=>navigate('#/'));
  document.getElementById('continue-company').addEventListener('click', ()=>navigate('#/feed'));
  ['demo-dashboard','demo-busca','demo-publicar','demo-mensagens'].forEach(id=>{
    const btn = document.getElementById(id);
    if(btn) btn.addEventListener('click', ()=>toast('Modo demonstração: funcionalidade simulada'));
  });

  // load jobs and companies
  const jobs = await apiGet('/api/vagas');
  const companies = await apiGet('/api/empresas');
  const jobsDiv = document.getElementById('demo-jobs');
  jobsDiv.innerHTML = jobs.slice(0,4).map(j=>`<div><strong>${esc(j.title)}</strong> — ${esc(j.company)}</div>`).join('');
  const compDiv = document.getElementById('demo-companies');
  compDiv.innerHTML = companies.slice(0,6).map(c=>`<div>${esc(c.name)} — ${esc(c.location)}</div>`).join('');
}

/* ========== LOGIN / REGISTER ========== */
function renderLogin() {
  app.innerHTML = `
    <section class="card">
      <h2>Entrar na sua conta - Entre para acessar suas oportunidades.</h2>
      <p class="small">Escolha Perfil e faça login ou crie sua conta.</p>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button id="profile-company" class="btn ghost">Perfil Empresa</button>
        <button id="profile-student" class="btn">Perfil Estudante</button>
      </div>
      <form id="login-form" class="form" style="margin-top:14px">
        <label>Email<input name="email" placeholder="seu.email@exemplo.com" required /></label>
        <label>Senha<input name="password" type="password" placeholder="••••••••" required /></label>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button type="submit" class="btn primary">Entrar</button>
          <button type="button" id="open-register" class="btn">Criar conta gratuita</button>
        </div>
      </form>
      <div id="register-area" style="margin-top:12px;display:none" class="card">
        <h3>Registrar (Simples)</h3>
        <form id="register-form" class="form">
          <label>Nome<input name="name" required /></label>
          <label>Email<input name="email" required /></label>
          <label>Senha<input name="password" type="password" required /></label>
          <label>Tipo
            <select name="type">
              <option value="student">Estudante</option>
              <option value="company">Empresa</option>
            </select>
          </label>
          <div style="display:flex;gap:8px;margin-top:10px">
            <button class="btn primary" type="submit">Registrar</button>
            <button type="button" id="close-register" class="btn ghost">Cancelar</button>
          </div>
        </form>
      </div>
    </section>
  `;

  document.getElementById('profile-company').addEventListener('click', ()=>toast('Selecione Empresa: demonstração'));
  document.getElementById('profile-student').addEventListener('click', ()=>toast('Selecione Estudante: demonstração'));

  document.getElementById('open-register').addEventListener('click', ()=>document.getElementById('register-area').style.display = 'block');
  document.getElementById('close-register').addEventListener('click', ()=>document.getElementById('register-area').style.display = 'none');

  document.getElementById('login-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fm = new FormData(e.target);
    const body = new URLSearchParams();
    body.append('action','login');
    body.append('email', fm.get('email'));
    body.append('password', fm.get('password'));
    const res = await apiPost('/api/auth', body);
    if (res && res.id) {
      localStorage.setItem('nexus_user', JSON.stringify(res));
      toast('Login OK');
      navigate('#/feed');
      renderRoute();
    } else {
      toast('Credenciais inválidas');
    }
  });

  document.getElementById('register-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fm = new FormData(e.target);
    const body = new URLSearchParams();
    body.append('action','register');
    body.append('email', fm.get('email'));
    body.append('password', fm.get('password'));
    body.append('name', fm.get('name'));
    body.append('type', fm.get('type'));
    const res = await apiPost('/api/auth', body);
    if (res && res.id) { toast('Conta criada'); localStorage.setItem('nexus_user', JSON.stringify(res)); navigate('#/feed'); renderRoute(); }
    else toast('Erro ao registrar');
  });
}

/* ========== FEED ========== */
async function renderFeed() {
  const user = getUser();
  app.innerHTML = `
    <section class="card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h2>Feed</h2>
        <div>
          <button class="btn" onclick="navigate('#/vagas')">Vagas</button>
          <button class="btn" onclick="navigate('#/empresas')">Empresas</button>
          <button class="btn" onclick="navigate('#/candidaturas')">Candidaturas</button>
        </div>
      </div>
      <div style="margin-top:10px" class="card">
        <form id="post-form" class="form">
          <label>Compartilhe algo interessante:
            <textarea name="content" rows="3" placeholder="Compartilhe um projeto, vaga ou conquista..."></textarea>
          </label>
          <div style="display:flex;gap:8px">
            <button class="btn primary" type="submit">Postar</button>
            <button type="button" id="logout" class="btn ghost">Sair</button>
          </div>
        </form>
      </div>
    </section>
    <section id="posts" class="grid" style="margin-top:12px"></section>
    <div class="bottom-nav" style="display:flex;justify-content:center">
      <button onclick="navigate('#/feed')">Início</button>
      <button onclick="navigate('#/vagas')">Vagas</button>
      <button onclick="navigate('#/empresas')">Empresas</button>
      <button onclick="navigate('#/candidaturas')">Candidaturas</button>
      <button onclick="navigate('#/perfil/${user? user.id : ''}')">Perfil</button>
    </div>
  `;

  document.getElementById('logout').addEventListener('click', ()=>{
    localStorage.removeItem('nexus_user'); toast('Logout'); navigate('#/'); renderRoute();
  });

  document.getElementById('post-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fm = new FormData(e.target);
    const body = new URLSearchParams();
    body.append('authorId', user ? user.id : '0');
    body.append('authorName', user ? user.name : 'Anon');
    body.append('type', user ? user.type : 'student');
    body.append('content', fm.get('content'));
    const p = await apiPost('/api/feed', body);
    if (p && p.id) { toast('Post criado'); loadPosts(); e.target.reset(); }
    else toast('Erro ao postar');
  });

  await loadPosts();
}

async function loadPosts() {
  const list = await apiGet('/api/feed');
  const postsEl = document.getElementById('posts');
  if (!list || !list.length) { postsEl.innerHTML = '<div class="empty">Sem posts ainda.</div>'; return; }
  postsEl.innerHTML = list.map(p => `
    <article class="card post">
      <div class="post-head">
        <div class="avatar">${esc((p.authorName||'')[0]||'U')}</div>
        <div>
          <h3>${esc(p.authorName)}</h3>
          <div class="meta">${esc(p.type)} • ${esc(p.time||'agora')}</div>
        </div>
      </div>
      <div class="content">${esc(p.content)}</div>
      <div style="margin-top:10px" class="small">
        <button class="btn ghost" onclick="toast('Curtir (simulado)')">Curtir</button>
        <button class="btn ghost" onclick="toast('Comentar (simulado)')">Comentar</button>
      </div>
    </article>
  `).join('');
}

/* ========== VAGAS ========== */
async function renderVagas() {
  app.innerHTML = `
    <section class="card">
      <h2>Vagas Disponíveis</h2>
      <div id="jobs-list" class="grid" style="margin-top:12px"></div>
      <div style="margin-top:12px" class="card">
        <h3>Publicar Vaga (simples)</h3>
        <form id="job-form" class="form">
          <label>Título<input name="title" required /></label>
          <label>Empresa<input name="company" required /></label>
          <label>Descrição<textarea name="description" rows="3"></textarea></label>
          <label>Tags<input name="tags" /></label>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button class="btn primary" type="submit">Publicar</button>
          </div>
        </form>
      </div>
    </section>
  `;
  document.getElementById('job-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fm = new FormData(e.target);
    const body = new URLSearchParams();
    body.append('title', fm.get('title'));
    body.append('company', fm.get('company'));
    body.append('description', fm.get('description'));
    body.append('tags', fm.get('tags'));
    const j = await apiPost('/api/vagas', body);
    if (j && j.id) { toast('Vaga publicada'); e.target.reset(); loadJobs(); } else toast('Erro');
  });
  await loadJobs();
}

async function loadJobs() {
  const list = await apiGet('/api/vagas');
  const el = document.getElementById('jobs-list');
  if (!list || !list.length) { el.innerHTML = '<div class="empty">Nenhuma vaga.</div>'; return; }
  el.innerHTML = list.map(j => `
    <article class="card">
      <h3>${esc(j.title)}</h3>
      <div class="small">${esc(j.company)} • ${esc(j.tags)}</div>
      <p class="meta">${esc(j.description)}</p>
      <div style="margin-top:8px">
        <button class="btn" onclick='applyForJob(${JSON.stringify(j).replace(/'/g,"\\'")})'>Aplicar</button>
        <button class="btn ghost" onclick="toast('Salvar vaga (simulado)')">Salvar</button>
      </div>
    </article>
  `).join('');
}

async function applyForJob(job) {
  const user = getUser();
  if (!user) { toast('Faça login para aplicar'); navigate('#/'); return; }
  const body = new URLSearchParams();
  body.append('jobId', job.id);
  body.append('jobTitle', job.title);
  body.append('applicantId', user.id);
  body.append('applicantName', user.name);
  const a = await apiPost('/api/candidaturas', body);
  if (a && a.id) toast('Candidatura enviada'); else toast('Erro ao aplicar');
}

/* ========== EMPRESAS ========== */
async function renderEmpresas() {
  app.innerHTML = `
    <section class="card">
      <h2>Empresas Parceiras - Conheça as empresas que estão contratando</h2>
      <div style="margin-top:10px">
        <input id="company-search" placeholder="Buscar empresas..." style="width:100%;padding:10px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.04)"/>
      </div>
      <div id="companies" class="grid" style="margin-top:12px"></div>
    </section>
  `;
  document.getElementById('company-search').addEventListener('input', (e)=>filterCompanies(e.target.value));
  await loadCompanies();
}

let globalCompanies = [];
async function loadCompanies() {
  const list = await apiGet('/api/empresas');
  globalCompanies = list || [];
  renderCompanyList(globalCompanies);
}
function renderCompanyList(list) {
  const el = document.getElementById('companies');
  if (!list || !list.length) { el.innerHTML = '<div class="empty">Nenhuma empresa encontrada.</div>'; return; }
  el.innerHTML = list.map(c => `
    <article class="card">
      <h3>${esc(c.name)}</h3>
      <div class="small">${esc(c.location)} — ${esc(c.employees)} funcionários — ★ ${esc(c.rating)}</div>
      <div style="margin-top:8px">
        <button class="btn" onclick="toast('Ver vagas (simulado)')">Ver Vagas</button>
        <button class="btn ghost" onclick="navigate('#/perfil/${c.id}')">Ver Perfil</button>
      </div>
    </article>
  `).join('');
}
function filterCompanies(term) {
  const t = (term||'').toLowerCase();
  renderCompanyList(globalCompanies.filter(c => c.name.toLowerCase().includes(t) || c.location.toLowerCase().includes(t)));
}

/* ========== CANDIDATURAS ========== */
async function renderCandidaturas() {
  const user = getUser();
  app.innerHTML = `
    <section class="card">
      <h2>Minhas Candidaturas</h2>
      <div id="apps-list" style="margin-top:12px"></div>
    </section>
  `;
  const list = await apiGet('/api/candidaturas');
  const my = (list || []).filter(a => (!user || user.type === 'company') ? true : a.applicantId === (user ? user.id : ''));
  const el = document.getElementById('apps-list');
  if (!my.length) { el.innerHTML = '<div class="empty">Nenhuma candidatura.</div>'; return; }
  el.innerHTML = my.map(a => `
    <article class="card">
      <h3>${esc(a.jobTitle)}</h3>
      <div class="small">Empresa: ${esc(a.jobTitle? '' : '')} • Data: ${esc(a.date)}</div>
      <div style="margin-top:8px"><strong>Status:</strong> ${esc(a.status)}</div>
    </article>
  `).join('');
}

/* ========== PERFIL ========== */
async function renderPerfil(id) {
  if (!id) {
    const user = getUser();
    if (!user) { toast('Faça login'); navigate('#/'); return; }
    id = user.id;
  }
  const profile = await apiGet('/api/profile?id=' + encodeURIComponent(id));
  app.innerHTML = `
    <section class="card">
      <div style="display:flex;gap:18px;align-items:center">
        <div class="avatar">${esc((profile.name||'')[0]||'U')}</div>
        <div>
          <h2>${esc(profile.name||profile.name)}</h2>
          <div class="small">${esc(profile.type || 'Estudante')}</div>
        </div>
      </div>
      <div style="margin-top:12px" class="card">
        <h3>Sobre</h3>
        <p class="small">${esc(profile.bio || '')}</p>
        <h4 style="margin-top:8px">Habilidades</h4>
        <div class="small">${(profile.skills||'').split(',').map(s=>`<span class="chip" style="margin-right:6px">${esc(s.trim())}</span>`).join('')}</div>
      </div>
    </section>
  `;
}

/* ========== HELPERS & API ========= */
function esc(s){ if(!s) return ''; return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
function toast(msg){ const t = document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.classList.add('visible'),20); setTimeout(()=>t.classList.remove('visible'),2200); setTimeout(()=>t.remove(),2600); }

async function apiGet(path) {
  try {
    const res = await fetch(API_BASE + path);
    if (res.ok) return await res.json();
    return [];
  } catch (e) { console.error('apiGet',e); return []; }
}
async function apiPost(path, body) {
  try {
    const res = await fetch(API_BASE + path, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}, body: body.toString() });
    if (res.ok) return await res.json();
    return null;
  } catch (e) { console.error('apiPost',e); return null; }
}

function getUser(){ try { return JSON.parse(localStorage.getItem('nexus_user') || 'null'); } catch(e){ return null; } }

/* Not found */
function renderNotFound(){ app.innerHTML = `<div class="card"><h2>404 - Página não encontrada</h2></div>`; }

/* --- INIT --- */
window.addEventListener('hashchange', renderRoute);
mountListeners();
renderRoute();
