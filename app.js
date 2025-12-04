// ──────────────────────────────
// StoryHub Frontend JS – FINAL VERSION
// Stories + Categories + Search + Likes + Bookmarks (localStorage)
// ──────────────────────────────

let allStories = [];

// Load everything
async function loadData() {
  const storiesRes = await fetch('/data/stories.json');
  allStories = await storiesRes.json();
  
  const catsRes = await fetch('/data/categories.json');
  const categories = await catsRes.json();

  renderStories(allStories);
  renderCategories(categories);
  updateBookmarkUI();
}

// Render stories with like/bookmark state
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

// Like system
function toggleLike(id) {
  const current = localStorage.getItem(`like_${id}`) === 'true';
  localStorage.setItem(`like_${id}`, (!current).toString());
  loadData(); // refresh UI
}
function getLikeCount(id) {
  return (localStorage.getItem(`like_${id}`) === 'true') ? 1 : 0;
}

// Bookmark system
function toggleBookmark(id) {
  const current = localStorage.getItem(`bookmark_${id}`) === 'true';
  localStorage.setItem(`bookmark_${id}`, (!current).toString());
  updateBookmarkUI();
  loadData();
}

// Show bookmark counter in header (optional polish)
function updateBookmarkUI() {
  let header = document.querySelector('header h1');
  const count = Object.keys(localStorage).filter(k => k.startsWith('bookmark_') && localStorage.getItem(k) === 'true').length;
  if (count > 0) {
    header.innerHTML = `StoryHub - अंतरवासना प्रो <span style="font-size:0.7em;color:#ffc107">⭐${count}</span>`;
  } else {
    header.textContent = 'StoryHub - अंतरवासना प्रो';
  }
}

// Search + Category filter (now works properly)
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

// Load on start
window.onload = loadData;
