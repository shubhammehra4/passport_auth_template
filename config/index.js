const passport = require("passport"),
    GoogleStrategy = require("passport-google-oauth20").Strategy,
    TwitterStrategy = require("passport-twitter").Strategy,
    FacebookStrategy = require("passport-facebook").Strategy,
    LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(new LocalStrategy(User.authenticate()));

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            const googleId = profile.id;
            const foundUser = await User.findOne({ googleId });
            if (foundUser) {
                done(null, foundUser);
            } else {
                const { name, email, picture, given_name } = profile._json;
                const user = new User({
                    name,
                    email,
                    picture,
                    googleId,
                    username: given_name.toLowerCase() + googleId,
                });
                const newUser = await User.create(user);
                done(null, newUser);
            }
        }
    )
);

passport.use(
    new TwitterStrategy(
        {
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: "/auth/twitter/callback",
        },
        function (token, tokenSecret, profile, cb) {
            console.log(profile);
            return cb(null, profile);
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: "/auth/facebook/callback",
        },
        function (accessToken, refreshToken, profile, cb) {
            console.log(profile);
            return cb(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});
