const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address.']
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
    },
    profileImage: {
        type: String,
        default: '/images/default-user.png' 
    }
}, {
    timestamps: true
});


UserSchema.pre('save', async function (next) {
    // Only hash the password if it is new or has been modified
    if (!this.isModified('password') || this.password === null) return next();

    try {
        // Use bcrypt to hash the password
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});


UserSchema.methods.comparePassword = async function (candidatePassword) {
    // Use bcrypt to compare the candidate password with the stored hash
    if (this.password === null) return false; // Cannot compare if no password set (e.g., Google login)
    return bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);