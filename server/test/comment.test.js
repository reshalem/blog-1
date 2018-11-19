const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const app = require('../app.js');
const Article = require('../models/articleModel.js');
const User = require('../models/userModel.js');
const Comment = require('../models/commentModel.js');
const jwt = require('jsonwebtoken');

describe('Comment CRUD API Test', function() {
    let userId1 = '';
    let token1 = '';
    let articleId1 = '';
    let userId2 = '';
    let token2 = '';
    let commentId1 = '';

    before(function(done) {
        let user1 = {
            username: 'alio',
            email: 'alio@mail.com',
            password: 'alio'
        };

        let user2 = {
            username: 'zura',
            email: 'zura@mail.com',
            password: 'zura'
        };

        let article1 = {
            title: 'title1',
            description: 'desc1'
        };

        let user = new User(user1);

        user.save()
            .then(function(result1) {
                token1 = jwt.sign({id: result1._id, username: result1.username, email: result1.email}, process.env.JWT_KEY);
                userId1 = result1._id;

                user = new User(user2);

                user.save()
                    .then(function(result2) {
                        token2 = jwt.sign({id: result2._id, username: result2.username, email: result2.email}, process.env.JWT_KEY);
                        userId2 = result2._id;

                        let article = new Article(article1);

                        article.save()
                            .then(function(result1) {
                                articleId1 = result1._id;
                                done();
                            })
                    });
            })
            .catch(function(err) {
                console.log('Login Error: ', err);
            });
    });

    after(function(done) {
        User.deleteMany({})
            .then(function(result) {
                Comment.deleteMany({})
                    .then(function(resultComment) {
                        Article.deleteMany({})
                            .then(function(resultArticle) {
                                done();
                            });
                    });
            })
            .catch(function(err) {
                console.log('Delete Many User Error: ', err);
            });
    });

    
    // ADD COMMENT TO AN ARTICLE
    it('[Add Comment] should return status 200 and the comment data', function(done) {
        chai.request(app)
            .post(`/comments/${articleId1}`)
            .set('access-token', token1)
            .send({
                content: 'Hahahaha'
            })
            .end(function(err, res) {
                expect(res).to.have.status(200);
                commentId1 = res.body._id;
                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('content');
                expect(res.body).to.have.property('article');
                expect(res.body).to.have.property('user');
                expect(res.body).to.have.property('createdAt');
                expect(res.body).to.have.property('updatedAt');
                done();
            });
    });

    it('[Add Comment] should return status 400 if user tried to post comment without login first', function(done) {
        chai.request(app)
            .post(`/comments/${articleId1}`)
            .set({})
            .send({
                content: 'Hahahaha'
            })
            .end(function(err, res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message').to.equal("Token not found");
                done();
            });
    });

    it('[Add Comment] should return status 500 and an error message if article id is invalid', function(done) {
        chai.request(app)
            .post(`/comments/5b`)
            .set('access-token', token1)
            .send({
                content: 'Hahahaha'
            })
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal('Comment validation failed: article: Cast to ObjectID failed for value "5b" at path "article"');
                done();
            });
    });

    it('[Add Comment] should return status 404 if there is no params for article id', function(done) {
        chai.request(app)
            .post(`/comments/`)
            .set('access-token', token1)
            .send({
                content: 'Hahahaha'
            })
            .end(function(err, res) {
                expect(res).to.have.status(404);
                done();
            });
    });


    // GET ALL COMMENTS IN AN ARTICLE
    it('[Get All Comments] should return status 200 and all comments data', function(done) {
        chai.request(app)
            .get(`/comments/${articleId1}`)
            .set('access-token', token1)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body[0]).to.have.property('_id');
                expect(res.body[0]).to.have.property('content');
                expect(res.body[0]).to.have.property('article');
                expect(res.body[0]).to.have.property('user');
                expect(res.body[0].user).to.have.property('_id');
                expect(res.body[0].user).to.have.property('username');
                expect(res.body[0].user).to.have.property('email');
                done();
            });
    });

    it('[Get All Comment] should return status 400 if user tried to get comments without login first', function(done) {
        chai.request(app)
            .get(`/comments/${articleId1}`)
            .set({})
            .end(function(err, res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message').to.equal("Token not found");
                done();
            });
    });

    it('[Get All Comment] should return status 500 and an error message if article id is invalid', function(done) {
        chai.request(app)
            .get(`/comments/5b`)
            .set('access-token', token1)
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal('Cast to ObjectId failed for value "5b" at path "article" for model "Comment"');
                done();
            });
    });


    // UPDATE COMMENT
    it('[Update Comment] should return status 200 and a success message when update is succeeded', function(done) {
        let updatedData = {
            content: 'Hihihihi',
            id: commentId1
        };

        chai.request(app)
            .put(`/comments/${articleId1}`)
            .set('access-token', token1)
            .send(updatedData)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success').to.equal(true);
                expect(res.body).to.have.property('message').to.equal(`Comment successfully updated`);
                done();
            });
    });

    it('[Update Comment] should return status 400 if user tried to update comment without login first', function(done) {
        let updatedData = {
            content: 'Hihihihi',
            id: commentId1
        };

        chai.request(app)
            .post(`/comments/${articleId1}`)
            .set({})
            .send(updatedData)
            .end(function(err, res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message').to.equal("Token not found");
                done();
            });
    });
    
    it('[Update Comment] should return status 500 and an error message if article id is invalid', function(done) {
        let updatedData = {
            content: 'Hihihihi',
            id: commentId1
        };

        chai.request(app)
            .post(`/comments/5b`)
            .set('access-token', token1)
            .send(updatedData)
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal('Comment validation failed: article: Cast to ObjectID failed for value "5b" at path "article"');
                done();
            });
    });


    // DELETE COMMENT
    it('[Delete Comment] should return status 400 if user tried to delete comment without login first', function(done) {
        chai.request(app)
            .delete(`/comments/${articleId1}`)
            .set({})
            .send({
                id: commentId1
            })
            .end(function(err, res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message').to.equal("Token not found");
                done();
            });
    });
    
    it('[Delete Comment] should return status 401 if user tried to delete another user comment', function(done) {
        chai.request(app)
            .delete(`/comments/${articleId1}`)
            .set('access-token', token2)
            .send({
                id: commentId1
            })
            .end(function(err, res) {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('message').to.equal("You can only manage your own comment");
                done();
            });
    }); 
    
    it('[Delete Comment] should return status 500 and an error message if article id is invalid', function(done) {
        chai.request(app)
            .delete(`/comments/5b`)
            .set('access-token', token1)
            .send({
                id: commentId1
            })
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal('Cast to ObjectId failed for value "5b" at path "article" for model "Comment"');
                done();
            });
    });

    it('[Delete Comment] should return status 200 and a success message when delete is succeeded', function(done) {
        chai.request(app)
            .delete(`/comments/${articleId1}`)
            .set('access-token', token1)
            .send({
                id: commentId1
            })
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success').to.equal(true);
                expect(res.body).to.have.property('message').to.equal(`Comment successfully deleted`);
                done();
            });
    });
});