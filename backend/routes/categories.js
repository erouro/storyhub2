const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const FILE = path.join(__dirname, "..", "data", "categories.json");

function load() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

router.get("/", (req, res) => {
  res.json(load());
});

router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: "Category required" });

  const all = load();
  const c = {
    id: uuidv4(),
    name,
  };

  all.push(c);
  save(all);

  res.json(c);
});

router.delete("/:id", (req, res) => {
  let all = load();
  const before = all.length;
  all = all.filter((c) => c.id !== req.params.id);
  save(all);

  res.json({ deleted: before - all.length });
});

module.exports = router;
