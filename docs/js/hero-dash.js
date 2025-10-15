
document.addEventListener("DOMContentLoaded", async () => {
  const currentPage = window.location.pathname.split("/").pop(); 
  document.querySelectorAll(".right-section a").forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      const btn = link.querySelector("button");
      if (btn) btn.classList.add("active");
    }
  });

  const els = {
    name:  document.getElementById("userName"),
    fan:   document.getElementById("studentFan"),
    email: document.getElementById("studentEmail"),
    id:    document.getElementById("studentId"),
    img:   document.getElementById("profilepic"),
    btnEdit: document.getElementById("editProfileBtn"),
    btnOthers: document.getElementById("viewEditOthersBtn"),
    tipAuth: document.getElementById("authOnlyTip"),
  };

  const unskeleton = (el) => { if (!el) return; el.classList.remove("skeleton","skeleton-text"); };

  try {
    const res = await fetch("index.php?action=me", { credentials: 'same-origin' });
    if (!res.ok) throw new Error("User fetch failed: " + res.status);
    const payload = await res.json();
    const user = payload.user || {};

    els.name.textContent  = user.display_name || user.username || "Student";
    els.fan.textContent   = user.username || "—";
    els.email.textContent = user.email || "—";
    els.id.textContent    = user.id || "—";

    if (user.avatarUrl) {
      els.img.src = user.avatarUrl;
      els.img.alt = (user.display_name || user.username || "Student") + " profile picture";
    }
    [els.name, els.fan, els.email, els.id].forEach(unskeleton);

    const role = (user.role || (user.role_id === 1 ? 'admin' : user.role_id === 2 ? 'lecturer' : 'student')).toLowerCase();
    const authorized = role === "admin" || role === "lecturer";

    els.btnOthers.disabled = !authorized;
    els.btnOthers.setAttribute("aria-disabled", String(!authorized));

    els.btnOthers.addEventListener("click", (e) => {
      if (els.btnOthers.disabled) {
        e.preventDefault();
        if (!els.tipAuth) return;
        els.tipAuth.style.opacity = "1";
        els.tipAuth.style.transform = "translateX(-50%) translateY(0)";
        setTimeout(() => {
          els.tipAuth.style.opacity = "0";
          els.tipAuth.style.transform = "translateX(-50%) translateY(4px)";
        }, 1600);
      }
    });

  } catch (err) {
    console.error(err);
    els.name.textContent = "Student";
    [els.name, els.fan, els.email, els.id].forEach(unskeleton);
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("#split-section .slider");
  if (!slider) return;

  const track = slider.querySelector(".slides");
  const slides = Array.from(slider.querySelectorAll(".slide"));
  const prev = slider.querySelector(".prev");
  const next = slider.querySelector(".next");
  const dotsWrap = slider.querySelector(".dots");

  let i = 0;
  const dots = slides.map((_, idx) => {
    const b = document.createElement("button");
    b.addEventListener("click", () => go(idx));
    if (idx === 0) b.classList.add("active");
    dotsWrap.appendChild(b);
    return b;
  });

  function go(n){
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, k) => d.classList.toggle("active", k === i));
  }

  prev.addEventListener("click", () => go(i - 1));
  next.addEventListener("click", () => go(i + 1));
  go(0);
});


const modal = document.getElementById('editProfileModal');
const openBtn = document.getElementById('editProfileBtn');
const closeEls = modal.querySelectorAll('[data-ep-close]');
const avatarInput = document.getElementById('epAvatar');
const avatarPreview = document.getElementById('epPreview');

openBtn.addEventListener('click', () => modal.setAttribute('aria-hidden','false'));
closeEls.forEach(el => el.addEventListener('click', () => modal.setAttribute('aria-hidden','true')));
document.addEventListener('keydown', e => { if(e.key==='Escape') modal.setAttribute('aria-hidden','true') });

avatarInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = () => avatarPreview.src = reader.result;
    reader.readAsDataURL(file);
  }
});

document.getElementById('epForm').addEventListener('submit', e => {
  e.preventDefault();
  // update dashboard fields
  document.getElementById('profilepic').src = avatarPreview.src;
  document.getElementById('userName').textContent = document.getElementById('epDisplayName').value;
  document.getElementById('studentEmail').textContent = document.getElementById('epEmail').value;
  document.getElementById('studentId').textContent = document.getElementById('epStudentId').value;
  document.getElementById('studentFan').textContent = document.getElementById('epFan').value;
  modal.setAttribute('aria-hidden','true');
});