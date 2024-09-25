const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/userModel'); // Adjust the path as needed

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  // Check if user already exists in our db
  const existingUser = await User.findOne({ googleId: profile.id });
  if (existingUser) {
    // Already have the user
    return done(null, existingUser);
  }
  
  // If not, create a new user
  const newUser = new User({
    googleId: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value
  });
  await newUser.save();
  done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
