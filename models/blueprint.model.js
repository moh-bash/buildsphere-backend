const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const imageSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    notes: [noteSchema] 
}, { timestamps: true });

const blueprintSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Blueprint title is required'], 
        trim: true 
    },
    description: { 
        type: String, 
        trim: true 
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: [true, 'Blueprint must belong to a project'] 
    },
    images: [imageSchema] 
}, { timestamps: true });

module.exports = mongoose.model('Blueprint', blueprintSchema);