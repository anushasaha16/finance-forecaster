require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const cors = require("cors");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

mongoose.connect("mongodb://localhost:27017/ffUserDB", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  data: Object
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate)

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
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
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);  
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/auth/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});

app.get("/auth/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

app.get('/auth/google', 
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

app.get('/auth/google/financeforecaster', 
  passport.authenticate('google', { failureRedirect: CLIENT_HOME_PAGE_URL }),
  function(req, res) {
    res.redirect(CLIENT_HOME_PAGE_URL);
});

app.get("/auth/logout", function(req, res) {
    req.logout();
    res.redirect(CLIENT_HOME_PAGE_URL)
})

app.get(
    "/auth/google/redirect",
    passport.authenticate("google", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);

const authCheck = (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        authenticated: false,
        message: "user has not been authenticated"
      });
    } else {
      next();
    }
};
  
// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page
app.get("/", authCheck, (req, res) => {
    res.status(200).json({
      authenticated: true,
      message: "user successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
});

app.listen(4000, function(){
  console.log("Server started on port 4000.");
});
