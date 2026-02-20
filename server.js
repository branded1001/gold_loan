require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const seedAdmin = require("./config/seedAdmin");

const PORT = process.env.PORT || 5002;

/* ---------------- DATABASE ---------------- */
connectDB().then(() => {
  seedAdmin();
});
/* ---------------- SERVER ---------------- */
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});