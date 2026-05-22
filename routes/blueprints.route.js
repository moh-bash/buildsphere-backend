const express = require('express');
const blueprintUpload = require('../middlewares/blueprintUpload.js');
const blueprintsController = require('../controllers/blueprints.controller');
const verifyToken = require('../middlewares/verifytoken.js');
const allowedTo = require('../middlewares/allowedTo.js');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

router.route('/')
    .post(allowedTo('USER', 'ADMIN'), blueprintUpload, blueprintsController.createBlueprint);

router.route('/:blueprintId/images/:imageId/notes')
    .post(allowedTo('USER', 'ADMIN'), blueprintsController.addNoteToImage);

router.post('/comments', allowedTo('USER', 'ADMIN'), blueprintsController.addComment);
module.exports = router;