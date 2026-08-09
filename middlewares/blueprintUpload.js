const multer = require('multer');
const path = require('path');
const fs = require('fs');
const appError = require('../utils/appError.js');
const httpStatusTexxt = require('../utils/httpStatusTexxt.js');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const newFilename = `blueprint-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, newFilename);
  }
});

const fileFilter = (req, file, cb) => {
  const typeFile = file.mimetype.split('/')[0];
  if (typeFile === 'image') {
    cb(null, true);
  } else {
    cb(appError.create(400, httpStatusTexxt.ERROR, 'Only image files are allowed'), false);
  }
};

const upload = multer({ storage: storage, fileFilter });

module.exports = upload.array('images', 10);