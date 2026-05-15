const jwt = require('jsonwebtoken');
const appError = require("./appError.js");
const httpStatusText = require('./httpStatusTexxt.js');

module.exports = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_SECRET);
    return token;
}

