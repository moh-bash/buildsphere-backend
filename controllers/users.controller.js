const User = require("../models/user.model.js")
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require('../utils/httpStatusTexxt.js');
const appError = require("../utils/appError.js");
const bcrypt = require('bcryptjs');
const generateJWT = require("../utils/generateJWT.js")

const getAllUsers = asyncWrapper(async (req, res, next) => {
    const users = await User.find({}, { password: 0, __v: 0 });
    res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const registerUser = asyncWrapper(async (req, res, next) => {
    
    const { name, email, password, role } = req.body;

    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
        const error = appError.create(400, httpStatusText.FAILED, "Email already exists");
        return next(error);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashPassword,
        role,
        // avatar: req.file.filename
    });

    const token = await generateJWT({ id: newUser._id, email: newUser.email, role: newUser.role });
    newUser.token = token;

    await newUser.save();
    const sanitizeUser = (user) => {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            // avatar: user.avatar
        };
    };

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: {
            user: sanitizeUser(newUser),
            token
        }
    });
});

const loginUser = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = appError.create(400, httpStatusText.FAILED, "Email and password are required");
        return next(error);
    }

    const user = await User.findOne({ email });

    if (!user) {
        const error = appError.create(404, httpStatusText.FAILED, "user not found");
        return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

   if (matchedPassword) { 
        const token = await generateJWT({ id: user._id, email: user.email, role: user.role });
        return res.json({ status: httpStatusText.SUCCESS, data: { token } });
    } else {
        const error = appError.create(401, httpStatusText.FAILED, "Invalid email or password");
        return next(error);
    }
});

module.exports = {
    getAllUsers,
    registerUser,
    loginUser
}