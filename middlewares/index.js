const multer = require("multer");

const middleware = {};

middleware.apiKeyCheck = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
};

module.exports = middleware;