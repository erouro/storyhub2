const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// Path to categories.json file
const FILE = path.join(__dirname, "..", "data", "categories.json");

// Helper functions
function load() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/*
|--------------------------------------------------------------------------
| GET ALL CATEGORIES
|--------------------------------------------------------------------------
| GET /api/categories
*/
router.get("/", (req, res) => {
  const all = load();
  res.json(all);
});

/*
|--------------------------------------------------------------------------
| CREATE CATEGORY
|--------------------------------------------------------------------------
| POST /api/categories
| Body: { name: "Category Name" }
*/
router.post("/", (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Category name required" });
  }

  const all = load();

  // prevent duplicates
  const exists = all.find(
    (c) => c.name.toLowerCase() === name.trim().toLowerCase()
  );
  if (exists) {
    return res.status(400).json({ error: "Category already exists" });
  }

  const newCategory = {
    id: uuidv4(),
    name: name.trim(),
    created_at: new Date().toISOString(),
  };

  all.push(newCategory);
  save(all);

  res.json(newCategory);
});

/*
|--------------------------------------------------------------------------
| EDIT CATEGORY NAME
|--------------------------------------------------------------------------
| PUT /api/categories/:id
| Body: { name: "New Name" }
*/
router.put("/:id", (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Category name required" });
  }

  const all = load();
  const idx = all.findIndex((c) => c.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ error: "Category not found" });
  }

  // update name
  all[idx].name = name.trim();
  all[idx].updated_at = new Date().toISOString();

  save(all);

  res.json(all[idx]);
});

/*
|--------------------------------------------------------------------------
| DELETE CATEGORY
|--------------------------------------------------------------------------
| DELETE /api/categories/:id
*/
router.delete("/:id", (req, res) => {
  let all = load();
  const before = all.length;

  all = all.filter((c) => c.id !== req.params.id);
  save(all);

  res.json({ deleted: before - all.length });
});

module.exports = router;
