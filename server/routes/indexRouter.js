const indexRouter = require('express').Router();
const UserController = require('../controllers/userController.js');
const imageUploader = require('../helpers/imageUploader.js');

indexRouter.get('/', function(req, res) {
    res.send('Welcome to Blogate!');
});

indexRouter.post('/register', UserController.register);
indexRouter.post('/login', UserController.login);

indexRouter.post('/uploadimage',
    imageUploader.multer.single('image'), 
    imageUploader.sendUploadToGCS,
    (req, res) => {
        res.status(200).json({
            message: 'Image is successfully uploaded',
            link: req.file.cloudStoragePublicUrl
        })
});

module.exports = indexRouter;