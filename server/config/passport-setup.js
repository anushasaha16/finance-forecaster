require('dotenv').config();
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/user-model");

passport.use(User.createStrategy());

//serialize user.id so browser will remember the user when they login
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/financeforecaster",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, done) {
    //check user table for anyone with a facebook ID of profile.id
    User.findOne({
      googleId: profile.id 
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        //If no user was found, create a new user with values from Google profile
        if (!user) {
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                data: {'1/2021': 0}
            });
            user.save(function(err) {
                if (err) 
                  console.log(err);
                return done(err, user);
            });
        } else {
            return done(err, user);
        }
    });
}))

