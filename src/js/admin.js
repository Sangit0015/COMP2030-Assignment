(async function guard(){
  try{
    const r = await fetch('index.php?action=me', { credentials:'same-origin' });
    const me = await r.json().catch(()=>null);
    if (!me || !me.user || me.user.role_id !== 1){
      window.location.href = 'hero_dash.html';
      return;
    }
  }catch{
    window.location.href = 'index.html';
    return;
  }
})();

// Helpers
async function apiGet(path, params){
  const usp = new URLSearchParams(params||{});
  const url = `index.php?action=${encodeURIComponent(path)}&${usp.toString()}`;
  const r = await fetch(url, { credentials:'same-origin' });
  const t = await r.text();
  let d; try{ d = JSON.parse(t);}catch{ throw new Error('Invalid server response'); }
  if(!r.ok || d.error) throw new Error(d.error || `Request failed: ${r.status}`);
  return d;
}
async function apiPost(path, body){
  const r = await fetch(`index.php?action=${path}`, { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: JSON.stringify(body||{}) });
  const d = await r.json().catch(()=>({}));
  if(!r.ok || d.error) throw new Error(d.error || `Request failed: ${r.status}`);
  return d;
}

const tBody = document.querySelector('#userTable tbody');
const uTotal = document.getElementById('uTotal');
const sTotal = document.getElementById('sTotal');
const searchInput = document.getElementById('fanSearch');
const searchBtn = document.querySelector('.search-btn');

let USERS = [];

function paintUsers(list){
  const rows = list.map(u => `
    <tr data-id="${u.id}">
      <td>${escapeHTML(u.display_name||u.username||'')}</td>
      <td>${escapeHTML(u.email||'')}</td>
      <td>${u.credits!=null? u.credits : ''}</td>
      <td><button class="btn" data-act="edit" data-id="${u.id}">Edit</button></td>
    </tr>
  `).join('');
  tBody.innerHTML = rows || '<tr><td colspan="4" style="opacity:.7;">No users</td></tr>';
}

function escapeHTML(s){ return (s||'').toString().replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

async function loadStats(){
  try{ const us = await apiGet('users'); USERS = us.users||[]; if(uTotal) uTotal.textContent = USERS.length; paintUsers(USERS); }catch{}
  try{ const sk = await apiGet('skills'); const count = (sk.skills||[]).length; if(sTotal) sTotal.textContent = count; }catch{}
}

const epModal   = document.getElementById("editProfileModal");
const epPreview = document.getElementById("epPreview");
const epAvatar  = document.getElementById("epAvatar");

const epFullName    = document.getElementById("epFullName");
const epDisplayName = document.getElementById("epDisplayName");
const epEmail       = document.getElementById("epEmail");
const epStudentId   = document.getElementById("epStudentId");
const epFan         = document.getElementById("epFan");
const epAddress     = document.getElementById("epAddress");
const epPhone       = document.getElementById("epPhone");

const epForm    = document.getElementById("epForm");
const epInputs  = document.querySelectorAll(".ep-input");

const epCloseEls = document.querySelectorAll("[data-ep-close]"); // backdrop + close button

const suspendBtn = document.getElementById("suspend-btn");
const editBtn    = document.getElementById("edit-btn");
const cancelBtn  = document.getElementById("cancel-btn");

let isEditing = false;
let currentStudent = null;


function setEditing(enabled) {
  isEditing = enabled;
  epInputs.forEach(inp => enabled ? inp.removeAttribute("disabled")
                                  : inp.setAttribute("disabled", "true"));
  if (editBtn) editBtn.textContent = enabled ? "Save" : "Edit";
}
function updateSuspendUI(suspended) {
  if (!suspendBtn) return;
  suspendBtn.classList.toggle("suspended", suspended);
  suspendBtn.textContent = suspended ? "Unsuspend" : "Suspend";
}
function closeModal(){
  if (!epModal) return;
  epModal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  if (epAvatar) epAvatar.value='';
  setEditing(false);
}

async function openEditModal(userId){
  try{
    const res = await apiGet('admin_user_get', { user_id: userId });
    const u = res.user || {}; const p = res.profile || {};
    if (epFullName)    epFullName.value = u.username || '';
    if (epDisplayName) epDisplayName.value = u.display_name || '';
    if (epEmail)       epEmail.value = u.email || '';
    if (epStudentId)   epStudentId.value = u.id || '';
    if (epFan)         epFan.value = u.username || '';
    if (epAddress)     epAddress.value = p.address || '';
    if (epPhone)       epPhone.value = p.phone || '';
    const creditsEl = document.getElementById('epCredits');
    if (creditsEl) creditsEl.value = (u.credits!=null? u.credits : '');
    const bioEl = document.getElementById('epBio');
    if (bioEl) bioEl.value = p.about || '';
    updateSuspendUI(u.suspended==1 || u.suspended===true);
    if (epModal){ epModal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
    setEditing(false);
  }catch(err){ alert(err.message || 'Failed to load user'); }
}

async function saveUser(){
  const uid = epStudentId ? parseInt(epStudentId.value,10) : 0;
  if (!uid) { alert('Invalid user'); return; }
  const body = {
    user_id: uid,
    display_name: epDisplayName ? epDisplayName.value.trim() : undefined,
    email: epEmail ? epEmail.value.trim() : undefined,
    credits: (document.getElementById('epCredits')?.value||'')!=='' ? parseInt(document.getElementById('epCredits').value,10) : undefined,
    suspended: (document.getElementById('suspend-btn')?.classList.contains('suspended')) ? 1 : 0,
    about: document.getElementById('epBio') ? document.getElementById('epBio').value.trim() : undefined
  };
  try{
    await apiPost('admin_user_update', body);
    await loadStats();
    closeModal();
  }catch(err){ alert(err.message || 'Failed to update user'); }
}


if (epAvatar && epPreview) {
  epAvatar.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { epPreview.src = reader.result; };
    reader.readAsDataURL(file);
  });
}


if (editBtn) {
  editBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isEditing) { setEditing(true); return; }
    saveUser();
  });
}

if (suspendBtn) {
  suspendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const next = !suspendBtn.classList.contains("suspended");
    updateSuspendUI(next);

    alert(next ? "Student has been suspended." : "Student has been unsuspended.");
  });
}


epCloseEls.forEach(el => { el.addEventListener('click', closeModal); });

if (epForm) {
  epForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isEditing) return;
    saveUser();
  });
}


function applySearch(){
  const q = (searchInput?.value || '').toLowerCase();
  const filtered = !q ? USERS : USERS.filter(u =>
    (u.username||'').toLowerCase().includes(q) ||
    (u.display_name||'').toLowerCase().includes(q) ||
    (u.email||'').toLowerCase().includes(q)
  );
  paintUsers(filtered);
}
if (searchBtn) searchBtn.addEventListener('click', (e)=>{ e.preventDefault(); applySearch(); });
if (searchInput) searchInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); applySearch(); }});

if (tBody){
  tBody.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-act="edit"]');
    if (!btn) return;
    const id = parseInt(btn.dataset.id,10);
    if (id) openEditModal(id);
  });
}

loadStats();