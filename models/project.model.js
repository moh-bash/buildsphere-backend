const mongoose = require('mongoose');
const status = require('../utils/statusProject.js');
const visibility = require('../utils/visibilityPro.js');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
        minLength: [3, 'Title must be at least 3 characters']
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: [status.ACTIVE, status.COMPLETED, status.ARCHIVED],
        default: status.ACTIVE
    },
    visibility: {
        type: String,
        enum: [visibility.PUBLIC, visibility.PRIVATE],
        default: visibility.PUBLIC
    },
    location: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Project must belong to an owner']
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);