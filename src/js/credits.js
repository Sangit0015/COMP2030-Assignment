async function apiGet(path, params){
  const usp = new URLSearchParams(params||{});
  const url = `index.php?action=${encodeURIComponent(path)}&${usp.toString()}`;
  const r = await fetch(url, { credentials:'same-origin' });
  const t = await r.text();
  let d; try{ d = JSON.parse(t);}catch{ throw new Error('Invalid server response'); }
  if(!r.ok || d.error) throw new Error(d.error || `Request failed: ${r.status}`);
  return d;
}

async function loadCredits(){
  const balEl = document.getElementById('creditVal');
  const listEl = document.getElementById('txList');
  try{
    const me = await apiGet('me');
    if (me && me.user && typeof me.user.credits !== 'undefined') {
      balEl.textContent = me.user.credits;
    }
  }catch{}
  try{
    const res = await apiGet('transactions');
    const tx = (res.transactions||[]).slice(0,5);
    if (!tx.length){ listEl.innerHTML = '<p style="opacity:.7;">No recent transactions.</p>'; return; }
    listEl.innerHTML = tx.map(row => txItem(row)).join('');
  }catch(err){
    listEl.textContent = err.message || 'Failed to load transactions';
  }
}

function txItem(t){
  const when = t.date ? new Date(t.date).toLocaleString() : '';
  const sign = (t.type||'').toLowerCase()==='credit' ? '+' : ( (t.type||'').toLowerCase()==='debit' ? '-' : '' );
  const amt = typeof t.credits !== 'undefined' ? `${sign}${t.credits}` : '';
  const desc = t.desc || t.description || '';
  return `
    <div class="tx" style="display:flex;justify-content:space-between;gap:10px;border:1px solid var(--line);border-radius:10px;padding:10px 12px;margin:6px 0;background:#0f151e;">
      <div>
        <div style="font-weight:600;">${escapeHTML(desc)}</div>
        <div style="opacity:.7;font-size:12px;">${escapeHTML(when)}</div>
      </div>
      <div style="font-weight:800;color:var(--yellow);">${escapeHTML(amt)}</div>
    </div>
  `;
}

function escapeHTML(s){ return (s||'').toString().replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

loadCredits();
