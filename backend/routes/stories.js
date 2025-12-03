const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const FILE = path.join(__dirname, "..", "data", "stories.json");

function load() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// GET stories
router.get("/", (req, res) => {
  let all = load();
  const { category, q } = req.query;

  if (category) {
    const c = category.toLowerCase();
    all = all.filter((s) => s.categories?.map((x) => x.toLowerCase()).includes(c));
  }

  if (q) {
    const search = q.toLowerCase();
    all = all.filter(
      (s) =>
        s.title.toLowerCase().includes(search) ||
        s.content.toLowerCase().includes(search)
    );
  }

  res.json(all);
});

// GET single story
router.get("/:id", (req, res) => {
  const all = load();
  const story = all.find((s) => s.id === req.params.id);
  if (!story) return res.status(404).json({ error: "Story not found" });
  res.json(story);
});

// CREATE story
router.post("/", (req, res) => {
  const { title, excerpt, content, thumbnail_url, categories, is_premium } = req.body;

  if (!title?.trim()) return res.status(400).json({ error: "Title required" });

  const newStory = {
    id: uuidv4(),
    title,
    excerpt: excerpt || "",
    content: content || "",
    thumbnail_url: thumbnail_url || "",
    categories: categories || [],
    is_premium: !!is_premium,
    created_at: new Date().toISOString(),
  };

  const all = load();
  all.unshift(newStory);
  save(all);

  res.json(newStory);
});

// UPDATE story
router.put("/:id", (req, res) => {
  const all = load();
  const idx = all.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  const s = all[idx];
  const { title, excerpt, content, thumbnail_url, categories, is_premium } = req.body;

  if (title !== undefined) s.title = title;
  if (excerpt !== undefined) s.excerpt = excerpt;
  if (content !== undefined) s.content = content;
  if (thumbnail_url !== undefined) s.thumbnail_url = thumbnail_url;
  if (categories !== undefined) s.categories = categories;
  if (is_premium !== undefined) s.is_premium = !!is_premium;

  s.updated_at = new Date().toISOString();
  save(all);

  res.json(s);
});

// DELETE
router.delete("/:id", (req, res) => {
  let all = load();
  const before = all.length;
  all = all.filter((s) => s.id !== req.params.id);
  save(all);

  res.json({ deleted: before - all.length });
});

module.exports = router;
