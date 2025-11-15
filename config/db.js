const mongoose = require('mongoose');

/**
 * Connects the application to the MongoDB database.
 * It uses the MONGO_URI from the environment variables
 */
const connectDB = async () => {
    try {
        // Attempt to connect using the URI stored in the .env file
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Options to prevent deprecation warnings
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`\n✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If connection fails, log the error and exit the application
        console.error(`\n❌ Error connecting to MongoDB: ${error.message}`);
        // Exit process with failure (0 is success, 1 is failure)
        process.exit(1);
    }
};

module.exports = connectDB;