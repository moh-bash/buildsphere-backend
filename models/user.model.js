const mongoose = require('mongoose');
const validator = require('validator');

const userSchemanew = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email']
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER' 
    },
    token:{
        type: String
    }
});

module.exports = mongoose.model('User', userSchemanew);