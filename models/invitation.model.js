const mongoose = require('mongoose');
const status=require('../utils/statusInvitation.js');

const invitationSchema = new mongoose.Schema({
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true 
    },
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    receiverEmail: { 
        type: String, 
        required: true, 
        trim: true, 
        lowercase: true 
    },
    status: { 
        type: String, 
        enum: [status.PENDING, status.ACCEPTED, status.REJECTED], 
        default: status.PENDING 
    }
}, { timestamps: true });

module.exports = mongoose.model('Invitation', invitationSchema);