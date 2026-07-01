const User = require('../models/user.model.js');
const Project = require('../models/project.model.js');
const asyncWrapper = require('../middlewares/asyncWrapper.js');
const appError = require('../utils/appError.js');
const httpStatusText = require('../utils/httpStatusTexxt.js');

const getMyProfile = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.decoded.id).select('-password -token -__v');
    
    if (!user) {
        return next(appError.create(404, httpStatusText.FAILED, "User not found"));
    }

    const projects = await Project.find({ owner: user._id , visibility: 'PUBLIC' ,collaborators: { $ne: user._id } });

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { user, projects } });
});

const getUserProfile = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password -email  -token -__v');
    
    if (!user) {
        return next(appError.create(404, httpStatusText.FAILED, "User not found"));
    }

    const publicProjects = await Project.find({ owner: user._id, visibility: 'PUBLIC' });

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { user, projects: publicProjects } });
});



const updateProfile = asyncWrapper(async (req, res, next) => {
    const { name, bio, specialty, phone } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (bio) updates.bio = bio;
    if (specialty) updates.specialty = specialty;
    if (phone) updates.phone = phone;

    if (req.file) {
        updates.avatar = req.file.filename;
    }

    if (Object.keys(updates).length === 0) {
        return next(appError.create(400, httpStatusText.FAILED, "No data provided to update"));
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.decoded.id,
        { $set: updates },
        { returnDocument: 'after', runValidators: true }
    ).select('-password -__v -token');

    res.status(200).json({ 
        status: httpStatusText.SUCCESS, 
        data: { user: updatedUser } 
    });
});

module.exports = {
    getMyProfile,
    getUserProfile,
    updateProfile
};