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
  const navList = document.querySelector('.nav-list');
  
  if (hamburger && navList) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      navList.classList.toggle('active');
    });
  }

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-header')) {
      navList?.classList.remove('active');
    }
  });

  // Dropdown mobile
  document.querySelectorAll('.dropbtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.parentElement.classList.toggle('active');
    });
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

function renderDropdownCategories(cats) {
  const el = document.getElementById('dropdownCategories');
  if (!el) return;
  el.innerHTML = '';
  cats.forEach(c => {
    const a = document.createElement('a');
    a.href = '#'; a.textContent = c;
    a.onclick = () => { filterByCategory(c); return false; };
    el.appendChild(a);
  });
}

function renderCategories(cats) {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  cats.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `<h3>${cat}</h3><p>20+ गरम कहानियाँ</p><a href="#" class="read-btn" onclick="filterByCategory('${cat}');return false;">देखें</a>`;
    grid.appendChild(card);
  });
}

function renderStories(stories) {
  const grid = document.getElementById('storiesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  stories.forEach(s => {
    const premium = s.premium && !isPremiumUser();
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
      <h3>${s.title}</h3>
      ${premium ? '<div class="premium-lock">Premium</div>' : ''}
      <p ${premium ? 'class="teaser-blur"' : ''}>${premium ? s.content.substring(0,100)+'...' : s.content.substring(0,220)+'...'}</p>
      ${premium 
        ? '<button class="read-btn" onclick="showSubscribe()">अनलॉक करें</button>'
        : `<a href="/stories/${s.url}" class="read-btn">पढ़ें पूरी</a>`
      }
      <div style="text-align:center;padding:0.5rem;">
        <button class="btn-like" onclick="toggleLike('${s.id}')">Like</button>
        <button class="btn-bookmark" onclick="toggleBookmark('${s.id}')">Bookmark</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterByCategory(cat) {
  const filtered = allStories.filter(s => s.category === cat);
  renderStories(filtered);
  document.getElementById('searchInput')?.value = cat;
}

function toggleLike(id) { localStorage.setItem('like_'+id, localStorage.getItem('like_'+id)==='true' ? 'false' : 'true'); loadData(); }
function toggleBookmark(id) { localStorage.setItem('bookmark_'+id, localStorage.getItem('bookmark_'+id)==='true' ? 'false' : 'true'); updateBookmarkUI(); loadData(); }
function updateBookmarkUI() {
  const count = Object.keys(localStorage).filter(k => k.startsWith('bookmark_') && localStorage.getItem(k)==='true').length;
  const header = document.querySelector('.logo h1 a');
  if (header && count>0) header.innerHTML = `StoryHub <small style="color:#ffd700;font-size:1rem;">Bookmarked ${count}</small>`;
}

function showSubscribe() { document.getElementById('subModal')?.style.display='block'; }
function showDonate() { document.getElementById('donateModal')?.style.display='block'; }
function closeModal(id) { document.getElementById(id)?.style.display='none'; }
window.onclick = e => { if (e.target.classList.contains('modal')) e.target.style.display='none'; };

function handlePremiumClick() {
  isPremiumUser() ? alert('You are Premium!') : showSubscribe();
}

function subscribePlan(p) {
  const prices = {1:199,3:299,6:499,12:599};
  alert(`₹${prices[p]} payment successful!`);
  makePremium();
  closeModal('subModal');
}

function donateAmount(a) { alert(`Thank you for ₹${a}!`); closeModal('donateModal'); }
function donateCustom() {
  const amt = document.getElementById('customAmount')?.value;
  if (amt>0) { alert(`Thank you for ₹${amt}!`); closeModal('donateModal'); }
}
