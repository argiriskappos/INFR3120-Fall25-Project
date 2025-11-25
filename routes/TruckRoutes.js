// TruckRoutes.js

const express = require('express');
const router = express.Router();

// Import the Truck Model and User model
const Truck = require('../model/Truck');
const User = require('../model/User');


// SIGN UP ROUTES


// Show the form page where the user can sign up
router.get('/signup', (req, res) => {
    res.render('SignUp', {
        title: 'User Registration',
        activePage: 'SignUp',
        error: null
    });
});

// Handle user registration submission
router.post('/signup', async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        console.log(`New user registered: ${newUser.email}`);

        req.session.User = {
            _id: newUser._id,
            fullName: newUser.fullName,
            role: newUser.role,
        };

        res.redirect('/');

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
            activePage: 'signup',
            error: errorMessage
        });
    }
});


// LOGIN ROUTES


// Show login form
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        activePage: 'login',
        error: null
    });
});

// Handle login submission
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('login', {
                title: 'Login',
                activePage: 'login',
                error: 'User not found'
            });
        }

        if (user.password !== password) {
            return res.render('login', {
                title: 'Login',
                activePage: 'login',
                error: 'Incorrect password'
            });
        }

        req.session.User = {
            _id: user._id,
            fullName: user.fullName,
            role: user.role
        };

        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.render('login', {
            title: 'Login',
            activePage: 'login',
            error: 'Login failed'
        });
    }
});

// LOGOUT ROUTE


router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// TRUCK ROUTES


// Show the form page where the user can create a truck
router.get('/create', (req, res) => {
    res.render('create', {
        title: 'Register New Truck/Unit',
        activePage: 'create'
    });
});

// Save a new truck when the form is submitted
router.post('/create', async (req, res) => {
    try {
        const newTruck = new Truck({
            tripName: req.body.tripName,
            truckId: req.body.truckId,
            driverName: req.body.driverName,
            scheduledDeparture: req.body.scheduledDeparture,
            estimatedArrival: req.body.estimatedArrival,
            cargoType: req.body.cargoType,
            weightKg: req.body.weightKg,
            manifestSummary: req.body.manifestSummary,
            status: "Scheduled"
        });

        await newTruck.save();
        res.redirect('/trucks');

    } catch (err) {
        console.error("Error saving truck:", err);
        res.status(400).send("Error: " + err.message);
    }
});

// Show all trucks
router.get('/trucks', async (req, res) => {
    try {
        const trucks = await Truck.find().sort({ createdAt: -1 });

        res.render('trucks', {
            title: 'Tracked Trucks',
            activePage: 'trucks',
            trucks
        });
    } catch (err) {
        console.error('Error fetching trucks:', err);
        res.status(500).send('Error loading tracked trucks.');
    }
});

// Requests page
router.get('/requests', (req, res) => {
    res.send('<h1>Truck Requests List Page</h1><p>Work in progress.</p>');
});

// Load single truck for editing
router.get('/requests/:id', async (req, res) => {
    try {
        const trip = await Truck.findById(req.params.id);

        if (!trip) {
            return res.status(404).send('Trip not found');
        }

        res.render('edit', {
            trip,
            title: `Edit Truck Request: ${trip.id}`,
            activePage: 'trucks'
        });
    } catch (err) {
        console.error('Error loading trip:', err);
        res.status(500).send('Error loading trip.');
    }
});

// Save edited truck
router.post('/requests/:id', async (req, res) => {
    try {
        await Truck.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/trucks');
    } catch (err) {
        console.error('Error updating truck:', err);
        res.status(500).send('Error updating truck.');
    }
});

module.exports = router;

