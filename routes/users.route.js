const express = require('express');
const usersController = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifytoken.js');
const allowedTo = require('../middlewares/allowedTo.js');
const userRoles = require('../utils/userRoles.js');

const router = express.Router();

router.route('/')
        .get(verifyToken, allowedTo(userRoles.ADMIN), usersController.getAllUsers);

router.route('/register')
        .post(usersController.registerUser);

/**
 * @swagger
 * /api/users/register:
 *  post:
 *      tags:
 *              - Users
 *      sumary:
 *              - Register a new user
 *      description:
 *              - This endpoint allows you to register a new user by providing the necessary information in the request body.
 *      security:
 *              - bearerAuth: []
 *      parameters:
 *              - in: body
 *                name: user
 *                description: The user to create.
 *      requestBody:
 *             required: true
 *             content:
 *              application/json:
 *               schema:
 *           type: object
 *              properties:
 *              name:
 * 
 *      responses:
 */

router.route('/login')
        .post(usersController.loginUser);

module.exports = router;