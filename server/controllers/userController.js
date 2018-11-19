const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const encryptPassword = require('../helpers/encryptPassword.js');

class UserController {
    static register(req, res) {
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatarURL: req.body.avatarURL
        });
        user.save()
            .then(function(user) {
                const response = {
                    success: true,
                    message: `Account ${user.username} registered`
                }
                res.status(201).json(response);
            })
            .catch(function(err) {
                console.log('Register Error: ', err);
                res.status(500).json(err);
            });
    }

    static login(req, res) {
        req.body.password = encryptPassword(req.body.password);

        User.findOne({
            email: req.body.email,
            password: req.body.password
        })
            .then(function(user) {
                if (user) {
                    const token = jwt.sign({id: user._id, username: user.username, email: user.email}, process.env.JWT_KEY);
                    res.status(201).json({
                        token: token,
                        role: user.role
                    });
                } else {
                    const err = {
                        message: 'Wrong username or password'
                    };
                    res.status(400).json(err);
                }
            })
            .catch(function(err ){
                console.log('Find User While Login Error: ', err);
                res.status(500).json(err);
            });
    }

    static getProfile(req, res) {
        User.findById(req.user._id).populate('following followers', '-password').select('-password')
            .then(function(user) {
                res.status(200).json(user);
            })
            .catch(function(err) {
                console.log('Find User While Getting Profile Error: ', err);
                res.status(500).json(err);
            });
    }

    static getAllUsersToFollow(req, res) {
        User.find({
            _id: {
                $nin: req.user.following,
                $ne: req.user._id
            }
        }).populate('following followers', '-password').select('-password')
            .then(function(users) {
                res.status(200).json(users);
            })
            .catch(function(err) {
                console.log('Get All Users To Follow Error: ', err);
                res.status(500).json(err);
            });
    }

    static getAllUsers(req, res) {
        User.find().populate('following followers', '-password').select('-password')
            .then(function(users) {
                res.status(200).json(users);
            })
            .catch(function(err) {
                console.log('Get All Users Error: ', err);
                res.status(500).json(err);
            });
    }

    static follow(req, res) {
        User.findByIdAndUpdate(req.user._id, {
            $push: {
                following: req.params.user_id
            }
        })
            .then(function(result) {
                User.findByIdAndUpdate(req.params.user_id, {
                    $push: {
                        followers: req.user._id
                    }
                })
                    .then(function(user) {
                        const response = {
                            message: `Successfully followed ${user.username}`
                        }
                        res.status(200).json(response);
                    })
                    .catch(function(err) {
                        console.log('Find User To Follow Error: ', err);
                        res.status(500).json(err);
                    });
            })
            .catch(function(err) {
                console.log('Follow User Error: ', err);
                res.status(500).json(err);
            });
    }

    static unfollow(req, res) {
        User.findByIdAndUpdate(req.user._id, {
            $pull: {
                following: req.params.user_id
            }
        })
            .then(function(result) {
                User.findByIdAndUpdate(req.params.user_id, {
                    $pull: {
                        followers: req.user._id
                    }
                })
                    .then(function(user) {
                        const response = {
                            message: `Successfully unfollowed ${user.username}`
                        }
                        res.status(200).json(response);
                    })
                    .catch(function(err) {
                        console.log('Find User To Unfollow Error: ', err);
                        res.status(500).json(err);
                    });
            })
            .catch(function(err) {
                console.log('Unfollow User Error: ', err);
                res.status(500).json(err);
            });
    }
}

module.exports = UserController;