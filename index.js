require("dotenv").config();
const express = require("express"),
    path = require("path"),
    morgan = require("morgan"),
    mongoose = require("mongoose"),
    ejsMate = require("ejs-mate"),
    session = require("express-session"),
    flash = require("connect-flash"),
    passport = require("passport");

const authRoutes = require("./routes/auth");

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 604800000,
        maxAge: 604800000,
    },
};

mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("tiny"));

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//! Passport Config
require("./config");

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get("/", (req, res) => {
    res.render("index");
});

app.use(authRoutes);

app.listen(process.env.PORT, function () {
    console.log(
        `Server is running on http://localhost:${process.env.PORT} in ${process.env.NODE_ENV} env`
    );
});
