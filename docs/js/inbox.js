let currentUser = null; 

async function api(path, body) {
  const res = await fetch(`index.php?action=${path}`,{ method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin', body: body? JSON.stringify(body): undefined });
  const data = await res.json().catch(()=>({}));
  if(!res.ok || data.error) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}
async function apiGet(path, params) {
  const usp = new URLSearchParams(params||{});
  const url = `index.php?action=${encodeURIComponent(path)}&${usp.toString()}`;
  const r = await fetch(url, { credentials:'same-origin' });
  const text = await r.text();
  let data; try{ data = JSON.parse(text);}catch{ throw new Error('Invalid server response'); }
  if(!r.ok || data.error) throw new Error(data.error || `Request failed: ${r.status}`);
  return data;
}

const $tabs = document.querySelectorAll(".tab");
const $list = document.getElementById("messages");
const $search = document.getElementById("msgSearch");
const $composer = document.getElementById("composer");
const $openCompose = document.getElementById("openCompose");
const $closeCompose = document.getElementById("closeCompose");
const $form = document.getElementById("messageForm");
const $to = document.getElementById("toUser");
const $subject = document.getElementById("subject");
const $body = document.getElementById("body");
const $error = document.getElementById("formError");
const $thread = document.getElementById("thread");
const $threadMsgs = document.getElementById("threadMsgs");
const $threadInput = document.getElementById("threadInput");
const $threadSend = document.getElementById("threadSend");
const $threadBack = document.getElementById("threadBack");
const $threadTitle = document.getElementById("threadTitle");
const $threadSub = document.getElementById("threadSub");
const $threadErr = document.getElementById("threadErr");

let activeFolder = "inbox";
let messages = [];
let userIndex = null; 
let usernameById = null; 
let displayNameById = null; 
let currentUserObj = null; 
let currentThreadOtherId = null;

(async function initMailbox(){
  try{
    const me = await apiGet('me');
    currentUserObj = me && me.user ? me.user : null;
    currentUser = (currentUserObj && (currentUserObj.username || currentUserObj.display_name)) || null;
    const ul = await apiGet('users');
    userIndex = Object.create(null);
    usernameById = Object.create(null);
    displayNameById = Object.create(null);
    (ul.users||[]).forEach(u=>{ userIndex[(u.username||'').toLowerCase()] = u.id; usernameById[u.id] = u.username; displayNameById[u.id] = u.display_name || u.username; });
    await reloadMessages(me);
    render();
  }catch(err){
    if(!currentUser){ currentUser = 'me'; }
    render();
  }
})();

async function reloadMessages(mePayload){
  const mres = await apiGet('messages');
  const me = mePayload && mePayload.user ? mePayload.user : (await apiGet('me')).user;
  messages = (mres.messages||[]).map(m=>{
    const isSender = !!m.sender_id && me && (m.sender_id === me.id);
    const folder = isSender ? 'sent' : 'inbox';
    const subjectInline = '';
    const body = m.body || '';
    return {
      id: `srv_${m.id}`,
      from: m.sender || (isSender ? (me.display_name||me.username) : '—'),
      to: m.receiver || (!isSender ? (me.display_name||me.username) : '—'),
      subject: subjectInline,
      body,
      dateISO: m.created_at || new Date().toISOString(),
      folder,
      read: true,
      sender_id: m.sender_id,
      receiver_id: m.receiver_id
    };
  });
}

function mkMsg({ from = (currentUser||'me'), to, subject, body, folder = "sent" }) {
  return {
    id: "m_" + Date.now() + "_" + Math.floor(Math.random() * 9999),
    from, to, subject, body,
    dateISO: new Date().toISOString(),
    folder,
    read: folder !== "inbox" 
  };
}

function render() {
  const q = ($search.value || "").toLowerCase();
  const meId = currentUserObj ? currentUserObj.id : null;
  const convMap = new Map();
  for (const m of messages) {
    if (m.folder !== activeFolder) continue;
    const otherId = (m.sender_id === meId) ? m.receiver_id : m.sender_id;
    if (otherId == null) continue;
    const existing = convMap.get(otherId);
    if (!existing || new Date(m.dateISO) > new Date(existing.dateISO)) {
      convMap.set(otherId, m);
    }
  }
  let list = Array.from(convMap.values());
  list = list.filter(m => {
    const otherName = displayNameById && ((m.sender_id===meId)? displayNameById[m.receiver_id] : displayNameById[m.sender_id]) || '';
    const hay = [otherName, m.from, m.to, m.subject, m.body].join(' ').toLowerCase();
    return q ? hay.includes(q) : true;
  });
  list.sort((a,b) => new Date(b.dateISO) - new Date(a.dateISO));

  $list.innerHTML = list.map(m => cardHTML(m)).join("") || emptyState();
}

function cardHTML(m) {
  const date = new Date(m.dateISO).toLocaleString();
  const whoLine = activeFolder === "sent" ? `To: ${m.to}` : `From: ${m.from}`;
  const subjLine = (m.subject && m.subject.trim()) ? `<div class="subject">${escapeHTML(m.subject)}</div>` : '';
  const fullBody = `<div class="body" style="white-space:pre-wrap;">${escapeHTML(m.body)}</div>`;

  return `
    <article class="message-card" data-id="${m.id}">
      <div class="meta">
        <span>${whoLine}</span>
        <span>•</span>
        <time datetime="${m.dateISO}">${date}</time>
      </div>
      ${subjLine}
      ${fullBody}
      <div class="actions" style="margin-top:8px;display:flex;gap:8px;">
        <button type="button" data-act="reply" data-id="${m.id}">Reply</button>
      </div>
    </article>
  `;
}
function emptyState(){
  const label = activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1);
  return `<p style="opacity:.7;">No ${label} messages yet.</p>`;
}
function escapeHTML(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

$tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    $tabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFolder = btn.dataset.tab;
    render();
  });
});

