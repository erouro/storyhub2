// ──────────────────────────────
// StoryHub Admin JS
// Bulk upload, CRUD stories/cats, auto URL + sitemap
// Uses JSON files + generates story HTML
// ──────────────────────────────
const PASSWORD = 'storyhub2025'; // Change if needed

function login() {
  if (document.getElementById('adminPass').value === PASSWORD) {
    document.getElementById('adminPanel').style.display = 'block';
    loadStories();
    loadCategories();
  } else {
    alert('Wrong password!');
  }
}

// Load stories from JSON
async function loadStories() {
  const res = await fetch('/data/stories.json');
  const stories = await res.json();
  const list = document.getElementById('storiesList');
  list.innerHTML = '';
  stories.forEach(story => {
    const li = document.createElement('li');
    li.className = 'crud-item';
    li.innerHTML = `${story.title} (${story.category}) <button onclick="editStory('${story.id}')">Edit</button> <button onclick="deleteStory('${story.id}')">Delete</button>`;
    list.appendChild(li);
  });
}

// Load categories
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

// Bulk upload: Parse textarea → generate URLs + HTML + update JSON/sitemap
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
      const id = Date.now().toString(); // Simple unique ID
      const url = title.toLowerCase().replace(/[^a-z0-9हिंदी]+/g, '-').replace(/^-|-$/g, '') + '.html'; // Auto URL with Hindi support
      newStories.push({ id, title, category, content, url });
      
      // Generate story HTML (but since no server, alert to download + manual upload to /stories)
      const html = `<!DOCTYPE html><html lang="hi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="rating" content="adult"><title>${title} - StoryHub</title><link rel="stylesheet" href="/styles.css"></head><body><header><h1>${title}</h1></header><main><article>${content.replace(/\n/g, '<p>')}</article></main><footer><a href="/">Back to Home</a></footer></body></html>`;
      downloadFile(url, html);
    }
  }

  if (newStories.length) {
    await updateStoriesJSON(newStories, 'add');
    await updateSitemap();
    alert(`${newStories.length} stories uploaded! Download HTMLs & push to /stories folder.`);
    loadStories();
  }
}

// Save single story (add/edit)
async function saveStory() {
  const id = document.getElementById('storyId').value || Date.now().toString();
  const title = document.getElementById('storyTitle').value.trim();
  const category = document.getElementById('storyCat').value.trim();
  const content = document.getElementById('storyContent').value.trim();
  
  if (title && category && content) {
    const url = title.toLowerCase().replace(/[^a-z0-9हिंदी]+/g, '-').replace(/^-|-$/g, '') + '.html';
    const story = { id, title, category, content, url };
    
    const html = `<!DOCTYPE html><html lang="hi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="rating" content="adult"><title>${title} - StoryHub</title><link rel="stylesheet" href="/styles.css"></head><body><header><h1>${title}</h1></header><main><article>${content.replace(/\n/g, '<p>')}</article></main><footer><a href="/">Back to Home</a></footer></body></html>`;
    downloadFile(url, html);
    
    await updateStoriesJSON([story], document.getElementById('storyId').value ? 'edit' : 'add');
    await updateSitemap();
    clearStoryForm();
    loadStories();
    alert('Story saved! Push HTML to /stories.');
  }
}

// Edit story
async function editStory(id) {
  const res = await fetch('/data/stories.json');
  const stories = await res.json();
  const story = stories.find(s => s.id === id);
  if (story) {
    document.getElementById('storyId').value = id;
    document.getElementById('storyTitle').value = story.title;
    document.getElementById('storyCat').value = story.category;
    document.getElementById('storyContent').value = story.content;
  }
}

// Delete story
async function deleteStory(id) {
  if (confirm('Delete?')) {
    await updateStoriesJSON(id, 'delete');
    await updateSitemap();
    loadStories();
  }
}

// Update stories.json (add/edit/delete)
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
  
  // Since no server, download updated JSON + manual replace
  downloadFile('stories.json', JSON.stringify(stories, null, 2));
}

// Similar for categories
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

// Auto sitemap update
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

// Download helper (since no server write)
function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Clear form
function clearStoryForm() {
  document.getElementById('storyId').value = '';
  document.getElementById('storyTitle').value = '';
  document.getElementById('storyCat').value = '';
  document.getElementById('storyContent').value = '';
}
