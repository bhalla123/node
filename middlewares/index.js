const multer = require("multer");
const dotenv = require('dotenv').config();
const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/main');

const middleware = {};

middleware.apiKeyCheck = function(req, res, next) {
	//console.log("njj", process.env.API_KEY);
    return next();
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
                data: ""
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


middleware.isUser = function(req, res, next) {
	var authToken = req.headers.authorization;

    //get login user
    var decoded = JWT.verify(authToken.split(' ')[1], JWT_SECRET);

 
    if(decoded.role_name && decoded.role_name == "user"){
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

module.exports = middleware;