const LocalStrategy = require("passport-local").Strategy; // 👈 ADDED
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/User");

module.exports = function (passport) {
  
  // LOCAL STRATEGY
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
          // If user is not found, return false
          return done(null, false, { message: "Incorrect email." });
        }

        // Compare the provided password with the stored hash
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          // If password doesn't match, return false
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        // Internal server error
        console.error("Local Strategy Error:", err);
        // Pass the error to Passport, which will trigger a 500 Internal Server Error
        return done(err); 
      }
    })
  );


  // GOOGLE STRATEGY
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://truck-shipment-managment.onrender.com/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              fullName: profile.displayName,
              email,
              password: null,
              role: "Driver",
              googleId: profile.id
            });
          }

          return done(null, user);
        } catch (error) {
          console.error("Google Strategy Error:", error);
          done(error, null);
        }
      }
    )
  );


  // Added error handling to deserialize

  passport.serializeUser((user, done) => {
    // Stores the user ID in the session
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
        // Retrieves the full user object from the database using the ID stored in the session
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        // CRITICAL FIX: Handles potential database errors during user retrieval
        console.error("Deserialize User Error:", err); 
        done(err);
    }
  });
};