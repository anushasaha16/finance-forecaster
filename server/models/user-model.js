const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleId: String,
    data: Object
})

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

module.exports = User;