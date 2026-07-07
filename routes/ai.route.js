const express = require("express");
const multer = require("multer");
const aiController = require("../controllers/ai.controller");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

router.post(
    "/generate-3d",
    upload.single("image"),
    aiController.generate3DModel
);

module.exports = router;