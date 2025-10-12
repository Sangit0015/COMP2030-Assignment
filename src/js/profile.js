const Chips=['Python','HTML/CSS','Poster Design'];
const ul=document.getElementById('pSkills');
function paint(){ul.innerHTML=Chips.map(c=>`<li>${c}</li>`).join('');}
paint();
document.getElementById('addSkill').addEventListener('click',()=>{const s=prompt('New skill?');if(!s)return;Chips.push(s);paint();});
document.getElementById('edit').addEventListener('click',()=>{const n=prompt('Update name',document.getElementById('pName').textContent);if(n)document.getElementById('pName').textContent=n;});