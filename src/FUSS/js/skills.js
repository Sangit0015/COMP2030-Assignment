const SKILLS = [
  { id: 1, title: 'Python Tutoring', desc: 'Learn loops, functions, and file handling for assignments.', cat: 'tech', credits: 3 },
  { id: 2, title: 'Essay Proofreading', desc: 'Check grammar, structure, and referencing for academic writing.', cat: 'study', credits: 2 },
  { id: 3, title: 'Canva Poster Design', desc: 'Create modern event posters and social media visuals.', cat: 'creative', credits: 2 },
  { id: 4, title: 'Meal Prep Help', desc: 'Plan cheap and healthy weekly student meals.', cat: 'life', credits: 1 },
  { id: 5, title: 'HTML/CSS Help', desc: 'Fix layout or form bugs in your web projects.', cat: 'tech', credits: 3 },
  { id: 6, title: 'Excel Data Analysis', desc: 'Learn charts, regression tools, and formulas for BUSN2031.', cat: 'study', credits: 2 },
  { id: 7, title: 'Presentation Coaching', desc: 'Practice presentation flow, timing, and confidence building.', cat: 'study', credits: 1 },
  { id: 8, title: 'Photography Basics', desc: 'Learn manual camera controls and composition techniques.', cat: 'creative', credits: 2 },
  { id: 9, title: 'Resume & Cover Letter Review', desc: 'Improve layout and language for job applications.', cat: 'life', credits: 2 },
  { id: 10, title: 'Java Debugging', desc: 'Find and fix logic or syntax errors in beginner Java code.', cat: 'tech', credits: 3 }
];

const gridEl = document.getElementById('skillsGrid');
const qEl = document.getElementById('skillSearch');
const catEl = document.getElementById('skillCat');
const postBtn = document.getElementById('postSkill');

function paint(list) {
  gridEl.innerHTML = list.map(s => `
    <article class="card">
      <span class="badge">${s.cat}</span>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      <div class="meta">
        <span class="credits">${s.credits} credits</span>
        <button class="btn" data-id="${s.id}">Request</button>
      </div>
    </article>
  `).join('');
}

function apply() {
  const q = (qEl.value || '').toLowerCase();
  const c = catEl.value;
  const out = SKILLS.filter(s =>
    (c === 'all' || s.cat === c) &&
    (s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q))
  );
  paint(out);
}

qEl.addEventListener('input', apply);
catEl.addEventListener('change', apply);
postBtn.addEventListener('click', () => alert('Post Skill form coming soon.'));
gridEl.addEventListener('click', e => {
  const b = e.target.closest('button[data-id]');
  if (!b) return;
  const s = SKILLS.find(x => x.id == b.dataset.id);
  alert(`Requested: ${s.title}`);
});

paint(SKILLS);
