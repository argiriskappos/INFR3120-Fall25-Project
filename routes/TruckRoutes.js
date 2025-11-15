const express = require('express');
const router = express.Router();

//Renders the truck creation form
router.get('/create', (req, res) => {
    // Renders create.ejs
    res.render('create', { 
        title: 'Register New Truck/Unit', 
        activePage: 'create' // Set active page for header styling
    });
});

// GET /requests - Placeholder for the View Trucks page
router.get('/requests', (req, res) => {
    // This is a placeholder for the page that lists all truck requests/orders
    res.send('<h1>Truck Requests List Page</h1><p>Work in progress. This route will render the list of all truck requests.</p>');
});

// GET /requests/:id - Placeholder for the Edit Truck page
router.get('/requests/:id', (req, res) => {
    // Placeholder logic - this would normally fetch the truck data and render the edit view
    const mockTruckData = { 
        id: req.params.id, 
        unitNumber: 'T-987', 
        driverName: 'Jane Smith', 
        origin: 'Detroit, MI', 
        destination: 'Chicago, IL', 
        cargoType: 'General Freight', 
        weightKg: 18000, 
        manifestSummary: 'BOL #9005: 20 Pallets of Auto Parts' 
    };
    res.render('edit', { 
        // NOTE: The template variable is kept as 'trip' in edit.ejs, so we use 'trip' here.
        trip: mockTruckData, 
        title: `Edit Truck Request: ${req.params.id}`,
        activePage: 'requests'
    });
});

module.exports = router;