const PASSWORD = 'storyhub2025';

function login() {
  if (document.getElementById('adminPass').value === PASSWORD) {
    document.getElementById('adminPanel').style.display = 'block';
    loadStories();
    loadCategories();
  } else {
    alert('Wrong password!');
  }
}

async function loadStories() {
  const res = await fetch('/data/stories.json');
  const stories = await res.json();
  const list = document.getElementById('storiesList');
  list.innerHTML = '';
  stories.forEach(story => {
    const li = document.createElement('li');
    li.className = 'crud-item';
    li.innerHTML = `${story.title} (${story.category}) [Premium: ${story.premium ? 'Yes' : 'No'}] <button onclick="editStory('${story.id}')">Edit</button> <button onclick="deleteStory('${story.id}')">Delete</button>`;
    list.appendChild(li);
  });
}

async function loadCategories() {
  const res = await fetch('/data/categories.json');
  const cats = await res.json();
  const list = document.getElementById('catsList');
  list.innerHTML = '';
  cats.forEach((cat, idx) => {
    const li = document.createElement('li');
    li.className = 'crud-item';
    li.innerHTML = `${cat} <button onclick="editCategory(${idx}, '${cat}')">Edit</button> <button onclick="deleteCategory(${idx})">Delete</button>`;
    list.appendChild(li);
  });
}

async function bulkUpload() {
  const text = document.getElementById('bulkInput').value;
  const blocks = text.split('===TITLE===').slice(1);
  let newStories = [];

  for (let block of blocks) {
    const parts = block.split('===CATEGORY===');
    const title = parts[0].trim();
    const catContent = parts[1].split('===CONTENT===');
    const category = catContent[0].trim();
    const content = catContent[1]?.trim();

    if (title && category && content) {
      const id = Date.now().toString();
      const url = title.toLowerCase().replace(/[^a-z0-9हिंदी]+/g, '-').replace(/^-|-$/g, '') + '.html';
      newStories.push({ id, title, category, content, url, premium: false });
      
      const html = `<!DOCTYPE html><html lang="hi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="rating" content="adult"><title>${title} - StoryHub</title><link rel="stylesheet" href="/styles.css"></head><body><header class="site-header"><div class="logo"><h1><a href="/">StoryHub</a></h1></div><nav class="main-nav"><ul class="nav-list"><li><a href="/">होम</a></li><li class="dropdown"><a href="#" class="dropbtn">कैटेगरी</a><div class="dropdown-content" id="dropdownCategories"></div></li><li><a href="#" onclick="handlePremiumClick()">प्रीमियम</a></li><li><a href="#" onclick="submitStory()">स्टोरी सबमिट करें</a></li><li><a href="#" onclick="showBestStories()">बेस्ट स्टोरी</a></li><li><a href="#" onclick="showNewArrivals()">नई स्टोरी</a></li><li><a href="#" onclick="showPopular()">पॉपुलर</a></li><li><a href="#" onclick="showWriters()">राइटर्स</a></li><li><a href="#" onclick="showArchive()">आर्काइव (A-Z)</a></li><li><button class="subscribe-btn" onclick="showSubscribe()">सब्सक्राइब</button></li><li><button class="donate-btn" onclick="showDonate()">डोनेट</button></li></ul><div class="hamburger" onclick="toggleMobileMenu()">☰</div></nav></header><main><h1>${title}</h1><article>${content.replace(/\n/g, '<p>')}</article></main><footer>© 2025 StoryHub | Back to home</footer><script src="/app.js"></script></body></html>`;
      downloadFile(url, html);
    }
  }

  if (newStories.length) {
    await updateStoriesJSON(newStories, 'add');
    await updateSitemap();
    alert(`${newStories.length} stories uploaded!`);
    loadStories();
  }
}

