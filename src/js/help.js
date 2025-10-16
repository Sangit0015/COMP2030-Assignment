const form = document.getElementById('helpForm');
const sent = document.getElementById('sent');

if (form && sent) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sent.classList.remove('hidden');
    form.reset();
    setTimeout(() => sent.classList.add('hidden'), 3000);
  });
}
