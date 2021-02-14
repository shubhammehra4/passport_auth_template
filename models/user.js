const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true,
            required: true,
        },
        googleId: String,
        twitterId: String,
        picture: String,
    },
    {
        timestamps: true,
    }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
