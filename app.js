let allStories = [];

// Load everything
async function loadData() {
  const storiesRes = await fetch('/data/stories.json');
  allStories = await storiesRes.json();
  
  const catsRes = await fetch('/data/categories.json');
  const categories = await catsRes.json();

  renderStories(allStories);
  renderCategories(categories);
  renderDropdownCategories(categories);
  updateBookmarkUI();
}

function renderDropdownCategories(categories) {
  const dropdown = document.getElementById('dropdownCategories');
  dropdown.innerHTML = '';
  categories.forEach(cat => {
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = cat;
    a.onclick = () => filterByCategory(cat);
    dropdown.appendChild(a);
  });
}

function renderStories(stories) {
  const grid = document.getElementById('storiesGrid');
  grid.innerHTML = '';
  stories.forEach(story => {
    const isLiked = localStorage.getItem(`like_${story.id}`) === 'true';
    const isBookmarked = localStorage.getItem(`bookmark_${story.id}`) === 'true';

    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
      <h3>${story.title}</h3>
      <p>${story.content.substring(0, 200)}...</p>
      <a href="/stories/${story.url}" class="read-btn">पढ़ें पूरी</a>
      <div style="text-align:center;padding:0.5rem;">
        <button class="btn-like ${isLiked ? 'liked' : ''}" onclick="toggleLike('${story.id}')">
          ${isLiked ? '❤️' : '♡'} <span>${getLikeCount(story.id)}</span>
        </button>
        <button class="btn-bookmark ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark('${story.id}')">
          ${isBookmarked ? '⭐' : '☆'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderCategories(categories) {
  const grid = document.getElementById('categoriesGrid');
  grid.innerHTML = '';
  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
      <h3>${cat}</h3>
      <p>इस कैटेगरी में 10+ कहानियाँ</p>
      <a href="#" class="read-btn" onclick="filterByCategory('${cat}')">देखें</a>
    `;
    grid.appendChild(card);
  });
}

document.getElementById('searchInput').addEventListener('input', e => {
  const query = e.target.value.toLowerCase().trim();
  const filtered = query ? allStories.filter(s => s.title.toLowerCase().includes(query)) : allStories;
  renderStories(filtered);
});

function filterByCategory(cat) {
  const filtered = allStories.filter(s => s.category === cat);
  renderStories(filtered);
  document.getElementById('searchInput').value = cat;
}

function toggleLike(id) {
  const current = localStorage.getItem(`like_${id}`) === 'true';
  localStorage.setItem(`like_${id}`, (!current).toString());
  loadData();
}
function getLikeCount(id) {
  return (localStorage.getItem(`like_${id}`) === 'true') ? 1 : 0;
}

function toggleBookmark(id) {
  const current = localStorage.getItem(`bookmark_${id}`) === 'true';
  localStorage.setItem(`bookmark_${id}`, (!current).toString());
  updateBookmarkUI();
  loadData();
}

function updateBookmarkUI() {
  let header = document.querySelector('.logo h1 a');
  const count = Object.keys(localStorage).filter(k => k.startsWith('bookmark_') && localStorage.getItem(k) === 'true').length;
  if (count > 0) {
    header.innerHTML = `StoryHub <span style="font-size:0.7em;color:#ffc107">⭐${count}</span>`;
  } else {
    header.textContent = 'StoryHub';
  }
}

function toggleMobileMenu() {
  document.querySelector('.nav-list').classList.toggle('active');
}
document.querySelectorAll('.dropbtn').forEach(btn => {
  btn.addEventListener('click', e => { e.preventDefault(); btn.parentElement.classList.toggle('active'); });
});

// NEW: Modals JS
function showSubscribe() { document.getElementById('subModal').style.display = 'block'; }
function showDonate() { document.getElementById('donateModal').style.display = 'block'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function subscribeNow() { alert('Redirecting to payment...'); localStorage.setItem('subscribed', 'true'); loadData(); } // Fake sub for testing; add real payment
window.onclick = e => { if (e.target.classList.contains('modal')) closeModal(e.target.id); };

// Load
window.onload = loadData;
