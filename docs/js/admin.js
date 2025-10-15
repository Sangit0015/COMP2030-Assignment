const USERS=[
  {name:'Sam Taylor',email:'sam@flinders.edu.au',credits:5},
  {name:'Lara Nguyen',email:'lara@flinders.edu.au',credits:3},
  {name:'Dev Patel',email:'dev@flinders.edu.au',credits:8}
];
const tBody=document.querySelector('#userTable tbody');
function paintUsers()
{
tBody.innerHTML=USERS.map(u=><tr><td>${u.name}</td><td>${u.email}</td><td>${u.credits}</td><td><button class='btn' data-act='grant' data-name='${u.name}'>Grant +1</button></td></tr>).join('');}
paintUsers();
document.getElementById('addUser').addEventListener('click',()=>{const n=prompt('Name?');const e=prompt('Email?');if(!n||!e)return;USERS.push({name:n,email:e,credits:0});paintUsers();});
document.getElementById('export').addEventListener('click',()=>alert('CSV export in future sprint.'));
tBody.addEventListener('click',e=>{const b=e.target.closest('button[data-act=\'grant\']');if(!b)return;const u=USERS.find(x=>x.name===b.dataset.name);u.credits++;paintUsers();});


async function fetchMostViewed() {
  return [
    { name: "John Doe",  fan: "ab1234", email: "john@example.com" },
    { name: "Jane Smith", fan: "cd5678", email: "jane@example.com" },
    { name: "Mila Grant", fan: "ef9012", email: "mila@example.com" },
    { name: "Alex Kim",   fan: "gh3456", email: "alex@example.com" },
    { name: "Sam Lee",    fan: "ij7890", email: "sam@example.com" },
    { name: "Nora White", fan: "kl1122", email: "nora@example.com" }
  ];
}
async function fetchHistory() {
  return [
    { name: "Alice Brown", fan: "xy1111", email: "alice@example.com" },
    { name: "Chris Young", fan: "mn3344", email: "chris@example.com" },
    { name: "Ravi Singh",  fan: "op5566", email: "ravi@example.com" },
    { name: "Tina Xu",     fan: "qr7788", email: "tina@example.com" }
  ];
}


async function fetchStudentByFAN(fan) {
  const key = (fan || "").trim().toLowerCase();
  if (!key) return null;

  const all = [
    ...(await fetchMostViewed()),
    ...(await fetchHistory())
  ];

  const hit = all.find(s => (s.fan || "").toLowerCase() === key);
  if (!hit) return null;

  return {
    id: hit.id || "S-0000",
    fan: hit.fan || "",
    fullName: hit.fullName || hit.name || "",
    displayName: hit.displayName || (hit.name ? hit.name.split(" ")[0] : ""),
    email: hit.email || "",
    address: hit.address || "",
    phone: hit.phone || "",
    avatar: hit.avatar || "icons/user-profile.png",
    suspended: !!hit.suspended
  };
}


function renderCards(containerId, students) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  grid.innerHTML = students.map((s) => {
    const payload = {
      id: s.id || "S-0000",
      fan: s.fan || "",
      fullName: s.fullName || s.name || "",
      displayName: s.displayName || (s.name ? s.name.split(" ")[0] : ""),
      email: s.email || "",
      address: s.address || "",
      phone: s.phone || "",
      avatar: s.avatar || "icons/user-profile.png",
      suspended: !!s.suspended
    };
    return `
      <div class="student-card" data-student='${JSON.stringify(payload)}'>
        <h3>${payload.fullName || "Unknown"}</h3>
        <p>FAN: ${payload.fan}</p>
        <p>${payload.email}</p>
      </div>
    `;
  }).join("");
}


(async () => {
  renderCards("mostViewed", await fetchMostViewed());
  renderCards("history", await fetchHistory());
})();


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
function openEPModal(student) {
  if (!epModal) return;

  currentStudent = structuredClone(student);

  epFullName.value    = student.fullName || "";
  epDisplayName.value = student.displayName || "";
  epEmail.value       = student.email || "";
  epStudentId.value   = student.id || "";
  epFan.value         = student.fan || "";
  epAddress.value     = student.address || "";
  epPhone.value       = student.phone || "";

  epPreview.src = student.avatar || "icons/user-profile.png";

  setEditing(false);
  updateSuspendUI(!!student.suspended);

  epModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeEPModal() {
  if (!epModal) return;
  epModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (epAvatar) epAvatar.value = "";
  setEditing(false);
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
  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!isEditing) {
      setEditing(true);
    } else {
      const updated = {
        fullName: epFullName.value.trim(),
        displayName: epDisplayName.value.trim(),
        email: epEmail.value.trim(),
        id: epStudentId.value.trim(),
        fan: epFan.value.trim(),
        address: epAddress.value.trim(),
        phone: epPhone.value.trim(),
        avatar: epPreview.src,
        suspended: suspendBtn ? suspendBtn.classList.contains("suspended") : false
      };

      // PUT to backend
      
      currentStudent = updated;
      setEditing(false);
      alert("Student info updated!");
    }
  });
}

if (suspendBtn) {
  suspendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const next = !suspendBtn.classList.contains("suspended");
    updateSuspendUI(next);

    // POST to backend 
    alert(next ? "Student has been suspended." : "Student has been unsuspended.");
  });
}


epCloseEls.forEach(el => {
  el.addEventListener("click", closeEPModal);
})

if (epForm) {
  epForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!isEditing) return;
    const updated = {
      fullName: epFullName.value.trim(),
      displayName: epDisplayName.value.trim(),
      email: epEmail.value.trim(),
      id: epStudentId.value.trim(),
      fan: epFan.value.trim(),
      address: epAddress.value.trim(),
      phone: epPhone.value.trim(),
      avatar: epPreview.src,
      suspended: suspendBtn ? suspendBtn.classList.contains("suspended") : false
    };
    //  PUT to backend here if needed
    currentStudent = updated;
    setEditing(false);
    alert("Student info saved!");
  });
}


document.addEventListener("click", (e) => {
  const card = e.target.closest(".student-card");
  if (!card) return;
  try {
    const student = JSON.parse(card.dataset.student);
    openEPModal(student);
  } catch (err) {
    console.error("Failed to parse student data", err);
  }
});


const searchBtn = document.querySelector(".search-btn");
if (searchBtn) {
  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const input = document.getElementById("fanSearch");
    if (!input) return console.warn('Missing <input id="fanSearch">');

    const fan = input.value.trim();
    if (!fan) return;

    const student = await fetchStudentByFAN(fan);
    const res = document.getElementById("searchResult");

    if (!student) {
      if (res) res.innerHTML = "<p style='color:white'>No student found</p>";
      return;
    }

    openEPModal(student);

    const historyGrid = document.getElementById("history");
    if (historyGrid) {
      const currentCards = Array.from(historyGrid.querySelectorAll(".student-card"))
        .map(card => JSON.parse(card.dataset.student));
      const alreadyInHistory = currentCards.some(s => (s.fan || "") === student.fan);
      if (!alreadyInHistory) {
        renderCards("history", [student, ...currentCards]);
      }
    }
  });

  const fanInput = document.getElementById("fanSearch");
  if (fanInput) {
    fanInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchBtn.click();
      }
    });
  }
}

window.openStudentModal = openEPModal;