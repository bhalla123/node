const multer = require("multer");
const dotenv = require('dotenv').config();
const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/main');

const middleware = {};

middleware.apiKeyCheck = function(req, res, next) {
	var p_api_key = process.env.API_KEY;

    if(p_api_key == req.headers.apikey){
        return next();
    }else{
        res.status(412)
            .send({
                success: false,
                message: "Invalid Key",
            });
    }
};

middleware.isAdmin = function(req, res, next) {
	var authToken = req.headers.authorization;

    //get login user
    var decoded = JWT.verify(authToken.split(' ')[1], JWT_SECRET);

    if(decoded.role_name && decoded.role_name == "admin"){
    	return next();
    }else{
    	res.status(412)
            .send({
                success: false,
                message: "You don't have permission to perform his action",
            });
    }

};

middleware.isEmployee = function(req, res, next) {
	var authToken = req.headers.authorization;

    //get login user
    var decoded = JWT.verify(authToken.split(' ')[1], JWT_SECRET);

 
    if(decoded.role_name && decoded.role_name == "employee"){
     	return next();
    }else{
    	res.status(412)
            .send({
                success: false,
                message: "You don't have permission to perform his action",
                data: ""
            });
    }

};


middleware.isActive = function(req, res, next) {
	var authToken = req.headers.authorization;

    //get login user
    var decoded = JWT.verify(authToken.split(' ')[1], JWT_SECRET);

    if(decoded.status == "active"){
     	return next();
    }else{
    	res.status(412)
            .send({
                success: false,
                message: "You are account is suspended please talk to our customer support for further detail"
            });
    }

};

module.exports = middleware;