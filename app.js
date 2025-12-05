let allStories = [];

// Device Premium Forever
function getDeviceID() {
  let id = localStorage.getItem('deviceID');
  if (!id) { id = 'DEV_' + Date.now(); localStorage.setItem('deviceID', id); }
  return id;
}
function isPremium() { return localStorage.getItem('premium_' + getDeviceID()) === 'true'; }
function makePremium() { localStorage.setItem('premium_' + getDeviceID(), 'true'); alert('Lifetime Premium Active!'); location.reload(); }

// Sidebar Toggle
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
  document.getElementById('sidebarOverlay').classList.toggle('active');
}
document.querySelector('.close-sidebar')?.addEventListener('click', toggleSidebar);
document.getElementById('sidebarOverlay')?.addEventListener('click', toggleSidebar);

// Bottom Sheet Submit Form
function openSubmitForm() {
  const sheet = document.querySelector('.submit-sheet');
  if (sheet) sheet.classList.add('active');
}

// Load Stories with 10% Premium Preview
async function loadData() {
  allStories = await (await fetch('/data/stories.json')).json();
  const cats = await (await fetch('/data/categories.json')).json();
  renderSidebarCategories(cats);
  renderStories(allStories);
}

function renderStories(stories) {
  const grid = document.getElementById('storiesGrid');
  grid.innerHTML = '';
  stories.forEach(s => {
    const card = document.createElement('div');
    card.className = 'story-card';
    const preview = isPremium() || !s.premium ? s.content : s.content.slice(0, Math.floor(s.content.length * 0.1)) + '...';
    card.innerHTML = `
      <h3>${s.title}</h3>
      <div style="position:relative;">
        <p ${!isPremium() && s.premium ? 'class="premium-blur"' : ''}>${preview}</p>
        ${!isPremium() && s.premium ? '<div class="premium-overlay">Subscribe for Full Story</div>' : ''}
      </div>
      <a href="/stories/${s.url}" class="read-btn">${isPremium() || !s.premium ? 'पढ़ें' : 'अनलॉक करें'}</a>
    `;
    grid.appendChild(card);
  });
}

// Categories in Sidebar
function renderSidebarCategories(cats) {
  const el = document.getElementById('sidebarCategories');
  el.innerHTML = cats.map(c => `<a href="#" onclick="filterByCategory('${c}');toggleSidebar();return false;">${c}</a>`).join('');
}

window.onload = loadData;
