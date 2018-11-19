const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const app = require('../app.js');
const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');

let user = {
    username: 'sugita',
    email: 'sugita@mail.com',
    password: 'sugita'
};

let token = '';

// USER REGISTER
describe('User Register API Test', function() {
    before(function(done) {
        User.deleteOne({email: 'sugita@mail.com'})
            .then(function(result) {
                console.log('[Before][Register] User Delete Tester Result: ', result);
                done();
            })
            .catch(function(err) {
                console.log('[Before][Register] User Delete Tester Error: ', err);
            });
    });

    after(function(done) {
        User.deleteOne({email: 'sugita@mail.com'})
            .then(function(result) {
                console.log('[After][Register] User Delete Tester Result: ', result);
                done();
            })
            .catch(function(err) {
                console.log('[After][Register] User Delete Tester Error: ', err);
            });
    });

    it('should return status 201 and a success message', function(done) {
        chai.request(app)
            .post('/register')
            .send(user)
            .end(function(err, res) {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('success').to.equal(true);
                expect(res.body).to.have.property('message').to.equal(`Account ${user.username} registered`);
                done();
            });
    });

    it('should return status 500 if username is an empty string', function(done) {
        user.username = '';
        chai.request(app)
            .post('/register')
            .send(user)
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal("User validation failed: username: Username is required to register your account")
                done();
            });
    });

    it('should return status 500 if email is an empty string', function(done) {
        user.username = 'sugita';
        user.email = '';
        chai.request(app)
            .post('/register')
            .send(user)
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal("User validation failed: email: Email is required to register your account")
                done();
            });
    });

    it('should return status 500 if password is an empty string', function(done) {
        user.email = 'sugita@mail.com';
        user.password = '';
        chai.request(app)
            .post('/register')
            .send(user)
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal("User validation failed: password: Password is required to register your account");
                done();
            });
    });

    it('should return status 500 if password length is less than 4', function(done) {
        user.password = 'aaa';
        chai.request(app)
            .post('/register')
            .send(user)
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal("User validation failed: password: Minimum required characters for password is 4");
                done();
            });
    });

    it('should return status 500 if password length is longer than 10', function(done) {
        user.password = '1234567891011';
        chai.request(app)
            .post('/register')
            .send(user)
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message').to.equal("User validation failed: password: Maximum characters allowed for password is 10");
                user.password = 'sugita'
                done();
            });
    });
});

// USER REGISTER CHECK UNIQUE
describe('User Register Unique Test', function() {
    before(function(done) {
        User.create({
            username: 'sugita',
            email: 'sugita@mail.com',
            password: 'sugita'
        })
            .then(function(result) {
                console.log('[Before][Register][Unique] User Delete Tester Result: ', result);
                done();
            })
            .catch(function(err) {
                console.log('[Before][Register][Unique] User Delete Tester Error: ', err);
            });
    });

    after(function(done) {
        User.deleteOne({email: 'sugita@mail.com'})
            .then(function(result) {
                console.log('[After][Register][Unique] User Delete Tester Result: ', result);
                done();
            })
            .catch(function(err) {
                console.log('[After][Register][Unique] User Delete Tester Error: ', err);
            });
    });

    it('should return status 500 if other users register with the same username', function(done) {
        user.email = 'sugita2@mail.com';
        chai.request(app)
            .post('/register')
            .send(user)
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('errmsg').to.equal("E11000 duplicate key error collection: test-blogate.users index: username_1 dup key: { : \"sugita\" }");
                done();
            });
    });

    it('should return status 500 if other users register with the same email', function(done) {
        user.email = 'sugita@mail.com';
        user.username = 'sugita2'
        chai.request(app)
            .post('/register')
            .send(user)
            .end(function(err, res) {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('errmsg').to.equal("E11000 duplicate key error collection: test-blogate.users index: email_1 dup key: { : \"sugita@mail.com\" }");
                done();
            });
    });
});


// USER LOGIN
describe('User Login API Test', function() {
    before(function(done) {
        User.create({
            username: 'sugita',
            email: 'sugita@mail.com',
            password: 'sugita'
        })
            .then(function(user) {
                console.log('[Before][Login] User Create Tester Result: ', user);
                done();
            })
            .catch(function(err) {
                console.log('[Before][Login] User Create Tester Error: ', err);
            });
    });

    after(function(done) {
        User.deleteOne({email: 'sugita@mail.com'})
            .then(function(result) {
                console.log('[After][Login] User Delete Tester Result: ', result);
                done();
            })
            .catch(function(err) {
                console.log('[After][Login] User Delete Tester Error: ', err);
            });
    });

    it('should return status 201 and a token', function(done) {
        chai.request(app)
            .post('/login')
            .send({
                email: 'sugita@mail.com',
                password: 'sugita'
            })
            .end(function(err, res) {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('token').to.be.a('string');
                token = res.body.token;
                done();
            });
    });

    it('should return status 400 if email is invalid or empty string', function(done) {
        chai.request(app)
            .post('/login')
            .send({
                email: '',
                password: 'sugita'
            })
            .end(function(err, res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message').to.equal('Wrong username or password');
                done();
            });
    });

    it('should return status 400 if password is invalid or empty string', function(done) {
        chai.request(app)
            .post('/login')
            .send({
                email: 'sugita@mail.com',
                password: 'aa'
            })
            .end(function(err, res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message').to.equal('Wrong username or password');
                done();
            });
    });
});


// GET USER PROFILE
describe('User Get Profile Data API Test', function() {
    before(function(done) {
        User.create({
            username: 'sugita',
            email: 'sugita@mail.com',
            password: 'sugita'
        })
            .then(function(user) {
                console.log('[Before][GetProfile] User Create Tester Result: ', user);
                token = jwt.sign({
                    id: user._id, 
                    username: user.username,
                    email: user.email
                }, process.env.JWT_KEY);
                done();
            })
            .catch(function(err) {
                console.log('[Before][GetProfile] User Create Tester Error: ', err);
            });
    });

    after(function(done) {
        User.deleteOne({email: 'sugita@mail.com'})
            .then(function(result) {
                console.log('[After][GetProfile] User Delete Tester Result: ', result);
                done();
            })
            .catch(function(err) {
                console.log('[After][GetProfile] User Delete Tester Error: ', err);
            });
    });

    it('should return status 400 and an error message', function(done) {
        chai.request(app)
            .get('/users')
            .set({})
            .end(function(err, res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message').to.equal("Token not found");
                done();
            });
    });

    it('should return status 200 and user profile data', function(done) {
        chai.request(app)
            .get('/users')
            .set('access-token', token)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('username');
                expect(res.body).to.have.property('email');
                done();
            });
    });
});