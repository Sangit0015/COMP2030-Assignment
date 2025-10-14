const MESSAGES=[
  {from:'Sam Taylor',date:'2025-10-09',body:'Hey Hansith, can you check my CSS layout?'},
  {from:'Lara Nguyen',date:'2025-10-08',body:'Thanks for your help on JS loops!'},
  {from:'Admin',date:'2025-10-07',body:'Reminder: Submit your weekly contribution form.'}
];
const listEl=document.getElementById('messages');
const searchEl=document.getElementById('msgSearch');
function paintMsg(list){listEl.innerHTML=list.map(m=>`<article class='msg'><div class='msg-head'><span class='msg-from'>${m.from}</span><span class='msg-date'>${m.date}</span></div><div>${m.body}</div></article>`).join('');}
searchEl.addEventListener('input',()=>{const q=searchEl.value.toLowerCase();paintMsg(MESSAGES.filter(m=>m.from.toLowerCase().includes(q)||m.body.toLowerCase().includes(q)));});
paintMsg(MESSAGES);

