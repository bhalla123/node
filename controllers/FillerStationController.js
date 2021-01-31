const JWT = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../models')
 const responseHelper = require('../helpers/responseHelper');
const helperFxn = require('../helpers/hashPasswords');
  
const User = db.users;
const Fuel = db.fuels;
const FuelPump = db.fuel_pumps;

  
module.exports = {
  
  //pump list
  createStation: async (req, res) => {
    try {

      const data = req.body;

      var userId = req.user.id;
      
      // get user
      const user = await User.findOne({
          where : {
            id : userId
          }
      });

      if (user) {
        req.body.user_id = user.id;

        const bookingObj = await FuelPump.create(req.body);

        if (bookingObj) {
          return responseHelper.post(res, bookingObj, 'Fuel station created')
        } else {
          return responseHelper.Error(res, {}, 'Error in creating fuel station')
        }
      } else {
        return responseHelper.unauthorized(res);
      }
    } catch (err) {
      return responseHelper.onError(res, err, 'Error while creating fuel station');
    }
  },

  listing: async (req, res) => {
    try{
      const latitude =req.body.latitude;
      const longitude =req.body.longitude;

      const result =  await db.sequelize.query("SELECT *, ( 6371 * acos ( cos ( radians("+ latitude +") ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians("+ longitude +") ) + sin ( radians("+ latitude +") ) * sin( radians( latitude ) ) ) ) AS distance FROM fuel_pumps HAVING distance < 30 ORDER BY distance LIMIT 0 , 20", { type: Sequelize.QueryTypes.SELECT})
  
      return responseHelper.post(res, result, 'Listing of nearest pump station') ;
    }
    catch (err) {
      return responseHelper.onError(res, err, 'Error while getting pump station listing');
    }
  },
}
