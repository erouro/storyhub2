const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const FILE = path.join(__dirname, "..", "data", "subscribers.json");

function load() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

function save(d) {
  fs.writeFileSync(FILE, JSON.stringify(d, null, 2));
}

// CREATE donation or subscription
router.post("/", (req, res) => {
  const body = req.body || {};
  const type = body.type;

  if (!["subscription", "donation"].includes(type))
    return res.status(400).json({ error: "Invalid type" });

  const all = load();

  if (type === "donation") {
    const x = {
      id: uuidv4(),
      type: "donation",
      amount: body.amount || 0,
      name: body.name || "",
      currency: body.currency || "INR",
      user_agent: req.get("user-agent"),
      created_at: new Date().toISOString(),
    };
    all.unshift(x);
    save(all);
    return res.json(x);
  }

  // subscription
  const plans = { "1m": 199, "3m": 299, "6m": 499, "12m": 699 };
  if (!plans[body.plan])
    return res.status(400).json({ error: "Invalid plan" });

  const x = {
    id: uuidv4(),
    type: "subscription",
    plan: body.plan,
    amount: plans[body.plan],
    device_id: body.device_id || "",
    name: body.name || "",
    payment_provider: "manual_upi",
    status: "pending_verification",
    created_at: new Date().toISOString(),
  };

  all.unshift(x);
  save(all);

  res.json(x);
});

// LIST
router.get("/", (req, res) => {
  const all = load();
  if (req.query.type)
    return res.json(all.filter((x) => x.type === req.query.type));
  res.json(all);
});

// VERIFY subscription
router.post("/verify/:id", (req, res) => {
  const all = load();
  const idx = all.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  const device = req.body.bind_device_id;

  all[idx].status = "active";
  if (device) all[idx].device_id = device;

  save(all);
  res.json(all[idx]);
});

// CHECK subscription
router.get("/check", (req, res) => {
  const device = req.query.device_id;
  if (!device) return res.json({ active: false });

  const all = load();
  const x = all.find(
    (s) => s.type === "subscription" && s.status === "active" && s.device_id === device
  );

  res.json({ active: !!x });
});

// DELETE
router.delete("/:id", (req, res) => {
  let all = load();
  const before = all.length;
  all = all.filter((x) => x.id !== req.params.id);
  save(all);

  res.json({ deleted: before - all.length });
});

module.exports = router;
