exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please Login First!");
    res.redirect("/login");
};

exports.isLoggedOut = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Already Logged In!");
    res.redirect("/");
};
