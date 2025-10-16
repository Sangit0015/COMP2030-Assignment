let SKILLS = [];

const gridEl = document.getElementById('skillsGrid');
const qEl = document.getElementById('skillSearch');
const catEl = document.getElementById('skillCat');
const postBtn = document.getElementById('postSkill');
const toggleMineBtn = document.getElementById('toggleMine');

let CURRENT_USER = null; // {id, username, display_name, role_id}
let IS_ADMIN = false;
let SHOW_MINE_ONLY = false;

async function api(path, body){
  const res = await fetch(`index.php?action=${path}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'same-origin',
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(()=>({}));
  if(!res.ok || data.error) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}
async function apiGet(path, params){
  const usp = new URLSearchParams(params||{});
  const url = `index.php?action=${encodeURIComponent(path)}&${usp.toString()}`;
  const r = await fetch(url, { credentials:'same-origin' });
  const t = await r.text();
  let d; try{ d = JSON.parse(t);}catch{ throw new Error('Invalid server response'); }
  if(!r.ok || d.error) throw new Error(d.error || `Request failed: ${r.status}`);
  return d;
}

async function loadSkills(){
  try {
    const data = await api('skills');
    // normalize fields
    SKILLS = (data.skills || []).map(s => ({
      id: s.id,
      user_id: s.user_id,
      provider: s.display_name || '',
      title: s.title,
      desc: s.description || '',
      cat: s.category || 'other',
      credits: s.credits || 1,
    }));
    apply();
  } catch(e){
    // fallback empty
    SKILLS = [];
    apply();
  }
}

function paint(list) {
  gridEl.innerHTML = list.map(s => `
    <article class="card">
      <span class="badge">${s.cat}</span>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      <div class="meta">
        <span class="credits">${s.credits} credits</span>
        <button class="btn" data-id="${s.id}">Request</button>
        ${renderActions(s)}
      </div>
    </article>
  `).join('');
}

function renderActions(s){
  const isMine = CURRENT_USER && s.user_id === CURRENT_USER.id;
  if (isMine || IS_ADMIN) {
    return `
      <button class="btn secondary" data-edit="${s.id}">Edit</button>
      <button class="btn secondary" data-delete="${s.id}">Delete</button>
    `;
  }
  return `<button class="btn secondary" data-provider="${s.user_id}" data-skill="${s.id}">Provider</button>`;
}

function apply() {
  const q = (qEl.value || '').toLowerCase();
  const c = catEl.value;
  const out = SKILLS.filter(s =>
    (c === 'all' || s.cat === c) &&
    (s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)) &&
    (!SHOW_MINE_ONLY || (CURRENT_USER && s.user_id === CURRENT_USER.id))
  );
  paint(out);
}

async function postSkillFlow(){
  const title = prompt('Skill title');
  if(!title) return;
  const category = prompt('Category (e.g., tech, study, life, creative)') || 'other';
  const description = prompt('Short description') || '';
  try{
    await api('skill_create', { title, category, description });
    alert('Skill posted. Reloading...');
    await loadSkills();
  }catch(err){
    alert(err.message || 'Failed to post skill. Login required?');
  }
}

async function requestSkillFlow(id){
  try{
    await api('request_create', { skill_id: id, hours: 1 });
    alert('Requested successfully');
  }catch(err){
    alert(err.message || 'Failed to request. Login required?');
  }
}

qEl.addEventListener('input', apply);
catEl.addEventListener('change', apply);
postBtn.addEventListener('click', () => postSkillFlow());
gridEl.addEventListener('click', e => {
  const prov = e.target.closest('button[data-provider]');
  if (prov) {
    const sid = prov.dataset.skill;
    const s = SKILLS.find(x => x.id == sid);
    if (!s) return;
    showProviderPopup(s);
    return;
  }
  const ed = e.target.closest('button[data-edit]');
  if (ed) {
    const s = SKILLS.find(x => x.id == ed.dataset.edit);
    if (!s) return;
    return editSkillFlow(s);
  }
  const del = e.target.closest('button[data-delete]');
  if (del) {
    const s = SKILLS.find(x => x.id == del.dataset.delete);
    if (!s) return;
    return deleteSkillFlow(s);
  }
  const b = e.target.closest('button[data-id]');
  if (b) {
    const s = SKILLS.find(x => x.id == b.dataset.id);
    if (!s) return;
    requestSkillFlow(s.id);
  }
});

if (toggleMineBtn) {
  toggleMineBtn.addEventListener('click', () => {
    SHOW_MINE_ONLY = !SHOW_MINE_ONLY;
    toggleMineBtn.classList.toggle('primary', SHOW_MINE_ONLY);
    toggleMineBtn.textContent = SHOW_MINE_ONLY ? 'Showing: My Skills' : 'Show My Skills';
    apply();
  });
}

function showProviderPopup(skill){
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.6)';
  overlay.style.display = 'grid';
  overlay.style.placeItems = 'center';
  overlay.style.zIndex = '2000';

  const box = document.createElement('div');
  box.style.background = '#101722';
  box.style.border = '1px solid var(--yellow)';
  box.style.borderRadius = '14px';
  box.style.padding = '20px 22px';
  box.style.minWidth = '320px';
  box.style.maxWidth = '92vw';

  box.innerHTML = `
    <h3 style="color:var(--yellow);margin:0 0 10px;">Provider</h3>
    <div id="provBody" style="color:var(--muted);font-size:14px;line-height:1.5;">
      Loading...
    </div>
    <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
      <button id="provClose" class="btn secondary">Close</button>
    </div>
  `;
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  document.getElementById('provClose').addEventListener('click', () => overlay.remove());

  (async () => {
    try{
      const data = await apiGet('profile_get', { user_id: skill.user_id });
      const u = data.user || {}; const r = data.ratings || {}; const avg = r.average || {};
      const star = v => v==null? '—' : (Math.round(v*10)/10).toFixed(1) + ' ★';
      const html = `
        <div style="margin-bottom:8px;"><strong style="color:#fff;">${(u.display_name||u.username||'User')}</strong></div>
        <div style="margin-bottom:6px;">Advertised: <em style="color:#fff;">${skill.title}</em></div>
        <div style="display:grid;gap:6px;">
          <div>Skill: <span style="color:#fff;">${star(avg.rating_skill)}</span></div>
          <div>Helpfulness: <span style="color:#fff;">${star(avg.rating_help)}</span></div>
          <div>Trust: <span style="color:#fff;">${star(avg.rating_trust)}</span></div>
          <div>Communication: <span style="color:#fff;">${star(avg.rating_comm)}</span></div>
        </div>
      `;
      document.getElementById('provBody').innerHTML = html;
    }catch(err){
      document.getElementById('provBody').textContent = err.message || 'Failed to load provider.';
    }
  })();
}

async function editSkillFlow(s){
  const newTitle = prompt('Edit title', s.title);
  if (newTitle === null) return;
  const newCat = prompt('Edit category', s.cat) || s.cat;
  const newDesc = prompt('Edit description', s.desc) || '';
  try{
    await api('skill_update', { id: s.id, title: newTitle, category: newCat, description: newDesc });
    await loadSkills();
    alert('Skill updated');
  }catch(err){
    alert(err.message || 'Failed to update skill');
  }
}

async function deleteSkillFlow(s){
  if (!confirm('Delete this skill?')) return;
  try{
    // use GET for simplicity
    await apiGet('skill_delete', { id: s.id });
    await loadSkills();
    alert('Skill deleted');
  }catch(err){
    alert(err.message || 'Failed to delete skill');
  }
}

(async function init(){
  try {
    const me = await apiGet('me');
    CURRENT_USER = me && me.user ? me.user : null;
    IS_ADMIN = CURRENT_USER && (CURRENT_USER.role_id === 1);
  } catch {}
  await loadSkills();
})();

