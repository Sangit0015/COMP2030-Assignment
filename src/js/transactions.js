let ROWS=[];
const bodyEl=document.querySelector('#txTable tbody');
const tSel=document.getElementById('txType');
const fEl=document.getElementById('from');
const tEl=document.getElementById('to');

function paintTx(list){
  bodyEl.innerHTML=list.map(r=>`<tr>
    <td>${r.date}</td>
    <td>${r.type}</td>
    <td>${r.desc}</td>
    <td>${r.credits>0? '+'+r.credits:r.credits}</td>
  </tr>`).join('');
}

function run(){
  const type=tSel.value;
  const from=fEl.value?new Date(fEl.value):null;
  const to=tEl.value?new Date(tEl.value):null;
  const out=ROWS.filter(r=>{
    const d=new Date(r.date);
    return (type==='all'||r.type===type)&&(!from||d>=from)&&(!to||d<=to)
  });
  paintTx(out);
}

async function loadTx(){
  try{
    const res=await fetch('index.php?action=transactions',{credentials:'same-origin'});
    const data=await res.json();
    ROWS=(data.transactions||[]).map(x=>({
      date: (x.date||'').slice(0,10),
      type: x.type||'earn',
      desc: x.desc||x.description||'',
      credits: Number(x.credits)||0
    }));
  }catch(e){
    ROWS=[];
  }
  run();
}

document.getElementById('apply').addEventListener('click',run);
loadTx();

