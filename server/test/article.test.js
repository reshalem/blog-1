const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const app = require('../app.js');
const Article = require('../models/articleModel.js');
const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');

let user = {
    username: 'sugita',
    email: 'sugita@mail.com',
    password: 'sugita'
};

let token = '';
let article = {};

describe('Article CRUD API Test', function() {
    before(function(done) {
        User.create(user)
            .then(function(createdUser) {
                console.log('[Before][CreateArticle] User Create Tester Result: ', createdUser);
                Article.deleteOne({title: 'hehe'})
                    .then(function(result) {
                        console.log('[Before][CreateArticle] Article Delete Tester Result: ', result);
                        token = jwt.sign({
                            id: createdUser._id, 
                            username: createdUser.username,
                            email: createdUser.email
                        }, process.env.JWT_KEY);
                        console.log('token', token);
                        done();
                    })
                    .catch(function(articleErr) {
                        console.log('[Before][CreateArticle] Article Delete Tester Error: ', articleErr);
                    });
            })
            .catch(function(err) {
                console.log('[Before][GetProfile] User Create Tester Error: ', err);
            });
    });

    after(function(done) {
        User.deleteOne({email: 'sugita@mail.com'})
            .then(function(result) {
                console.log('[After][CreateArticle] User Delete Tester Result: ', result);
                Article.deleteOne({title: 'hehe'})
                    .then(function(articleResult) {
                        console.log('[After][CreateArticle] Article Delete Tester Result: ', articleResult);
                        done();
                    })
                    .catch(function(articleErr) {
                        console.log('[After][CreateArticle] Article Delete Tester Error: ', articleErr);
                    });
            })
            .catch(function(err) {
                console.log('[After][CreateArticle] User Delete Tester Error: ', err);
            });
    });


    // CREATE AN ARTICLE
    it('[Create Article] should return status 201, success message, and the article data', function(done) {
        chai.request(app)
            .post('/articles')
            .set('access-token', token)
            .send({
                title: 'hehe',
                description: 'hehe hehe hehe'
            })
            .end(function(err, res) {
                article = res.body.article;
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('success');
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('article');
                expect(res.body.article).to.have.property('_id');
                expect(res.body.article).to.have.property('title');
                expect(res.body.article).to.have.property('description');
                expect(res.body.article).to.have.property('author');
                expect(res.body.article).to.have.property('createdAt');
                expect(res.body.article).to.have.property('updatedAt');
                done();
            });
    });

    it('[Create Article] should return status 400 and an error message if user is not logged in', function(done) {
        chai.request(app)
            .post('/articles')
            .set({})
            .send({
                title: 'aaaaa',
                description: 'hehe hehe hehe'
            })
            .end(function(err, res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message').to.equal("Token not found");
                done();
            });
    });

    it('[Create Article] should return status 500 and an error message if title length is less than 2', function(done) {
        chai.request(app)
            .post('/articles')
            .set('access-token', token)
            .send({
                title: 'a',
                description: 'hehe hehe hehe'
            })
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal("Article validation failed: title: Minimum required characters for article title is 2");
                done();
            });
    });

    it('[Create Article] should return status 500 and an error message if title length is larger than 40', function(done) {
        chai.request(app)
            .post('/articles')
            .set('access-token', token)
            .send({
                title: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum natus voluptate maxime aspernatur architecto, omnis nihil quisquam atque nam harum. Debitis ratione culpa, iste suscipit sequi, beatae ut voluptatibus cumque porro voluptatem temporibus magni expedita doloribus alias voluptas aliquam nisi tenetur cum.',
                description: 'hehe hehe hehe'
            })
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal("Article validation failed: title: Maximum characters allowed for article title is 40");
                done();
            });
    });

    it('[Create Article] should return status 500 and an error message if title is an empty string', function(done) {
        chai.request(app)
            .post('/articles')
            .set('access-token', token)
            .send({
                title: '',
                description: 'hehe hehe hehe'
            })
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal("Article validation failed: title: Article title is required");
                done();
            });
    });

    it('[Create Article] should return status 500 and an error message if description is an empty string', function(done) {
        chai.request(app)
            .post('/articles')
            .set('access-token', token)
            .send({
                title: 'hehe',
                description: ''
            })
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal("Article validation failed: description: Article description is required");
                done();
            });
    });


    // GET ALL ARTICLES DATA
    it('[Get All Articles] should return status 200 and all articles data', function(done) {
        chai.request(app)
            .get('/articles')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body[0]).to.have.property('_id');
                expect(res.body[0]).to.have.property('title');
                expect(res.body[0]).to.have.property('description');
                expect(res.body[0]).to.have.property('author');
                expect(res.body[0]).to.have.property('createdAt');
                expect(res.body[0]).to.have.property('updatedAt');
                done();
            });
    });


    // GET ARTICLE DATA BY ID
    it('[Get Article By Id] should return status 200 and the particular article data (if id is valid)', function(done) {
        chai.request(app)
            .get(`/articles/${article._id}`)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('description');
                expect(res.body).to.have.property('author');
                expect(res.body).to.have.property('createdAt');
                expect(res.body).to.have.property('updatedAt');
                done();
            });
    });

    it('[Get Article By Id] should return status 500 and an error message (if id is invalid)', function(done) {
        chai.request(app)
            .get('/articles/5b')
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal('Cast to ObjectId failed for value "5b" at path "_id" for model "Article"');
                done();
            });
    });  
    

    // UPDATE AN ARTICLE
    it('[Update Article] should return status 200 and a success message when update is succeeded', function(done) {
        let updatedData = {
            title: 'hihi',
            description: 'hihi hihi hihi'
        };

        chai.request(app)
            .put(`/articles/${article._id}`)
            .set('access-token', token)
            .send(updatedData)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success').to.equal(true);
                expect(res.body).to.have.property('message').to.equal(`Article ${updatedData.title} successfully updated`);
                done();
            });
    });

    it('[Update Article] should return status 500 and an error message (if id is invalid)', function(done) {
        let updatedData = {
            title: 'hihi',
            description: 'hihi hihi hihi'
        };

        chai.request(app)
            .put('/articles/5b')
            .set('access-token', token)
            .send(updatedData)
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal('Cast to ObjectId failed for value "5b" at path "_id" for model "Article"');
                done();
            });
    });


    // DELETE AN ARTICLE
    it('[Delete Article] should return status 200 and a success message when delete is succeeded', function(done) {
        chai.request(app)
            .delete(`/articles/${article._id}`)
            .set('access-token', token)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success').to.equal(true);
                expect(res.body).to.have.property('message').to.equal('Article successfully deleted');
                done();
            });
    });

    it('[Delete Article] should return status 500 and an error message (if id is invalid)', function(done) {
        chai.request(app)
            .delete('/articles/5b')
            .set('access-token', token)
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal('Cast to ObjectId failed for value "5b" at path "_id" for model "Article"');
                done();
            });
    });
});