const Article = require('../models/articleModel.js');

function isAuthorizedAuthor(req, res, next) {
    if (req.user) {
        try {
            Article.findById(req.params.id)
                .then(function(article) {
                    if (req.user._id.equals(article.author)) {
                        next();
                    } else {
                        res.status(401).json({
                            message: 'You can only manage your own article'
                        });
                    }
                })
                .catch(function(err) {
                    res.status(500).json(err);
                });
        } catch(err) {
            res.status(500).json({
                error: err
            });
        }
    } else {
        res.status(400).json({
            message: 'Token not found'
        });
    }
}

module.exports = isAuthorizedAuthor;