document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const regForm = document.getElementById('registerForm');
  const openRegister = document.getElementById('openRegister');
  const registerModal = document.getElementById('registerModal');
  const closeModal = document.getElementById('closeModal');

  const openModal = () => registerModal && registerModal.classList.add('open');
  const closeModalFn = () => registerModal && registerModal.classList.remove('open');

  if (openRegister) openRegister.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  if (closeModal) closeModal.addEventListener('click', (e) => { e.preventDefault(); closeModalFn(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModalFn(); });

  async function api(path, body) {
    const res = await fetch(`index.php?action=${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) throw new Error(data.error || `Request failed: ${res.status}`);
    return data;
  }

  async function apiGet(path, params) {
    const usp = new URLSearchParams(params || {});
    const url = `index.php?action=${encodeURIComponent(path)}&${usp.toString()}`;
    const r = await fetch(url, { credentials: 'same-origin' });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { throw new Error('Invalid server response'); }
    if (!r.ok || data.error) throw new Error(data.error || `Request failed: ${r.status}`);
    return data;
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
      try {
        const resp = await apiGet('login', { username, password });
        if (!resp || (!resp.user && !resp.success)) throw new Error('Login failed');
        // Confirm session is set
        const meR = await fetch('index.php?action=me', { credentials: 'same-origin' });
        const me = await meR.json().catch(() => ({}));
        if (!me || !me.user || !me.user.id) throw new Error('Session not set');
        window.location.href = 'hero_dash.html';
      } catch (err) {
        alert(err.message || 'Login failed');
      }
    });
  }

  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const display_name = document.getElementById('fullName').value.trim();
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      try {
        const resp = await apiGet('register', { username, email, password, display_name });
        if (!resp || (!resp.success && !resp.message)) throw new Error('Registration failed');
        alert(resp.message || 'Registered successfully. You can now log in.');
        closeModalFn();
      } catch (err) {
        alert(err.message || 'Registration failed');
      }
    });
  }
});
