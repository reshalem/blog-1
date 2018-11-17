const commentRouter = require('express').Router();
const CommentController = require('../controllers/commentController.js');
const isLogin = require('../middlewares/isLogin.js');
const isAuthorizedCommenter = require('../middlewares/isAuthorizedCommenter.js');

commentRouter.get('/:id', isLogin, CommentController.getAll);
commentRouter.post('/:id', isLogin, CommentController.create);
commentRouter.put('/:id', isLogin, isAuthorizedCommenter, CommentController.update);
commentRouter.delete('/:id', isLogin, isAuthorizedCommenter, CommentController.delete);

module.exports = commentRouter;