$search.addEventListener("input", render);

if ($threadBack) {
  $threadBack.addEventListener('click', () => {
    currentThreadOtherId = null;
    $thread.classList.add('hidden');
    $list.classList.remove('hidden');
  });
}

function openThreadFor(otherId){
  currentThreadOtherId = otherId;
  const otherName = displayNameById && displayNameById[otherId] ? displayNameById[otherId] : (usernameById && usernameById[otherId] ? usernameById[otherId] : 'User');
  if ($threadTitle) $threadTitle.textContent = otherName;
  if ($threadSub && currentUserObj) $threadSub.textContent = `Chat with ${otherName}`;
  renderThread();
  $list.classList.add('hidden');
  $thread.classList.remove('hidden');
  if ($threadInput) $threadInput.focus();
}

function renderThread(){
  if (!$threadMsgs || currentThreadOtherId==null) return;
  const meId = currentUserObj ? currentUserObj.id : null;
  const conv = messages
    .filter(m => (m.sender_id===meId && m.receiver_id===currentThreadOtherId) || (m.sender_id===currentThreadOtherId && m.receiver_id===meId))
    .sort((a,b)=> new Date(a.dateISO) - new Date(b.dateISO));
  $threadMsgs.innerHTML = conv.map(m => threadBubbleHTML(m, meId)).join('') || '<p style="opacity:.7;">No messages yet.</p>';
  $threadMsgs.scrollTop = $threadMsgs.scrollHeight;
}

function threadBubbleHTML(m, meId){
  const isMe = m.sender_id === meId;
  const name = isMe ? (currentUserObj.display_name||currentUserObj.username) : (displayNameById[m.sender_id]||usernameById[m.sender_id]||'User');
  const date = new Date(m.dateISO).toLocaleString();
  return `
    <div style="display:flex; ${isMe?'justify-content:flex-end;':''}">
      <div style="max-width:70%; padding:10px 12px; border-radius:12px; ${isMe?'background:var(--yellow); color:#111;':'background:#0b1220; border:1px solid var(--line);'}">
        <div style="font-size:12px; opacity:.8; margin-bottom:4px;">${escapeHTML(name)} • <time>${date}</time></div>
        <div style="white-space:pre-wrap;">${escapeHTML(m.body)}</div>
      </div>
    </div>
  `;
}

async function sendThreadMessage(){
  if (currentThreadOtherId==null) return;
  const text = ($threadInput.value||'').trim();
  if (!text){ if($threadErr) $threadErr.textContent='Type a message.'; return; }
  if($threadErr) $threadErr.textContent='';
  try{
    await api('message_send', { receiver_id: currentThreadOtherId, body: text });
    $threadInput.value = '';
    await reloadMessages();
    renderThread();
  }catch(err){
    if($threadErr) $threadErr.textContent = err.message || 'Failed to send';
  }
}

if ($threadSend) $threadSend.addEventListener('click', sendThreadMessage);
if ($threadInput) $threadInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); sendThreadMessage(); }});

if ($form) $form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = collectForm();
  if (!data) return;
  let receiverId = null;
  if (userIndex) {
    receiverId = userIndex[(data.to||'').toLowerCase()] || null;
  }
  if (!receiverId) {
    $error.textContent = "Unknown recipient username";
    return;
  }
  const bodyToSend = data.body;
  try{
    await api('message_send', { receiver_id: receiverId, body: bodyToSend });
  }catch(err){
    $error.textContent = err.message || 'Failed to send';
    return;
  }
  await reloadMessages();
  if (usernameById) {
    const otherId = userIndex[(data.to||'').toLowerCase()];
    if (otherId) openThreadFor(otherId);
  }
});

$list.addEventListener("click", (e) => {
  const act = e.target?.dataset?.act;
  const id = e.target?.dataset?.id;
  if (act === "reply" && id) {
    const m = messages.find(x => x.id === id);
    if (!m) return;
    const otherId = activeFolder === 'sent' ? m.receiver_id : m.sender_id;
    openThreadFor(otherId);
    return;
  }
  const card = e.target.closest('.message-card');
  if (card){
    const m = messages.find(x => x.id === card.dataset.id);
    if (!m) return;
    const otherId = activeFolder === 'sent' ? m.receiver_id : m.sender_id;
    openThreadFor(otherId);
  }
});

/* Utilities */
function switchTab(folder){
  activeFolder = folder;
  $tabs.forEach(b => b.classList.toggle("active", b.dataset.tab === folder));
  render();
}
function collectForm(){
  const to = $to.value.trim();
  const subject = $subject.value.trim();
  const body = $body.value.trim();
  if (!to || !body) {
    $error.textContent = "Please fill in To and Message.";
                      return null;
  }
  $error.textContent = "";
  return { to, subject, body };
}

render();


