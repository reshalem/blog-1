const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Article title is required'],
        minlength: [2, 'Minimum required characters for article title is 2'],
        maxlength: [40, 'Maximum characters allowed for article title is 40']
    },
    description: {
        type: String,
        required: [true, 'Article description is required']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    imgURL: String,
    clapKey: String,
    viewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;