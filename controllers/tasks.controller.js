const Task = require('../models/task.model.js');
const asyncWrapper = require('../middlewares/asyncWrapper.js');
const appError = require('../utils/appError.js');
const httpStatusText = require('../utils/httpStatusTexxt.js'); 

const createTask = asyncWrapper(async (req, res, next) => {
    const { title, description, projectId } = req.body;
    const creator = req.decoded.id; // مُستخرج من الـ verifyToken

    if (!title || !projectId) {
        return next(appError.create(400, httpStatusText.FAILED, "Title and Project ID are required"));
    }

    const task = new Task({ title, description, projectId, creator });
    await task.save();

    res.status(201).json({ status: httpStatusText.SUCCESS, data: { task } });
});

const updateTask = asyncWrapper(async (req, res, next) => {
    const { taskId } = req.params;
    const { title, description } = req.body;

    // التأكد من أن مُنشئ المهمة فقط هو من يحق له تعديل نصوصها
    const task = await Task.findOneAndUpdate(
        { _id: taskId, creator: req.decoded.id },
        { title, description },
        { new: true, runValidators: true }
    );

    if (!task) {
        return next(appError.create(404, httpStatusText.FAILED, "Task not found or you are not authorized"));
    }

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { task } });
});

const changeTaskStatus = asyncWrapper(async (req, res, next) => {
    const { taskId } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'POSTPONED'];
    if (!validStatuses.includes(status)) {
        return next(appError.create(400, httpStatusText.FAILED, "Invalid task status"));
    }

    const task = await Task.findByIdAndUpdate(
        taskId,
        { status },
        { new: true, runValidators: true }
    );

    if (!task) {
        return next(appError.create(404, httpStatusText.FAILED, "Task not found"));
    }

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { task } });
});

const deleteTask = asyncWrapper(async (req, res, next) => {
    const { taskId } = req.params;

    const task = await Task.findOneAndDelete({ _id: taskId, creator: req.decoded.id });

    if (!task) {
        return next(appError.create(404, httpStatusText.FAILED, "Task not found or you are not authorized"));
    }

    res.status(200).json({ status: httpStatusText.SUCCESS, data: null, message: "Task deleted successfully" });
});

module.exports = { createTask, updateTask, changeTaskStatus, deleteTask };