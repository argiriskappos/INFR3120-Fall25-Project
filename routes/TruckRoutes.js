const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import the Truck Model and User model
const Truck = require('../model/Truck'); 
const User = require('../model/User'); 

// This function ensures only authenticated users can proceed.
function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // Redirect to login with an error message if not authenticated
    res.redirect('/login?error=Please%20log%20in%20to%20access%20that%20page.');
}


// Show the form page where the user can sign up
router.get('/signup', (req, res) => {
    res.render('SignUp', {
        title: 'User Registration',
        activePage: 'SignUp',
        error: req.query.error || null
    });
});

// Handle user registration submission
router.post('/signup', async (req, res) => {
    try {
        const { email, password, fullName, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.redirect('/signup?error=An%20account%20with%20this%20email%20already%20exists.');
        }

        const newUser = await User.create({ email, password, fullName, role });

        console.log(`New user registered: ${newUser.email}`);

        // Automatically log in the user after successful registration using Passport's login method
        req.logIn(newUser, (err) => {
            if (err) {
                console.error("Auto-login error after signup:", err);
                return res.redirect('/login');
            }
            res.redirect('/');
        });

    } catch (err) {
        let errorMessage = 'Registration failed. Please check your inputs.';

        if (err.code === 11000) {
            errorMessage = 'An account with this email already exists.';
        } else if (err.errors) {
            const validationKeys = Object.keys(err.errors);
            errorMessage = err.errors[validationKeys[0]].message || errorMessage;
        } else {
            errorMessage = err.message || errorMessage;
        }

        res.render('SignUp', {
            title: 'User Registration',
            activePage: 'SignUp',
            error: errorMessage,
        });
    }
});


// Show login page
router.get('/login', (req, res) => {
    // Check for query parameters for error messages
    const error = req.query.error || req.flash('error')?.[0] || null;

    res.render('login', {
        title: 'User Login',
        activePage: 'login',
        error: error
    });
});

// Handle local login submission
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login?error=Invalid%20email%20or%20password.',
        failureFlash: true
    })
);


// Google Auth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Auth Callback
router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login?error=Google%20Sign-in%20Failed',
        failureFlash: true
    }),
    (req, res) => {
        res.redirect('/');
    }
);


// Logout User
router.get('/logout', (req, res) => {
    // Passport's logout functionality
    req.logout(err => {
        if (err) {
            console.error("Logout error:", err);
        }
        // Destroy the session and redirect
        req.session.destroy(err => {
            if (err) {
                console.error("Session destroy error:", err);
            }
            res.redirect('/login?message=You%20have%20been%20logged%20out.');
        });
    });
});

// Show form to create a new trip/truck request
router.get('/create', ensureAuth, (req, res) => {
    res.render('create', {
        title: 'Log New Trip',
        activePage: 'create',
        trip: null // For a new form
    });
});


// Handle new trip/truck request submission
router.post('/create', ensureAuth, async (req, res) => {
    try {

        const newTrip = await Truck.create(req.body);

        console.log(`New trip logged: ${newTrip._id}`);

        res.redirect('/trucks?message=Trip%20Logged%20Successfully');

    } catch (err) {
        console.error('Error logging new trip:', err);
        
        // Handle validation errors or database issues
        res.render('create', { 
            title: 'Log New Trip',
            activePage: 'create',
            error: 'Failed to log trip. Check required fields or try again.',
            trip: req.body 
        });
    }
});


// Show all tracked trips
router.get('/trucks', ensureAuth, async (req, res) => {
    try {
        // Fetch all trips in the system (removed filtering by user)
        const trips = await Truck.find({}).lean().sort({ createdAt: 'desc' });
        
        // Extract message from query params if available
        const message = req.query.message || null;
        const error = req.query.error || null; // For unauthorized errors

        res.render('trucks', {
            trips,
            title: 'Active Trip Manifests',
            activePage: 'trucks',
            message: message,
            error: error
        });
    } catch (err) {
        console.error('Error loading tracked trucks:', err);
        res.status(500).send('Error loading tracked trucks.');
    }
});

// Load single truck for editing
router.get('/requests/:id', ensureAuth, async (req, res) => {
    try {
        const trip = await Truck.findById(req.params.id).lean();
        
        if (!trip) return res.status(404).send('Trip not found');
        
        const error = req.query.error || null;

        res.render('edit', {
            trip,
            title: `Edit Trip: ${trip.unitNumber || trip._id}`,
            activePage: 'trucks',
            error: error
        });
    } catch (err) {
        console.error('Error loading trip:', err);
        res.status(500).send('Error loading trip.');
    }
});

// Save edited trip
router.post('/update-trip/:id', ensureAuth, async (req, res) => {
    try {
        let trip = await Truck.findById(req.params.id);
        
        if (!trip) return res.status(404).send('Trip not found');

        await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.redirect('/trucks?message=Trip%20Updated%20Successfully');
    } catch (err) {
        console.error('Error updating trip:', err);
        // Redirect back to the edit page on error
        res.redirect(`/requests/${req.params.id}?error=Failed%20to%20update%20trip.%20Check%20your%20inputs.`);
    }
});

// Delete trip
router.post('/delete-trip/:id', ensureAuth, async (req, res) => {
    try {
        let trip = await Truck.findById(req.params.id);

        if (!trip) return res.status(404).send('Trip not found');

        
        await Truck.findByIdAndDelete(req.params.id);
        res.redirect('/trucks?message=Trip%20Deleted%20Successfully');
    } catch (err) {
        console.error('Error deleting trip:', err);
        res.status(500).send('Error deleting trip.');
    }
});


module.exports = router;
