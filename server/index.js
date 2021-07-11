require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const authRoutes = require("./routes/auth-routes");
const cors = require("cors");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const app = express();

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
  console.log(req)
  const date = new Date(req.body.purchaseDate)
  console.log(date);
  console.log(typeof(date))
  const amt = req.body.amount;
  console.log(amt)

  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  let dateString = month + "/" + year;

  User.findById(req.user.id, function(err, foundUser) {
    if(err) {
        console.log(err);
    } else {
        let modifiedData = foundUser.data;
        console.log(modifiedData)
        if (dateString in modifiedData) {
          modifiedData[dateString]  = parseFloat(modifiedData[dateString]) + parseFloat(amt);
          console.log(modifiedData[dateString])
        } else {
          modifiedData[dateString] = parseFloat(amt);  
          console.log(modifiedData)
          console.log(modifiedData[dateString])
        }
        foundUser.data = modifiedData;
        console.log(foundUser);
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
