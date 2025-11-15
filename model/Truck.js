const mongoose = require('mongoose');

// Define the schema for the Truck/Trip object.
// The fields correspond directly to the inputs in the create.ejs form.
const TruckSchema = new mongoose.Schema({
    // Trip Details
    tripName: {
        type: String,
        required: [true, 'A trip name or route is required.'],
        trim: true
    },
    truckId: {
        type: String,
        required: [true, 'Truck/Unit ID is required.'],
        trim: true
    },
    driverName: {
        type: String,
        required: [true, 'Driver name is required.'],
        trim: true
    },

    // Schedule
    scheduledDeparture: {
        type: Date,
        required: [true, 'A scheduled departure date is required.']
    },
    estimatedArrival: {
        type: Date,
        required: [true, 'An estimated arrival date is required.']
    },

    // Cargo Manifest Details
    cargoType: {
        type: String,
        required: [true, 'Cargo type is required.'],
        enum: [
            'General Freight', 
            'Refrigerated Goods (Perishables)', 
            'Bulk Liquid', 
            'Hazardous Materials',
            'Other'
        ] // Restricting inputs to valid types
    },
    weightKg: {
        type: Number,
        min: 0,
        // Not marked as 'required' since it has a default, but form validation should ensure it's provided.
        default: 0
    },
    manifestSummary: {
        type: String,
        required: [true, 'Manifest details are required.'],
        trim: true
    },

    // Status (Automatically set when created)
    status: {
        type: String,
        enum: ['Scheduled', 'In Transit', 'Delayed', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    
    // Automatic Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Mongoose Model.
module.exports = mongoose.model('Truck', TruckSchema);