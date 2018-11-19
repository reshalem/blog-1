const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const app = require('../app.js');
const Article = require('../models/articleModel.js');
const User = require('../models/userModel.js');
const Comment = require('../models/commentModel.js');
const jwt = require('jsonwebtoken');

let user = {
    username: 'sugita',
    email: 'sugita@mail.com',
    password: 'sugita'
};

let token = '';
let article = {};
let comment = {};

describe('Comment CRUD API Test', function() {
    // before(function(done) {
    //     User.create(user)
    //         .then(function(createdUser) {
    //             Article.deleteOne({title: 'hehe'})
    //                 .then(function(result) {
    //                     token = jwt.sign({
    //                         id: createdUser._id, 
    //                         username: createdUser.username,
    //                         email: createdUser.email
    //                     }, process.env.JWT_KEY);
    //                     console.log('token', token);
    //                     done();
    //                 })
    //                 .catch(function(articleErr) {
    //                     console.log('[Before][CreateArticle] Article Delete Tester Error: ', articleErr);
    //                 });
    //         })
    //         .catch(function(err) {
    //             console.log('[Before][GetProfile] User Create Tester Error: ', err);
    //         });
    // });

    // after(function(done) {
    //     User.deleteOne({email: 'sugita@mail.com'})
    //         .then(function(result) {
    //             console.log('[After][CreateArticle] User Delete Tester Result: ', result);
    //             Article.deleteOne({title: 'hehe'})
    //                 .then(function(articleResult) {
    //                     console.log('[After][CreateArticle] Article Delete Tester Result: ', articleResult);
    //                     done();
    //                 })
    //                 .catch(function(articleErr) {
    //                     console.log('[After][CreateArticle] Article Delete Tester Error: ', articleErr);
    //                 });
    //         })
    //         .catch(function(err) {
    //             console.log('[After][CreateArticle] User Delete Tester Error: ', err);
    //         });
    // });
});