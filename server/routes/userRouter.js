const userRouter = require('express').Router();
const UserController = require('../controllers/userController.js');
const isLogin = require('../middlewares/isLogin.js');

userRouter.get('/', isLogin, UserController.getProfile);
userRouter.post('/sendEmail', isLogin, UserController.sendEmail);

module.exports = userRouter;