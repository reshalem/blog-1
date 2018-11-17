const articleRouter = require('express').Router();
const ArticleController = require('../controllers/articleController.js');
const isLogin = require('../middlewares/isLogin.js');
const isAuthorizedAuthor = require('../middlewares/isAuthorizedAuthor.js');

articleRouter.get('/:id', ArticleController.getOne);
articleRouter.get('/ownarticles/user', isLogin, ArticleController.findByAuthor);
articleRouter.get('/search/:keyword', ArticleController.searchArticle);
articleRouter.get('/', ArticleController.getAll);
articleRouter.post('/', isLogin, ArticleController.create);
articleRouter.put('/:id', isLogin, isAuthorizedAuthor, ArticleController.update);
articleRouter.put('/addCount/:id', ArticleController.incrementCount);
articleRouter.delete('/:id', isLogin, isAuthorizedAuthor, ArticleController.delete);

module.exports = articleRouter;