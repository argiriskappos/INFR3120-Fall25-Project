const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import the Truck Model and User model
const Truck = require('../model/Truck.js'); 
const User = require('../model/User.js'); 

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
        successRedirect: '/index', 
        failureRedirect: '/login?error=Invalid%20Email%20or%20Password.',
        failureFlash: false 
    })
);

// Google OAuth
router.get('/auth/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login?error=Google%20Login%20Failed.' 
    }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/trucks');
    }
);

// Logout Route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login?message=You%20have%20been%20logged%20out.');
    });
});

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

        // Auto-login the user after registration
        req.login(newUser, function(err) {
            if (err) {
                console.error('Auto-login failed after signup:', err);
                return res.redirect('/login?error=Registration%20successful,%20but%20auto-login%20failed.%20Please%20log%20in.');
            }
            return res.redirect('/trucks?message=Registration%20Successful!%20Welcome.');
        });
        
    } catch (err) {
        console.error('Error in signup:', err);
        res.redirect('/signup?error=Registration%20failed.%20Please%20try%20again.');
    }
});

// Route to render the Create New Trip form
router.get('/create', ensureAuth, (req, res) => {
    res.render('create', {
        title: 'Log New Trip',
        activePage: 'create',
        error: req.query.error || null
    });
});

// Route to handle form submission and save the new truck/trip
router.post('/create', ensureAuth, async (req, res) => {
    try {
        // Assign the current authenticated user's ID to the trip
        const newTrip = new Truck({
            ...req.body,
            user: req.user.id
        });

        await newTrip.save();
        // Redirect to the list of trucks on success
        res.redirect('/trucks?message=Trip%20Logged%20Successfully');
    } catch (err) {
        console.error('Error logging new trip:', err);
        // Redirect back to the create page on error
        res.redirect('/create?error=Failed%20to%20log%20trip.%20Check%20your%20inputs.');
    }
});

// Route to list all active trips
router.get('/trucks', ensureAuth, async (req, res) => {
    try {
        // Fetch all trips from all users
        const trips = await Truck.find({})
            // FIX: Removed .populate('user') to prevent crashes 
            // caused by invalid/missing user IDs in the database.
            // The display will now rely on truck.driverName if truck.user.fullName is unavailable.
            .sort({ scheduledDeparture: 'desc' }) // Sort by departure date
            .lean(); 

        res.render('trucks', {
            trips, // Pass the list of trips to the EJS template
            title: 'Active Trip Manifests',
            activePage: 'trucks',
            message: req.query.message || null,
            error: req.query.error || null
        });
    } catch (err) {
        console.error('Error fetching trips for /trucks route:', err);
        // This catch block executes when the Mongoose query fails (likely due to invalid IDs)
        // and redirects to home. Removing .populate should fix this.
        res.redirect('/?error=Failed%20to%20load%20trip%20data%20due%20to%20a%20server%20error.');
    }
});

// Show edit page
router.get('/edit-trip/:id', ensureAuth, async (req, res) => {
    try {
        const trip = await Truck.findById(req.params.id).lean();
        
        if (!trip) return res.status(404).send('Trip not found');

        const error = req.query.error || null;
        
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

        // Perform the deletion
        await Truck.deleteOne({ _id: req.params.id });

        res.redirect('/trucks?message=Trip%20Deleted%20Successfully');
    } catch (err) {
        console.error('Error deleting trip:', err);
        res.redirect('/trucks?error=Failed%20to%20delete%20trip.');
    }
});

module.exports = router;