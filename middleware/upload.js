const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure folder exists
const uploadPath = "uploads/attendance";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// File filter (image only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
