const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  uploadFile,
  processFile,
  getFiles,
} = require("../controllers/fileController");

// storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// routes
router.post("/upload", upload.single("file"), uploadFile);
router.post("/process/:id", processFile);
router.get("/", getFiles);

module.exports = router;
