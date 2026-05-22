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
    avatar: {
        type: String,
        default: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png'
    },
    token:{
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchemanew);