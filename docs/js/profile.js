// FUSS Profile Script (inline editable + persistent)
const Chips = ['Python', 'HTML/CSS', 'Poster Design'];
const STORAGE_KEY = "fuss_profile_v1";

// Elements
const ul = document.getElementById('pSkills');
const nameEl = document.getElementById('pName');
const courseEl = document.getElementById('pCourse');
const emailEl = document.getElementById('pEmail');
const aboutEl = document.getElementById('pAbout');
const editBtn = document.getElementById('edit');

// Create Save + Cancel buttons dynamically if missing
let saveBtn = document.getElementById('save');
let cancelBtn = document.getElementById('cancel');
if (!saveBtn) {
  saveBtn = document.createElement('button');
  saveBtn.id = 'save';
  saveBtn.className = 'btn primary hidden';
  saveBtn.textContent = 'Save';
  editBtn.after(saveBtn);
}
if (!cancelBtn) {
  cancelBtn = document.createElement('button');
  cancelBtn.id = 'cancel';
  cancelBtn.className = 'btn secondary hidden';
  cancelBtn.textContent = 'Cancel';
  saveBtn.after(cancelBtn);
}

// Render skill chips
function paint() {
  ul.innerHTML = Chips.map(c =>
    `<li data-skill="${c}">
      <span>${c}</span>
      <button class="del hidden" title="Remove">✕</button>
    </li>`
  ).join('');
}

// Add a new skill
function addSkill(label) {
  if (!label) return;
  Chips.push(label);
  paint();
  saveData();
}

// Toggle editable fields
function setEditable(on) {
  [nameEl, courseEl, emailEl, aboutEl].forEach(el => {
    el.contentEditable = on ? 'true' : 'false';
    el.style.outline = on ? '1px dashed rgba(244,197,66,.35)' : 'none';
    el.style.borderRadius = on ? '6px' : '0';
  });

  // Add skill input field when editing
  let inline = document.getElementById('skillInline');
  if (on && !inline) {
    inline = document.createElement('div');
    inline.id = 'skillInline';
    inline.className = 'edit-inline';
    inline.innerHTML = `
      <input id="newSkill" class="i" type="text" placeholder="Add a skill…">
      <button id="addSkillNow" class="btn small primary">Add</button>
    `;
    ul.after(inline);
    document.getElementById('addSkillNow').addEventListener('click', () => {
      const val = document.getElementById('newSkill').value.trim();
      if (val) addSkill(val);
      document.getElementById('newSkill').value = '';
    });
  }
  if (!on && inline) inline.remove();

  // Toggle chip delete icons
  document.querySelectorAll('.chips li .del').forEach(b => b.classList.toggle('hidden', !on));

  // Toggle button visibility
  editBtn.classList.toggle('hidden', on);
  saveBtn.classList.toggle('hidden', !on);
  cancelBtn.classList.toggle('hidden', !on);
}

