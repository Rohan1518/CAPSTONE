const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Main User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'recycler'],
        default: 'user',
    },
    points: {
        type: Number,
        default: 0,
    },
    
    isActive: {
        type: Boolean,
        default: true,
    },
    
    // --- 👇 NEW FIELD ---
    contactInfo: {
        type: String,
        trim: true,
        maxlength: 200, // Max 200 chars for contact info (e.g., "email me at user@... or call...")
    }
    // --- END NEW FIELD ---

}, {
    timestamps: true
});

// Password hashing pre-save hook
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);

module.exports = User;