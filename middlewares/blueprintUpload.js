const multer = require('multer');
const appError = require('../utils/appError.js');
const httpStatusTexxt = require('../utils/httpStatusTexxt.js');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const newFilename = `blueprint-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
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