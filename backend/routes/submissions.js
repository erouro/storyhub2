const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

const FILE = path.join(__dirname, "..", "data", "story_submissions.json");
const CAPTCHA = path.join(__dirname, "..", "data", "captcha.json");

function loadFile(f) {
  if (!fs.existsSync(f)) return [];
  return JSON.parse(fs.readFileSync(f));
}

function saveFile(f, d) {
  fs.writeFileSync(f, JSON.stringify(d, null, 2));
}

// GET CAPTCHA
router.get("/captcha", (req, res) => {
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);

  const x = loadFile(CAPTCHA);
  x.push({ id: uuidv4(), a, b });
  saveFile(CAPTCHA, x);

  res.json({ a, b });
});

// SUBMIT story
router.post("/submit-story", (req, res) => {
  const { title, content, categories, captcha_answer } = req.body;

  if (!title || !content)
    return res.status(400).json({ error: "Title & content required" });

  const c = loadFile(CAPTCHA);
  const last = c[c.length - 1];

  if (!last || captcha_answer !== last.a + last.b)
    return res.status(400).json({ error: "Invalid captcha" });

  const all = loadFile(FILE);
  all.push({
    id: uuidv4(),
    title,
    content,
    categories: categories || [],
  });
  saveFile(FILE, all);

  res.json({ ok: true });
});

module.exports = router;
