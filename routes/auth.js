const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");
const { isLoggedIn, isLoggedOut } = require("../middlewares/authorization");

router.get("/register", isLoggedOut, (req, res) => {
    res.render("register");
});

router.post("/register", isLoggedOut, async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = new User({ name, email, username });
        const NewUser = await User.register(user, password);
        req.login(NewUser, (err) => {
            if (err) {
                req.flassh("error", err);
                res.redirect("/register");
            }
            req.flash("success", "Welcome New User!");
            res.redirect("/");
        });
    } catch (err) {
        if (err.code == 11000) {
            req.flash("error", "Email is already registered!");
            res.redirect("/register");
        } else {
            req.flash("error", err.message);
            res.redirect("/register");
        }
    }
});

router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
        req.flash("success", "Welcome New Google User!");
        res.redirect("/");
    }
);

router.get("/auth/twitter", passport.authenticate("twitter"));

router.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/");
    }
);

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/");
    }
);

router.get("/login", isLoggedOut, (req, res) => {
    res.render("login");
});

router.post(
    "/login",
    isLoggedOut,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome Back!");
        res.redirect("/");
    }
);

router.get("/logout", isLoggedIn, (req, res) => {
    req.logout();
    req.flash("success", "Logged You Out");
    res.redirect("/");
});

router.get("/secret", isLoggedIn, (req, res) => {
    res.send("Man you've done it!");
});

module.exports = router;
