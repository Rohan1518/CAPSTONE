const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const forumPostSchema = new mongoose.Schema({
    // Link to the user who created the post
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'A forum post must have a title'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'A forum post must have content'],
        trim: true,
    },
    // Array to hold replies using the replySchema defined above
    replies: [replySchema],
    
    // Optional: Add tags/categories later
    // tags: [String],
}, {
    timestamps: true, // Adds createdAt and updatedAt for the main post
});

// Automatically populate the author's name when posts are fetched
forumPostSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'author',
        select: 'name', // Only fetch the author's name
    }).populate({ // Also populate the author of each reply
        path: 'replies.author',
        select: 'name',
    });
    next();
});

const ForumPost = mongoose.model('ForumPost', forumPostSchema);
module.exports = ForumPost;