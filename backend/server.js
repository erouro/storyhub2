const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/stories", require("./routes/stories"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/subscribers", require("./routes/subscribers"));
app.use("/api", require("./routes/submissions")); // submissions + captcha

// HEALTH CHECK
app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend running on port", PORT));
