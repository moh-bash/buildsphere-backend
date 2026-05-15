const express = require('express');
const usersController = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifytoken.js');
const allowedTo = require('../middlewares/allowedTo.js');
const userRoles = require('../utils/userRoles.js');

const router = express.Router();

router.route('/')
        .get(verifyToken,allowedTo(userRoles.ADMIN) , usersController.getAllUsers);

router.route('/register')
        .post(usersController.registerUser);

router.route('/login')
        .post(usersController.loginUser);

module.exports = router;