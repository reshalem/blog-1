const Comment = require('../models/commentModel.js');

function isAuthorizedCommenter(req, res, next) {
    if (req.user) {
        try {
            Comment.findById(req.body.id)
                .then(function(comment) {
                    if (req.user._id.equals(comment.user)) {
                        next();
                    } else {
                        res.status(401).json({
                            message: 'You can only manage your own comment'
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

module.exports = isAuthorizedCommenter;