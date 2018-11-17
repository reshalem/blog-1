const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const encryptPassword = require('../helpers/encryptPassword.js');

const userSchema = new Schema({
    username: {
        type: String, 
        required: [true, 'Username is required to register your account'],
        unique: [true, 'This username is already exists']
    },
    email: {
        type: String,
        required: [true, 'Email is required to register your account'],
        unique: [true, 'This email is already exists']
    },
    password: {
        type: String,
        required: [true, 'Password is required to register your account'],
        minlength: [4, 'Minimum required characters for password is 4'],
        maxlength: [10, 'Maximum characters allowed for password is 10']
    },
    avatarURL: String,
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

userSchema.pre('save', function(next) {
    this.password = encryptPassword(this.password);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;