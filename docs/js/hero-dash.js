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

  let resolvedRole = "student";

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

    resolvedRole = (user.role || (user.role_id === 1 ? "admin" : user.role_id === 2 ? "lecturer" : "student")).toLowerCase();
  } catch (err) {
    console.warn("Running without backend; using DEV override. Reason:", err?.message || err);
    els.name.textContent = "Student";
    [els.name, els.fan, els.email, els.id].forEach(unskeleton);
  }

  // --- DEV override for testing without backend ---
  const qsRole = new URLSearchParams(location.search).get("role");
  const lsRole = localStorage.getItem("role");
  if (qsRole) resolvedRole = qsRole.toLowerCase();
  else if (lsRole) resolvedRole = lsRole.toLowerCase();
  // -------------------------------------------------

  const authorized = resolvedRole === "admin" || resolvedRole === "lecturer";

  if (authorized) {
    // enable the button and wire navigation
    els.btnOthers.disabled = false;
    els.btnOthers.setAttribute("aria-disabled", "false");
    els.btnOthers.addEventListener("click", () => {
      window.location.href = "http://127.0.0.1:5500/docs/admin.html#"; // your admin page
    });
    if (els.tipAuth) els.tipAuth.remove();
  } else {
    // keep disabled + tooltip
    els.btnOthers.disabled = true;
    els.btnOthers.setAttribute("aria-disabled", "true");
    els.btnOthers.addEventListener("click", (e) => {
      e.preventDefault();
      if (!els.tipAuth) return;
      els.tipAuth.style.opacity = "1";
      els.tipAuth.style.transform = "translateX(-50%) translateY(0)";
      setTimeout(() => {
        els.tipAuth.style.opacity = "0";
        els.tipAuth.style.transform = "translateX(-50%) translateY(4px)";
      }, 1600);
    });
  }
});