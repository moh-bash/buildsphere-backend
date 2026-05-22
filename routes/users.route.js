const express = require('express');
const usersController = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifytoken.js');
const allowedTo = require('../middlewares/allowedTo.js');
const userRoles = require('../utils/userRoles.js');
const appError = require('../utils/appError.js');
const httpStatusTexxt = require('../utils/httpStatusTexxt.js');
const multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const newFilename = `user-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
    cb(null, newFilename)
  }
})

const fileFilter = (req, file, cb) => {
        const typeFile = file.mimetype.split('/')[0];
        if (typeFile === 'image') {
            cb(null, true);
        } else {
            cb(appError.create(400,httpStatusTexxt.ERROR,'Only image files are allowed'), false);
        }
}

var upload = multer({ storage: storage, fileFilter })

const router = express.Router();

router.route('/')
        .get(verifyToken, allowedTo(userRoles.ADMIN), usersController.getAllUsers);

router.route('/register')
        .post(upload.single('avatar'), usersController.registerUser);



router.route('/login')
        .post(usersController.loginUser);

module.exports = router;