const Blueprint = require('../models/blueprint.model.js');
const Comment = require('../models/comment.model.js');
const asyncWrapper = require('../middlewares/asyncWrapper');
const httpStatusText = require('../utils/httpStatusTexxt.js');
const appError = require('../utils/appError.js');

const createBlueprint = asyncWrapper(async (req, res, next) => {
    const { title, description, projectId } = req.body;

    if (!req.files || req.files.length === 0) {
        return next(appError.create(400, httpStatusText.FAILED, "At least one blueprint image is required"));
    }

    const imagesArray = req.files.map(file => ({
        imageUrl: `/uploads/${file.filename}`,
        notes: []
    }));

    const newBlueprint = new Blueprint({
        title,
        description,
        projectId,
        images: imagesArray
    });

    await newBlueprint.save();

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { blueprint: newBlueprint }
    });
});


const updateBlueprint = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { title, description } = req.body;

    let blueprint = await Blueprint.findById(id);
    if (!blueprint) {
        return next(appError.create(404, httpStatusText.FAILED, "Blueprint not found"));
    }

    if (title) blueprint.title = title;
    if (description) blueprint.description = description;

    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({
            imageUrl: `/uploads/${file.filename}`,
            notes: []
        }));
        blueprint.images.push(...newImages);
    }

    await blueprint.save();

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { blueprint }
    });
});


const deleteBlueprint = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const blueprint = await Blueprint.findById(id);
    if (!blueprint) {
        return next(appError.create(404, httpStatusText.FAILED, "Blueprint not found"));
    }

    await Blueprint.deleteOne({ _id: id });

    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: null
    });
});



const addNoteToImage = asyncWrapper(async (req, res, next) => {
    const { blueprintId, imageId } = req.params;
    const { text } = req.body;

    const objectBlueprintId = new mongoose.Types.ObjectId(blueprintId);
    const objectImageId = new mongoose.Types.ObjectId(imageId);

    const updatedBlueprint = await Blueprint.findOneAndUpdate(
        { _id: objectBlueprintId, "images._id": objectImageId },
        { $push: { "images.$[img].notes": { text, author: req.decoded.id } } },
        { 
            arrayFilters: [{ "img._id": objectImageId }], 
            returnDocument: 'after'
        }
    );

    if (!updatedBlueprint) {
        return next(appError.create(404, httpStatusText.FAILED, "Blueprint or Image not found"));
    }

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { blueprint: updatedBlueprint } });
});


const addComment = asyncWrapper(async (req, res, next) => {
    const { projectId, text } = req.body;
    
    const newComment = new Comment({
        projectId,
        userId: req.decoded.id,
        text
    });
    await newComment.save();
    
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { comment: newComment } });
});

module.exports = {
    createBlueprint,
    updateBlueprint, 
    deleteBlueprint,   
    addNoteToImage,
    addComment
};