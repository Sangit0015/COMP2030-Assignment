const USERS=[
  {name:'Sam Taylor',email:'sam@flinders.edu.au',credits:5},
  {name:'Lara Nguyen',email:'lara@flinders.edu.au',credits:3},
  {name:'Dev Patel',email:'dev@flinders.edu.au',credits:8}
];
const tBody=document.querySelector('#userTable tbody');
function paintUsers()
{
tBody.innerHTML=USERS.map(u=>`<tr><td>${u.name}</td><td>${u.email}</td><td>${u.credits}</td><td><button class='btn' data-act='grant' data-name='${u.name}'>Grant +1</button></td></tr>`).join('');}
paintUsers();
document.getElementById('addUser').addEventListener('click',()=>{const n=prompt('Name?');const e=prompt('Email?');if(!n||!e)return;USERS.push({name:n,email:e,credits:0});paintUsers();});
document.getElementById('export').addEventListener('click',()=>alert('CSV export in future sprint.'));
tBody.addEventListener('click',e=>{const b=e.target.closest('button[data-act=\'grant\']');if(!b)return;const u=USERS.find(x=>x.name===b.dataset.name);u.credits++;paintUsers();});
