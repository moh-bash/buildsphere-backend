const Project = require("../models/project.model.js");
const Blueprint = require('../models/blueprint.model.js'); 
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require('../utils/httpStatusTexxt.js');
const appError = require("../utils/appError.js");
const { validationResult } = require('express-validator');

const createProject = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = appError.create(400, httpStatusText.FAILED, errors.array()[0].msg);
        return next(error);
    }

    const { title, description, status, visibility } = req.body;

    const newProject = new Project({
        title,
        description,
        status,
        visibility,
        owner: req.decoded.id 
    });

    await newProject.save();

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { project: newProject }
    });
});

const getAllProjects = asyncWrapper(async (req, res, next) => {
    const currentUserId = req.decoded.id;

    const projects = await Project.find({
        $or: [
            { visibility: 'PUBLIC' },
            { owner: currentUserId }
        ]
    }).populate('owner', 'name email role');

    res.json({ status: httpStatusText.SUCCESS, data: { projects } });
});



const getProjectById = asyncWrapper(async (req, res, next) => {
    const project = await Project.findById(req.params.id).populate('owner', 'name email role');

    if (!project) {
        const error = appError.create(404, httpStatusText.FAILED, "Project not found");
        return next(error);
    }

    if (project.visibility === 'PRIVATE' && project.owner._id.toString() !== req.decoded.id) {
        const error = appError.create(403, httpStatusText.FAILED, "Access denied to this private project");
        return next(error);
    }

    const blueprints = await Blueprint.find({ projectId: project._id });

    res.json({ 
        status: httpStatusText.SUCCESS, 
        data: { 
            project,
            blueprints 
        } 
    });
});



const updateProject = asyncWrapper(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        const error = appError.create(404, httpStatusText.FAILED, "Project not found");
        return next(error);
    }

    if (project.owner.toString() !== req.decoded.id) {
        const error = appError.create(403, httpStatusText.FAILED, "You are not authorized to update this project");
        return next(error);
    }

    const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
    );

    res.json({ status: httpStatusText.SUCCESS, data: { project: updatedProject } });
});


const deleteProject = asyncWrapper(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        const error = appError.create(404, httpStatusText.FAILED, "Project not found");
        return next(error);
    }

    if (project.owner.toString() !== req.decoded.id) {
        const error = appError.create(403, httpStatusText.FAILED, "You are not authorized to delete this project");
        return next(error);
    }

    await Project.deleteOne({ _id: req.params.id });

    res.json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
};