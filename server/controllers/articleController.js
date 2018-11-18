const Article = require('../models/articleModel.js');
const Comment = require('../models/commentModel.js');
const User = require('../models/userModel.js');
const sendEmailTo = require('../helpers/sendEmailTo.js');
const mongoose = require('mongoose');
const database = require('../firebaseConfig.js');

class ArticleController {
    static create(req, res) {
        database.ref('clap').push({
            articleTitle: req.body.title,
            clapCount: 0
        })
            .then(response => {
                let article = new Article({
                    title: req.body.title,
                    description: req.body.description,
                    author: req.user._id,
                    clapKey: response.key
                });

                article.save()
                    .then(function(article) {
                        User.findById(req.user._id).populate('followers', '-password')
                            .then(function(user) {
                                if (user.followers.length > 0) {
                                    let recipients = [];

                                    for (let i = 0; i < user.followers.length; i++) {
                                        recipients.push(user.followers[i].email);
                                    }

                                    sendEmailTo(user.username, recipients, article._id);
                                }

                                const response = {
                                    success: true,
                                    message: `Article ${article.title} created`,
                                    article: article
                                };
                                res.status(201).json(response);
                            })
                            .catch(function(err) {
                                console.log('Find User While Sending Email Error: ', err);
                                res.status(500).json(err);
                            });
                    })
                    .catch(function(err) {
                        console.log('Create Article Error: ', err);
                        res.status(500).json(err);
                    });
            })
            .catch(function(err) {
                console.log('Push Clapkey To Firebase Error: ', err);
                res.status(500).json(err);
            });
    }

    static getAll(req, res) {
        Article.find().populate('author')
            .then(function(articles) {
                res.status(200).json(articles);
            })
            .catch(function(err) {
                console.log('Get All Articles Error: ', err);
                res.status(500).json(err);
            });
    }

    static getOne(req, res) {
        Article.findById(req.params.id).populate('author')
            .then(function(article) {
                res.status(200).json(article);
            })
            .catch(function(err) {
                console.log('Get One Article Error: ', err);
                res.status(500).json(err);
            });
    }
    
    static update(req, res) {
        Article.findOne({_id: req.params.id})
            .then(function(article) {
                if (article) {
                    article.title = req.body.title;
                    article.description = req.body.description;

                    article.save()
                        .then(function(result) {
                            const response = {
                                success: true,
                                message: `Article ${article.title} successfully updated`
                            };
                            res.status(200).json(response);
                        })
                        .catch(function(err) {
                            console.log('Update Article Error: ', err);
                            res.status(500).json(err);
                        });
                } else {
                    console.log('Article not found in else condition of update');
                    res.status(500).json({
                        message: 'Article not found'
                    });
                }
            })
            .catch(function(err) {
                console.log('Find Article While Updating Error: ', err);
                res.status(500).json(err);
            });
    }

    static incrementCount(req, res) {
        Article.findById(req.params.id)
            .then(function(article) {
                let viewCount = article.viewCount;
                article.viewCount = viewCount + 1;

                article.save()
                    .then(function(result) {
                        res.status(200).json({
                            message: 'Successfully added view count'
                        });
                    })
                    .catch(function(err) {
                        console.log('Update View Count Error: ', err);
                        res.status(500).json(err);
                    });
            })
    }

    static delete(req, res) {
        Article.findOne({_id: req.params.id, author: req.user._id})
            .then(function(article) {
                article.remove()
                    .then(function(removeResult) {
                        Comment.deleteMany({article: req.params.id})
                            .then(function(resultComment) {  
                                database.ref('clap/' + article.clapKey).set({});                     
                                const response = {
                                    success: true,
                                    message: `Article successfully deleted`
                                };
                                res.status(200).json(response);
                            })
                            .catch(function(err) {
                                console.log('Delete All Comments While Deleting Article Error: ', err);
                                res.status(500).json(err);
                            });
                    })
                    .catch(function(err) {
                        console.log('Remove Article Error: ', err);
                        res.status(500).json(err);
                    });
            })
            .catch(function(err) {
                console.log('Delete Article Error: ', err);
                res.status(500).json(err);
            });
    }

    static findByAuthor(req, res) {
        const userId = new mongoose.Types.ObjectId(req.user._id)
        Article.find().populate('author')
            .then(function(articles) {
                const result = articles.filter(function(datum) {
                    return userId.equals(datum.author._id);
                });
                res.status(200).json(result);
            })
            .catch(function(err) {
                console.log('Find Articles of Login Author Error: ', err);
                res.status(500).json(err);
            });
    }

    static searchArticle(req, res) {
        Article.find({name: new RegExp(req.params.keyword, 'i')})
            .then(function(articles) {
                res.status(200).json(articles);
            })
            .catch(function(err) {
                res.status(500).json(err.message); 
            });
    }
}

module.exports = ArticleController;