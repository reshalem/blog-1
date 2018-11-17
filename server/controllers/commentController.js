const Comment = require('../models/commentModel.js');

class CommentController {
    static create(req, res) {
        Comment.create({
            content: req.body.content,
            article: req.params.id,
            user: req.user._id
        })
            .then(function(result) {
                res.status(200).json(result);
            })
            .catch(function(err) {
                console.log('Create Comment Error: ', err);
                res.status(500).json(err);
            });
    }

    static getAll(req, res) {
        Comment.find({article: req.params.id}).populate('user', '_id name email')
            .then(function(comments) {
                res.status(200).json(comments);
            })
            .catch(function(err) {
                console.log('Find All Comments Of An Article Error: ', err);
                res.status(500).json(err);
            });
    }

    static update(req, res) {
        Comment.updateOne({article: req.params.id, user: req.user._id, _id: req.body.id}, {
            content: req.body.content
        })
            .then(function(result) {
                const response = {
                    success: true,
                    message: `Comment successfully updated`
                };
                res.status(200).json(response);
            })
            .catch(function(err) {
                console.log('Update Comment Error: ', err);
                res.status(500).json(err);
            });
    }

    static delete(req, res) {
        Comment.deleteOne({article: req.params.id, user: req.user._id, _id: req.body.id})
            .then(function(result) {
                const response = {
                    success: true,
                    message: `Comment successfully deleted`
                };
                res.status(200).json(response);
            })
            .catch(function(err) {
                console.log('Delete Comment Error: ', err);
                res.status(500).json(err);
            });
    }
}

module.exports = CommentController;