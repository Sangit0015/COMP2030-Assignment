const el=document.getElementById('creditVal');
document.getElementById('earnOne').addEventListener('click',()=>{el.textContent=+el.textContent+1});
document.getElementById('redeemOne').addEventListener('click',()=>{const v=+el.textContent; if(v>0) el.textContent=v-1; else alert('No credits to redeem');});
