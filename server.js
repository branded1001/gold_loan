require("dotenv").config();
const app = require("./app.js");
const connectDB = require("./config/db.js");
const seedAdmin = require("./config/seedAdmin.js");

const PORT = process.env.PORT || 5002;

/* ---------------- DATABASE ---------------- */
connectDB().then(() => {
  seedAdmin();
});
/* ---------------- SERVER ---------------- */
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});