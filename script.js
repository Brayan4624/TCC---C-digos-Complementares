const API = '';

/* === UTILITÁRIOS === */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function showModal(id) {
  $('#overlay').classList.remove('hidden');
  $(id).classList.remove('hidden');
}
function closeAll() {
  $('#overlay').classList.add('hidden');
  $$('.modal').forEach(m => m.classList.add('hidden'));
}

/* === EVENTOS DE BOTÕES === */
$('#btn-profile-form').addEventListener('click', () => showModal('#profile-modal'));
$('#btn-project-form').addEventListener('click', () => showModal('#project-modal'));
$('#close-profile').addEventListener('click', closeAll);
$('#close-project').addEventListener('click', closeAll);
$('#overlay').addEventListener('click', closeAll);

/* === FETCH & RENDER === */
async function fetchStudents() {
  const res = await fetch('/api/students');
  return await res.json();
}

async function fetchProjects() {
  const res = await fetch('/api/projects');
  return await res.json();
}

function renderStudents(list) {
  const container = $('#students-list');
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<div class="empty">Nenhum perfil ainda. Seja o primeiro!</div>';
    return;
  }

  list.forEach(s => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-head">
        <div class="avatar">${(s.name || '?')[0]}</div>
        <div>
          <h3>${escapeHtml(s.name)}</h3>
          <div class="meta">ID: <strong>${s.id}</strong></div>
        </div>
      </div>
      <p class="bio">${escapeHtml(s.bio || '')}</p>
      <div class="chips">${(s.skills || '')
        .split(',')
        .filter(Boolean)
        .map(t => `<span class="chip">${escapeHtml(t.trim())}</span>`)
        .join('')}</div>
    `;
    container.appendChild(card);
  });
}

function renderProjects(list) {
  const container = $('#projects-list');
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<div class="empty">Nenhum projeto compartilhado.</div>';
    return;
  }

  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card project';
    card.innerHTML = `
      <div class="card-head">
        <div class="avatar small">P</div>
        <div>
          <h3>${escapeHtml(p.title)}</h3>
          <div class="meta">Autor ID: <strong>${p.authorId}</strong> • Projeto #${p.id}</div>
        </div>
      </div>
      <p class="bio">${escapeHtml(p.description || '')}</p>
      <div class="chips">${(p.tags || '')
        .split(',')
        .filter(Boolean)
        .map(t => `<span class="chip">${escapeHtml(t.trim())}</span>`)
        .join('')}</div>
    `;
    container.appendChild(card);
  });
}

function escapeHtml(s) {
  if (!s) return '';
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function reloadAll() {
  const [students, projects] = await Promise.all([fetchStudents(), fetchProjects()]);
  renderStudents(students);
  renderProjects(projects);
}

/* === FORMULÁRIOS === */
$('#profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = new URLSearchParams(fd);
  const res = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: body.toString(),
  });
  if (res.ok) {
    e.target.reset();
    closeAll();
    reloadAll();
    toast('Perfil salvo com sucesso!');
  } else {
    toast('Erro ao salvar perfil');
  }
});

$('#project-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = new URLSearchParams(fd);
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: body.toString(),
  });
  if (res.ok) {
    e.target.reset();
    closeAll();
    reloadAll();
    toast('Projeto compartilhado!');
  } else {
    toast('Erro ao compartilhar projeto');
  }
});

/* === TOAST === */
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('visible'), 20);
  setTimeout(() => t.classList.remove('visible'), 2200);
  setTimeout(() => t.remove(), 2600);
}

/* === INICIALIZAÇÃO === */
reloadAll();
