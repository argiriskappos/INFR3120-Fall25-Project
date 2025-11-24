const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true, // Ensures no two users can register with the same email
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address.'] // email format validation
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password must be at least 6 characters long.']
    },
    fullName: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['Driver', 'Dispatcher', 'Admin'],
        default: 'Driver'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', UserSchema);