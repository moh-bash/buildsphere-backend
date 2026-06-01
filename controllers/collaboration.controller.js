const Invitation = require('../models/invitation.model.js');
const Project = require('../models/project.model.js');
const User = require('../models/user.model.js');
const asyncWrapper = require('../middlewares/asyncWrapper.js');
const httpStatusText = require('../utils/httpStatusTexxt.js');
const appError = require('../utils/appError.js');
const status=require('../utils/statusInvitation.js');

const sendInvitation = asyncWrapper(async (req, res, next) => {
    const { projectId, receiverEmail } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return next(appError.create(404, httpStatusText.FAILED, "Project not found"));

    if (project.owner.toString() !== req.decoded.id) {
        return next(appError.create(403, httpStatusText.FAILED, "Only the project owner can invite collaborators"));
    }

    const receiver = await User.findOne({ email: receiverEmail.toLowerCase() });
    if (!receiver) return next(appError.create(404, httpStatusText.FAILED, "Engineer email not found in our platform"));

    const existingInvitation = await Invitation.findOne({ projectId, receiverEmail: receiverEmail.toLowerCase(), status: status.PENDING });
    if (existingInvitation) return next(appError.create(400, httpStatusText.FAILED, "An invitation is already pending for this engineer"));

    const newInvitation = new Invitation({
        projectId,
        senderId: req.decoded.id,
        receiverEmail: receiverEmail.toLowerCase()
    });
    await newInvitation.save();

    res.status(201).json({ status: httpStatusText.SUCCESS, data: { invitation: newInvitation } });
});


const getMyInvitations = asyncWrapper(async (req, res, next) => {
    const userEmail = req.decoded.email; 

    const invitations = await Invitation.find({ receiverEmail: userEmail })
        .populate('projectId', 'title description status')
        .populate('senderId', 'name email');

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { invitations } });
});


const respondToInvitation = asyncWrapper(async (req, res, next) => {
    const { invitationId, action } = req.body; 
    if (![status.ACCEPTED, status.REJECTED].includes(action)) {
        return next(appError.create(400, httpStatusText.FAILED, "Invalid action. Must be ACCEPTED or REJECTED"));
    }

    const invitation = await Invitation.findById(invitationId);
    if (!invitation) return next(appError.create(404, httpStatusText.FAILED, "Invitation not found"));

    if (invitation.receiverEmail !== req.decoded.email) {
        return next(appError.create(403, httpStatusText.FAILED, "You are not authorized to respond to this invitation"));
    }

    if (invitation.status !== status.PENDING) {
        return next(appError.create(400, httpStatusText.FAILED, "This invitation has already been processed"));
    }

    invitation.status = action;
    await invitation.save();

    if (action === status.ACCEPTED) {
        await Project.findByIdAndUpdate(invitation.projectId, {
            $addToSet: { collaborators: req.decoded.id } 
        });
    }

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { invitation } });
});

module.exports = {
    sendInvitation,
    getMyInvitations,
    respondToInvitation
};