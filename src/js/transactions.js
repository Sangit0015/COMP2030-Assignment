const ROWS=[
  {date:'2025-10-05',type:'earn',desc:'Tutored HTML basics',credits:+2},
  {date:'2025-10-06',type:'redeem',desc:'Asked for stats help',credits:-1},
  {date:'2025-10-08',type:'earn',desc:'Designed club poster',credits:+2},
  {date:'2025-10-09',type:'earn',desc:'Proofread essay',credits:+1}
];
const bodyEl=document.querySelector('#txTable tbody');
const tSel=document.getElementById('txType');
const fEl=document.getElementById('from');
const tEl=document.getElementById('to');
function paintTx(list){bodyEl.innerHTML=list.map(r=>`<tr><td>${r.date}</td><td>${r.type}</td><td>${r.desc}</td><td>${r.credits>0? '+'+r.credits:r.credits}</td></tr>`).join('');}
function run(){
  const type=tSel.value;const from=fEl.value?new Date(fEl.value):null;const to=tEl.value?new Date(tEl.value):null;
  const out=ROWS.filter(r=>{const d=new Date(r.date);return (type==='all'||r.type===type)&&(!from||d>=from)&&(!to||d<=to)});
  paintTx(out);
}
document.getElementById('apply').addEventListener('click',run);paintTx(ROWS);

