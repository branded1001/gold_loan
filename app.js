
const express = require("express");
const cors = require("cors");

// Admin Routes
const bankRoutes = require("./routes/admin/BankRoutes");
const regionRoutes = require("./routes/admin/RegionRoutes");
const branchRoutes = require("./routes/admin/BranchRoutes");
const userRoutes = require("./routes/admin/UserRoutes");
const invoiceRoutes = require("./routes/admin/InvoiceRoutes");
const vistroutes = require("./routes/admin/visit.routes");
const regionGSTRoutes = require("./routes/admin/regionGSTRoutes");
const dashboardRoutes = require("./routes/admin/dashboardRoutes");

// User App Routes
const authRoutes = require("./routes/user/authRoutes");
const attendanceRoutes = require("./routes/user/AttendanceRoutes");
const locationRoutes = require("./routes/user/locationRoutes");
const visitRoutes = require("./routes/user/VisitRoutes");
const userDashboardRoutes = require("./routes/user/dashboardRoutes");
const kycRoutes = require("./routes/user/kycRoutes");
const Kycroutes = require("./routes/admin/kycRoutes");

const app = express();

// MIDDLEWARES

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));



// ROUTES


// Auth
app.use("/api/auth", authRoutes);

// Admin
app.use("/api/admin/banks", bankRoutes);
app.use("/api/admin/regions", regionRoutes);
app.use("/api/admin/regionsgst", regionGSTRoutes);
app.use("/api/admin/branches", branchRoutes);
app.use("/api/admin/users", userRoutes);
app.use("/api/admin/invoices", invoiceRoutes)
app.use("/api/admin/visits", vistroutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/kyc", Kycroutes);

// Valuer App
app.use("/api/attendance", attendanceRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/visit", visitRoutes);
app.use("/api/user/dashboard", userDashboardRoutes);
app.use("/api/user/kyc", kycRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
