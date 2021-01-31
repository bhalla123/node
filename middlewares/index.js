const multer = require("multer");
const dotenv = require('dotenv').config();
const JWT = require('jsonwebtoken');
const middleware = {};
const db = require('../models');
const User = db.users;
require('dotenv').config();
const FuelPump = db.fuel_pumps;

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

middleware.isAdmin = async function(req, res, next) {
	var authToken = req.headers.authorization;

    //get login user
    var decoded = JWT.verify(authToken.split(' ')[1], process.env.JWT_SECRET);

    //make it from user id
    const getUser = await User.findOne({
        where: {
            id: decoded.id
        },
    });

    if(getUser.type == "admin"){
    	return next();
    }else{
    	res.status(412)
            .send({
                success: false,
                message: "You don't have permission to perform his action",
            });
    }

};

middleware.isOwner = async function(req, res, next) {
    var authToken = req.headers.authorization;

    //get login user
    var decoded = JWT.verify(authToken.split(' ')[1], process.env.JWT_SECRET);

    //make it from user id
    const getUser = await User.findOne({
        where: {
            id: decoded.id
        },
    });

    //Get fuel station
    const getPump = await FuelPump.findOne({
      where: {
        user_id: getUser.id
      },
    });

    if(getPump == null){
        var msg = "No fuel station associate with this user";
    }else{
        var msg = "You don't have permission to perform his action";
    }

    if((getUser.type == "owner" || getUser.type == "admin") && getPump != null){
        return next();
    }else{
        res.status(412)
            .send({
                success: false,
                message: msg,
            });
    }

};

middleware.isActive = async function(req, res, next) {
	var authToken = req.headers.authorization;

    //get login user
    var decoded = JWT.verify(authToken.split(' ')[1], process.env.JWT_SECRET);

    //make it from user id
    const getUser = await User.findOne({
        where: {
            id: decoded.id
        },
    });

    if(getUser.status == "active"){
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