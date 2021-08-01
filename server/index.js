require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./models/user-model");
const authRoutes = require("./routes/auth-routes");
const cors = require("cors");
const { response } = require('express');
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const app = express();

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
                data: {
                  'housing': {'1/2021': 0},
                  'transportation': {'1/2021': 0},
                  'food': {'1/2021': 0},
                  'utilities': {'1/2021': 0},
                  'personalSpending': {'1/2021': 0},
                  'recreation': {'1/2021': 0}
              }
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

mongoose.connect("mongodb://localhost:27017/ffUserDB", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: "http://localhost:3000", //allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

app.use("/auth", authRoutes);

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
  
// if the user is logged in, send the profile data
// else, send a 401 response that the user is not authenticated
app.get("/", authCheck, (req, res) => {
    res.status(200).json({
      authenticated: true,
      message: "user successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
});

app.post("/submit", (req, res) => {
  console.log(req.user)
  const date = new Date(req.body.purchaseDate)
  const amt = req.body.amount;
  const category = req.body.categories
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  let dateString = month + "/" + year;

  User.findById(req.user.id, function(err, foundUser) {
    if(err) {
        console.log(err);
    } else {
        let modifiedData = foundUser.data[category];
        console.log(foundUser.data)
        if (dateString in modifiedData) {
          modifiedData[dateString]  = parseFloat(modifiedData[dateString]) + parseFloat(amt);
        } else {
          modifiedData[dateString] = parseFloat(amt);  
        }
        data = foundUser.data 
        data[category] = modifiedData;
        foundUser.data = data
        foundUser.markModified('data');
        foundUser.save(function(err) {
          if(!err) {
              console.log(foundUser);
          }
          else {
              console.log("Error: could not save user " + foundUser.data);
          }
          res.redirect(CLIENT_HOME_PAGE_URL)
      });
    }
  })
})

app.listen(4000, function(){
  console.log("Server started on port 4000.");
});