async function saveStory() {
  const id = document.getElementById('storyId').value || Date.now().toString();
  const title = document.getElementById('storyTitle').value.trim();
  const category = document.getElementById('storyCat').value.trim();
  const content = document.getElementById('storyContent').value.trim();
  const premium = document.getElementById('storyPremium').checked;
  
  if (title && category && content) {
    const url = title.toLowerCase().replace(/[^a-z0-9हिंदी]+/g, '-').replace(/^-|-$/g, '') + '.html';
    const story = { id, title, category, content, url, premium };
    
    const html = `<!DOCTYPE html><html lang="hi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="rating" content="adult"><title>${title} - StoryHub</title><link rel="stylesheet" href="/styles.css"></head><body><header class="site-header"><div class="logo"><h1><a href="/">StoryHub</a></h1></div><nav class="main-nav"><ul class="nav-list"><li><a href="/">होम</a></li><li class="dropdown"><a href="#" class="dropbtn">कैटेगरी</a><div class="dropdown-content" id="dropdownCategories"></div></li><li><a href="#" onclick="handlePremiumClick()">प्रीमियम</a></li><li><a href="#" onclick="submitStory()">स्टोरी सबमिट करें</a></li><li><a href="#" onclick="showBestStories()">बेस्ट स्टोरी</a></li><li><a href="#" onclick="showNewArrivals()">नई स्टोरी</a></li><li><a href="#" onclick="showPopular()">पॉपुलर</a></li><li><a href="#" onclick="showWriters()">राइटर्स</a></li><li><a href="#" onclick="showArchive()">आर्काइव (A-Z)</a></li><li><button class="subscribe-btn" onclick="showSubscribe()">सब्सक्राइब</button></li><li><button class="donate-btn" onclick="showDonate()">डोनेट</button></li></ul><div class="hamburger" onclick="toggleMobileMenu()">☰</div></nav></header><main><h1>${title}</h1><article>${content.replace(/\n/g, '<p>')}</article></main><footer>© 2025 StoryHub | Back to home</footer><script src="/app.js"></script></body></html>`;
    downloadFile(url, html);
    
    await updateStoriesJSON([story], document.getElementById('storyId').value ? 'edit' : 'add');
    await updateSitemap();
    clearStoryForm();
    loadStories();
    alert('Story saved!');
  }
}

async function editStory(id) {
  const res = await fetch('/data/stories.json');
  const stories = await res.json();
  const story = stories.find(s => s.id === id);
  if (story) {
    document.getElementById('storyId').value = id;
    document.getElementById('storyTitle').value = story.title;
    document.getElementById('storyCat').value = story.category;
    document.getElementById('storyContent').value = story.content;
    document.getElementById('storyPremium').checked = story.premium || false;
  }
}

async function deleteStory(id) {
  if (confirm('Delete?')) {
    await updateStoriesJSON(id, 'delete');
    await updateSitemap();
    loadStories();
  }
}

async function updateStoriesJSON(data, mode) {
  const res = await fetch('/data/stories.json');
  let stories = await res.json();
  
  if (mode === 'add') {
    stories = [...stories, ...data];
  } else if (mode === 'edit') {
    stories = stories.map(s => s.id === data[0].id ? data[0] : s);
  } else if (mode === 'delete') {
    stories = stories.filter(s => s.id !== data);
  }
  
  downloadFile('stories.json', JSON.stringify(stories, null, 2));
}

async function saveCategory() {
  const name = document.getElementById('catName').value.trim();
  if (name) {
    await updateCategoriesJSON({name}, 'add');
    document.getElementById('catName').value = '';
    loadCategories();
  }
}

async function editCategory(idx, oldName) {
  const newName = prompt('New name:', oldName);
  if (newName) {
    await updateCategoriesJSON({idx, name: newName}, 'edit');
    loadCategories();
  }
}

async function deleteCategory(idx) {
  if (confirm('Delete?')) {
    await updateCategoriesJSON(idx, 'delete');
    loadCategories();
  }
}

async function updateCategoriesJSON(data, mode) {
  const res = await fetch('/data/categories.json');
  let cats = await res.json();
  
  if (mode === 'add') {
    cats.push(data.name);
  } else if (mode === 'edit') {
    cats[data.idx] = data.name;
  } else if (mode === 'delete') {
    cats.splice(data, 1);
  }
  
  downloadFile('categories.json', JSON.stringify(cats, null, 2));
}

async function updateSitemap() {
  const res = await fetch('/data/stories.json');
  const stories = await res.json();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://storyhub2.pages.dev/</loc><lastmod>${new Date().toISOString().split('T')[0]}</lastmod><priority>1.0</priority></url>`;
  
  stories.forEach(story => {
    xml += `<url><loc>https://storyhub2.pages.dev/stories/${story.url}</loc><lastmod>${new Date().toISOString().split('T')[0]}</lastmod><priority>0.8</priority></url>`;
  });
  
  xml += `</urlset>`;
  
  downloadFile('sitemap.xml', xml);
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function clearStoryForm() {
  document.getElementById('storyId').value = '';
  document.getElementById('storyTitle').value = '';
  document.getElementById('storyCat').value = '';
  document.getElementById('storyContent').value = '';
  document.getElementById('storyPremium').checked = false;
}
