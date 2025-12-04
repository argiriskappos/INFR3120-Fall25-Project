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


// Show the login page
router.get('/login', (req, res) => {
    // Pass error/message from query params
    res.render('login', {
        title: 'User Login',
        activePage: 'login',
        error: req.query.error || null,
        message: req.query.message || null
    });
});

// Handle user login submission
router.post('/login',
    // Call the local passport strategy
    passport.authenticate('local', {
        successRedirect: '/trucks', 
        failureRedirect: '/login?error=Invalid%20Email%20or%20Password.',
        failureFlash: false 
    })
);

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
        // After creation, redirect to login page
        res.redirect('/login?message=Registration%20successful!%20Please%20log%20in.');
    } catch (err) {
        console.error('Registration Error:', err);
        // Handle validation errors or other issues
        res.redirect('/signup?error=Registration%20failed.%20Please%20check%20your%20inputs.');
    }
});


// Logout route
router.get('/logout', (req, res, next) => {
    // Passport provides req.logout() to terminate the session
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/?message=You%20have%20been%20logged%20out.');
    });
});

// Show the form to create a new trip
router.get('/create', ensureAuth, (req, res) => {
    res.render('create', {
        title: 'Log New Trip',
        activePage: 'create',
        error: req.query.error || null
    });
});


// Handle new trip creation
router.post('/create-trip', ensureAuth, async (req, res) => {
    try {
        // Create the trip object and associate it with the current logged-in user
        const newTrip = {
            ...req.body,
            user: req.user.id // Link the trip to the user ID
        };
        
        await Truck.create(newTrip);
        res.redirect('/trucks?message=New%20Trip%20Logged%20Successfully');
    } catch (err) {
        console.error('Trip Creation Error:', err);
        // If it's a validation error, we can try to extract and pass the message
        let errorMsg = 'Failed to log trip. Please check all required fields.';
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            errorMsg = messages.join('; ');
        }
        res.redirect(`/create?error=${encodeURIComponent(errorMsg)}`);
    }
});

// Show all active trips
router.get('/trucks', ensureAuth, async (req, res) => {
    try {
        // Fetch all trips for all users
        const trips = await Truck.find({})
            .sort({ createdAt: 'desc' }) // Sort by creation date descending
            .populate('user', 'fullName') 
            .lean(); // Convert Mongoose documents to plain JavaScript objects

        res.render('trucks', {
            trips: trips,
            title: 'Active Fleet Manifests',
            activePage: 'trucks',
            error: req.query.error || null,
            message: req.query.message || null
        });
    } catch (err) {
        console.error('Error fetching trucks:', err);
        res.status(500).send('Error fetching truck manifest data.');
    }
});

// Show edit trip form
router.get('/edit-trip/:id', ensureAuth, async (req, res) => {
    const error = req.query.error || null;
    try {
        const trip = await Truck.findById(req.params.id).lean();

        if (!trip) return res.status(404).send('Trip not found');

        res.render('edit', {
            trip,
            title: `Edit Trip: ${trip.truckId}`,
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
        res.redirect(`/edit-trip/${req.params.id}?error=Failed%20to%20update%20trip.%20Check%20your%20inputs.`);
    }
});

// Delete trip
router.post('/delete-trip/:id', ensureAuth, async (req, res) => {
    try {
        let trip = await Truck.findById(req.params.id);

        if (!trip) return res.status(404).send('Trip not found');
        await Truck.deleteOne({ _id: req.params.id });
        
        res.redirect('/trucks?message=Trip%20Deleted%20Successfully');
    } catch (err) {
        console.error('Error deleting trip:', err);
        res.redirect('/trucks?error=Failed%20to%20delete%20trip.');
    }
});

module.exports = router;