// Save and load from localStorage
function saveData() {
  const data = {
    name: nameEl.textContent.trim(),
    course: courseEl.textContent.trim(),
    email: emailEl.textContent.trim(),
    about: aboutEl.textContent.trim(),
    skills: Chips
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (data.name) nameEl.textContent = data.name;
  if (data.course) courseEl.textContent = data.course;
  if (data.email) emailEl.textContent = data.email;
  if (data.about) aboutEl.textContent = data.about;
  if (Array.isArray(data.skills) && data.skills.length) {
    Chips.splice(0, Chips.length, ...data.skills);
  }
  paint();
}

// Handle button actions
editBtn.addEventListener('click', () => setEditable(true));
saveBtn.addEventListener('click', () => {
  setEditable(false);
  saveData();
});
cancelBtn.addEventListener('click', () => {
  setEditable(false);
  loadData();
});

// Remove skill when clicking ✕
ul.addEventListener('click', e => {
  if (e.target.classList.contains('del')) {
    const li = e.target.closest('li');
    const skill = li.dataset.skill;
    const idx = Chips.indexOf(skill);
    if (idx > -1) Chips.splice(idx, 1);
    paint();
  }
});

(() => {
  const STORAGE_KEY = "fuss_profile_v1";
  const AVATAR_KEY  = "fuss_profile_avatar";
  const nameEl = document.getElementById("pName");
  const img    = document.getElementById("pAvatar");
  const fileIn = document.getElementById("avatarInput");
  const change = document.getElementById("changePhoto");
  const remove = document.getElementById("removePhoto");

  // Generate a nice initials avatar as SVG data URL
  function initialsAvatar(name = "User", bg = "#0f1b2a", color = "#F4C542") {
    const initials = (name.trim().match(/\b\w/g) || []).slice(0,2).join("").toUpperCase();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="280" height="280">
        <rect width="100%" height="100%" rx="140" ry="140" fill="${bg}"/>
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
              font-family="system-ui, Segoe UI, Roboto, Arial" font-size="110"
              fill="${color}" font-weight="700">${initials}</text>
      </svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  function loadAvatar() {
    const saved = localStorage.getItem(AVATAR_KEY);
    if (saved) {
      img.src = saved;
    } else {
      // if no uploaded photo yet, show initials from current name (or storage)
      const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const name = (d.name || nameEl?.textContent || "User").trim();
      img.src = initialsAvatar(name);
    }
  }

  function saveAvatar(dataUrl) {
    try {
      localStorage.setItem(AVATAR_KEY, dataUrl);
    } catch (e) {
      // storage full; just keep it in the UI
      console.warn("Could not save avatar:", e);
    }
    img.src = dataUrl;
  }

  // Change photo -> open file picker
  change.addEventListener("click", () => fileIn.click());

  // When file chosen, read and save
  fileIn.addEventListener("change", () => {
    const file = fileIn.files && fileIn.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { // ~2MB soft limit
      alert("Please choose an image under ~2MB.");
      fileIn.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = e => saveAvatar(e.target.result);
    reader.readAsDataURL(file);
    fileIn.value = "";
  });

  // Remove photo -> revert to initials
  remove.addEventListener("click", () => {
    localStorage.removeItem(AVATAR_KEY);
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const name = (d.name || nameEl?.textContent || "User").trim();
    img.src = initialsAvatar(name);
  });


  const nameObserver = new MutationObserver(() => {
    if (!localStorage.getItem(AVATAR_KEY)) {
      const name = (nameEl?.textContent || "User").trim();
      img.src = initialsAvatar(name);
    }
  });
  if (nameEl) nameObserver.observe(nameEl, { childList: true, characterData: true, subtree: true });

  // Init
  loadAvatar();
})();
document.getElementById("logoutBtn").addEventListener("click", () => {
  // Create custom popup
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.6)";
  overlay.style.display = "grid";
  overlay.style.placeItems = "center";
  overlay.style.zIndex = "2000";

  const box = document.createElement("div");
  box.style.background = "#101722";
  box.style.border = "1px solid var(--yellow)";
  box.style.borderRadius = "14px";
  box.style.padding = "24px";
  box.style.textAlign = "center";
  box.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
  box.innerHTML = `
    <h3 style="color:var(--yellow);margin:0 0 12px;">Log out?</h3>
    <p style="color:var(--muted);margin-bottom:20px;">Are you sure you want to log out of your account?</p>
    <div style="display:flex;justify-content:center;gap:10px;">
      <button id="confirmLogout" class="btn primary">Log Out</button>
      <button id="cancelLogout" class="btn secondary">Cancel</button>
    </div>
  `;
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // Button logic
  document.getElementById("cancelLogout").addEventListener("click", () => overlay.remove());
  document.getElementById("confirmLogout").addEventListener("click", () => {
    // Clear saved data (optional)
    localStorage.clear();
    overlay.remove();
    // Redirect to landing or login page
    window.location.href = "index.html"; // change if your login page has another name
  });
});


// Init
loadData();
