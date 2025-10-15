let SKILLS = [];

const gridEl = document.getElementById('skillsGrid');
const qEl = document.getElementById('skillSearch');
const catEl = document.getElementById('skillCat');
const postBtn = document.getElementById('postSkill');

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

async function loadSkills(){
  try {
    const data = await api('skills');
    // normalize fields
    SKILLS = (data.skills || []).map(s => ({
      id: s.id,
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
      </div>
    </article>
  `).join('');
}

function apply() {
  const q = (qEl.value || '').toLowerCase();
  const c = catEl.value;
  const out = SKILLS.filter(s =>
    (c === 'all' || s.cat === c) &&
    (s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q))
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
  const b = e.target.closest('button[data-id]');
  if (!b) return;
  const s = SKILLS.find(x => x.id == b.dataset.id);
  if (!s) return;
  requestSkillFlow(s.id);
});

loadSkills();
