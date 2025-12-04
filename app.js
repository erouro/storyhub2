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
    const isPremium = story.premium || false;
    const isSubscribed = localStorage.getItem('subscribed') === 'true';

    const card = document.createElement('div');
    card.className = 'story-card';
    let contentHtml = '';
    if (isPremium && !isSubscribed) {
      contentHtml = `
        <div class="premium-lock">🔒 प्रीमियम</div>
        <p class="teaser-blur">${story.content.substring(0, 100)}... [लॉक - सब्सक्राइब करें]</p>
        <button class="read-btn" onclick="showSubscribe()">अनलॉक करें</button>
      `;
    } else {
      contentHtml = `
        <p>${story.content.substring(0, 200)}...</p>
        <a href="/stories/${story.url}" class="read-btn">पढ़ें पूरी</a>
      `;
    }
    card.innerHTML = `
      <h3>${story.title}</h3>
      ${contentHtml}
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

function showSubscribe() { document.getElementById('subModal').style.display = 'block'; }
function showDonate() { document.getElementById('donateModal').style.display = 'block'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
window.onclick = e => { if (e.target.classList.contains('modal')) closeModal(e.target.id); };

// NEW: Premium click
function handlePremiumClick() {
  if (localStorage.getItem('subscribed') === 'true') {
    document.getElementById('loginModal').style.display = 'block';
  } else {
    showSubscribe();
  }
}

// NEW: Subscribe plans
function subscribePlan(plan) {
  let price = { '1month': 199, '3months': 299, '6months': 499, '1year': 599 }[plan];
  alert(`Redirecting to pay ₹${price} for ${plan}...`);
  localStorage.setItem('subscribed', 'true');
  loadData();
  closeModal('subModal');
}

// NEW: Login (fake for now)
function loginUser() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (user && pass) {
    alert('Logged in as ' + user);
    closeModal('loginModal');
  } else {
    alert('Enter credentials');
  }
}

// Load
window.onload = loadData;
