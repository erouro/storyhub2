let allStories = [];

// Device Premium
function getDeviceID() {
  let id = localStorage.getItem('deviceID');
  if (!id) { id = 'D' + Date.now(); localStorage.setItem('deviceID', id); }
  return id;
}
function isPremiumUser() { return localStorage.getItem('premium_' + getDeviceID()) === 'true'; }
function makePremium() { localStorage.setItem('premium_' + getDeviceID(), 'true'); alert('Premium Active Forever!'); location.reload(); }

// Load
document.addEventListener('DOMContentLoaded', () => {
  bindMenuEvents();
  addActionButtons();
  loadData();
});

function addActionButtons() {
  if (document.querySelector('.action-buttons')) return;
  const div = document.createElement('div');
  div.className = 'action-buttons';
  div.innerHTML = `<button onclick="showSubscribe()">Subscribe Premium</button><button onclick="showDonate()">Donate</button>`;
  document.querySelector('main')?.prepend(div);
}

function bindMenuEvents() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-list');
  if (hamburger) hamburger.onclick = () => nav.classList.toggle('active');

  // Click outside close
  document.addEventListener('click', e => {
    if (!e.target.closest('.site-header')) nav?.classList.remove('active');
  });
}

async function loadData() {
  try { allStories = await (await fetch('/data/stories.json')).json(); } catch(e) { allStories = []; }
  try {
    const cats = await (await fetch('/data/categories.json')).json();
    renderCategories(cats);
    renderDropdownCategories(cats);
  } catch(e) {}
  renderStories(allStories);
  updateBookmarkUI();
}

// render functions same as before (no change needed)

function showSubscribe() { document.getElementById('subModal')?.style = 'display:block'; }
function showDonate() { document.getElementById('donateModal')?.style = 'display:block'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
window.onclick = e => { if (e.target.classList.contains('modal')) e.target.style.display = 'none'; };
