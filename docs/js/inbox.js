let MESSAGES=[];
const listEl=document.getElementById('messages');
const searchEl=document.getElementById('msgSearch');

function paintMsg(list){
  listEl.innerHTML=list.map(m=>`<article class='msg'>
    <div class='msg-head'>
      <span class='msg-from'>${m.from}</span>
      <span class='msg-date'>${m.date}</span>
    </div>
    <div>${m.body}</div>
  </article>`).join('');
}

function apply(){
  const q=(searchEl.value||'').toLowerCase();
  const out=MESSAGES.filter(m=>m.from.toLowerCase().includes(q)||m.body.toLowerCase().includes(q));
  paintMsg(out);
}

async function loadMessages(){
  try{
    const res=await fetch('index.php?action=messages',{credentials:'same-origin'});
    const data=await res.json();
    const raw=(data.messages||[]);
    MESSAGES=raw.map(m=>({
      from: m.sender || 'Unknown',
      date: (m.created_at||'').slice(0,10),
      body: m.body || ''
    }));
    apply();
  }catch(e){
    MESSAGES=[]; paintMsg(MESSAGES);
  }
}

searchEl.addEventListener('input',apply);
loadMessages();

