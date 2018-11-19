const userRouter = require('express').Router();
const UserController = require('../controllers/userController.js');
const isLogin = require('../middlewares/isLogin.js');

userRouter.get('/all', isLogin, UserController.getAllUsers);
userRouter.get('/allfollow', isLogin, UserController.getAllUsersToFollow);
userRouter.get('/', isLogin, UserController.getProfile);
userRouter.patch('/follow/:user_id', isLogin, UserController.follow);
userRouter.patch('/unfollow/:user_id', isLogin, UserController.unfollow);

module.exports = userRouter;