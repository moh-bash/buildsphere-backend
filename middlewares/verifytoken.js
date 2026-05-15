const appError = require("../utils/appError.js")
const httpStatusText = require('../utils/httpStatusTexxt.js');
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if(!authHeader){
        const error = appError.create(401, httpStatusText.FAILED, "Unauthorized: No token provided");
        return next(error);
    }

    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.decoded = decoded;
        next();

    } catch{
        const error = appError.create(401, httpStatusText.FAILED, "Unauthorized: Invalid token");
        return next(error);
    }

}

module.exports = verifyToken;