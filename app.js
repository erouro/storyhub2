let allStories = [];

async function loadData() {
  const storiesRes = await fetch('/data/stories.json');
  allStories = await storiesRes.json();
  
  const catsRes = await fetch('/data/categories.json');
  const categories = await catsRes.json();

  renderStories(allStories);
  renderCategories(categories);
  renderDropdownCategories(categories);
  updateBookmarkUI();
  populateCategoryDropdown(categories); // NEW for submit page
}

// NEW: Populate category dropdown on submit page
function populateCategoryDropdown(categories) {
  const select = document.getElementById('category');
  if (select) {
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      select.insertBefore(option, select.lastChild); // Before 'other'
    });
  }
}

// NEW: Submit form (stub)
function submitForm() {
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const email = document.getElementById('email').value;
  const storyText = document.getElementById('storyText').value;
  if (title && category && email && storyText) {
    alert('Story submitted for review!');
    // Send to backend later
  } else {
    alert('Fill all fields');
  }
}

// ... (rest same as previous app.js)
