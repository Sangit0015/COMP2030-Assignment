document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('faq-q')) return;
  const ans = e.target.nextElementSibling;
  if (!ans) return;
  ans.classList.toggle('open');
});
