const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Task title is required'], 
        trim: true 
    },
    description: { 
        type: String, 
        trim: true 
    },
    status: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'POSTPONED'],
        default: 'PENDING'
    },
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);