/* ====== Simple front-end mailbox (localStorage) ====== */
/* Data shape: { id, from, to, subject, body, dateISO, folder: 'inbox'|'sent'|'drafts', read } */

const STORAGE_KEY = "fuss_mailbox_v1";
const currentUser = "hansith"; // TODO: replace with PHP session username

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
const $saveDraftBtn = document.getElementById("saveDraftBtn");
const $error = document.getElementById("formError");

let activeFolder = "inbox";
let messages = loadMessages();

/* Seed example inbox if empty */
if (messages.length === 0) {
  messages = [
    mkMsg({ from: "admin", to: currentUser, subject: "Welcome to FUSS", body: "Thanks for joining!", folder: "inbox" }),
    mkMsg({ from: "dass", to: currentUser, subject: "Design check", body: "Can you review Skills page layout?", folder: "inbox" }),
  ];
  saveMessages(messages);
}

/* Helpers */
function mkMsg({ from = currentUser, to, subject, body, folder = "sent" }) {
  return {
    id: "m_" + Date.now() + "_" + Math.floor(Math.random() * 9999),
    from, to, subject, body,
    dateISO: new Date().toISOString(),
    folder,
    read: folder !== "inbox" // new inbox messages start unread if needed
  };
}

function loadMessages() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveMessages(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

/* Rendering */
function render() {
  const q = ($search.value || "").toLowerCase();

  const filtered = messages
    .filter(m => m.folder === activeFolder)
    .filter(m => {
      const hay = [m.from, m.to, m.subject, m.body].join(" ").toLowerCase();
      return q ? hay.includes(q) : true;
    })
    .sort((a,b) => new Date(b.dateISO) - new Date(a.dateISO));

  $list.innerHTML = filtered.map(m => cardHTML(m)).join("") || emptyState();
}

function cardHTML(m) {
  const date = new Date(m.dateISO).toLocaleString();
  const whoLine = activeFolder === "sent" ? `To: ${m.to}` : `From: ${m.from}`;
  const snippet = m.body.length > 120 ? m.body.slice(0,120) + "..." : m.body;

  return `
    <article class="message-card" data-id="${m.id}">
      <div class="meta">
        <span>${whoLine}</span>
        <span>•</span>
        <time datetime="${m.dateISO}">${date}</time>
      </div>
      <div class="subject">${escapeHTML(m.subject)}</div>
      <div class="snippet">${escapeHTML(snippet)}</div>
      ${activeFolder !== "drafts" ? "" : draftActions(m.id)}
    </article>
  `;
}
function draftActions(id){
  return `
    <div class="actions" style="margin-top:8px;">
      <button type="button" data-act="edit-draft" data-id="${id}">Edit</button>
      <button type="button" data-act="delete-draft" data-id="${id}">Delete</button>
    </div>
  `;
}
function emptyState(){
  const label = activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1);
  return `<p style="opacity:.7;">No ${label} messages yet.</p>`;
}
function escapeHTML(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* Tab switch */
$tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    $tabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFolder = btn.dataset.tab;
    render();
  });
});

/* Search */
$search.addEventListener("input", render);

/* Compose open/close */
$openCompose.addEventListener("click", () => {
  $composer.classList.remove("hidden");
  $to.focus();
});
$closeCompose.addEventListener("click", resetComposer);

function resetComposer(){
  $composer.classList.add("hidden");
  $form.reset();
  $form.dataset.editingId = ""; // clear draft edit mode
  $error.textContent = "";
}

/* Save Draft */
$saveDraftBtn.addEventListener("click", () => {
  const draft = collectForm();
  if (!draft) return;

  if ($form.dataset.editingId) {
    // update existing draft
    const i = messages.findIndex(m => m.id === $form.dataset.editingId);
    if (i !== -1) {
      messages[i] = {...messages[i], ...draft, folder: "drafts"};
    }
  } else {
    messages.push(mkMsg({ from: currentUser, to: draft.to, subject: draft.subject, body: draft.body, folder: "drafts" }));
  }
  saveMessages(messages);
  resetComposer();
  // switch to drafts to show it
  switchTab("drafts");
});

/* Send */
$form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = collectForm();
  if (!data) return;

  // 1) Front-end only (local): push to Sent, and (for demo) mirror into Inbox for the receiver
  const sent = mkMsg({ from: currentUser, to: data.to, subject: data.subject, body: data.body, folder: "sent" });
  const received = {...sent, id: sent.id + "_rx", folder: "inbox", to: data.to, from: currentUser};
  messages.push(sent);
  messages.push(received);
  // If sending from a draft being edited, remove that draft
  if ($form.dataset.editingId) {
    messages = messages.filter(m => m.id !== $form.dataset.editingId);
  }
  saveMessages(messages);
  resetComposer();
  switchTab("sent");

  /* ====== BACKEND HOOK (replace later) ======
  fetch('send_message.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ to: data.to, subject: data.subject, body: data.body })
  }).then(r => r.json()).then(resp => { ... });
  =========================================== */
});

/* Clicks inside list (edit/delete drafts) */
$list.addEventListener("click", (e) => {
  const act = e.target?.dataset?.act;
  const id = e.target?.dataset?.id;
  if (!act || !id) return;

  if (act === "edit-draft") {
    const d = messages.find(m => m.id === id && m.folder === "drafts");
    if (!d) return;
    $to.value = d.to || "";
    $subject.value = d.subject || "";
    $body.value = d.body || "";
    $form.dataset.editingId = d.id;
    $composer.classList.remove("hidden");
    $to.focus();
  } else if (act === "delete-draft") {
    messages = messages.filter(m => m.id !== id);
    saveMessages(messages);
    render();
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
  if (!to || !subject || !body) {
    $error.textContent = "Please fill in To, Subject, and Message.";
    return null;
  }
  $error.textContent = "";
  return { to, subject, body };
}

/* Initial paint */
render();


