const JWT = require('jsonwebtoken');
const Sequelize = require('sequelize');
const ejs = require("ejs");
const Op = Sequelize.Op;
const db = require('../models')
const { JWT_SECRET } = require('../config/main');
const commonFunction = require('../helpers/commonFunction');
const responseHelper = require('../helpers/responseHelper');
const helperFxn = require('../helpers/hashPasswords');
const constant = require('../config/main');
 
const User = db.users;
const Booking = db.bookings;
const BookingSlot = db.booking_slots;
  
module.exports = {
  
  //pump list
  createBooking: async (req, res) => {
    try {
      const data = req.body;

      var authToken = req.headers.authorization;

      //get login user
      var decoded = JWT.verify(authToken.split(' ')[1], JWT_SECRET);
      
      // get user
      const user = await User.findOne({
          where : {
            id : decoded.sub
          }
      });

      if (user) {
        const bookingObj = await FuelPump.create(data);

        if (bookingObj) {
          return responseHelper.post(res, bookingObj, 'Booking created')
        } else {
          return responseHelper.Error(res, {}, 'Error in creating booking')
        }
      } else {
        return responseHelper.unauthorized(res);
      }
    } catch (err) {
      return responseHelper.onError(res, err, 'Error while creating booking');
    }
  },

  //get pump list
  pumpListing: async (req, res) => {
    try {
      const checkUser = req.user
      if (checkUser) {
        // get pump listing
        const getlisting = await FuelPump.findAll({
          where : {
           },
          include : [
            {
              model: Fuel,
            },
          ],
          order : [
            [ 'id', 'DESC']
          ]
        });
          return responseHelper.get(res, getlisting, 'Fuel Pump listing')
      } else {
        return responseHelper.unauthorized(res);
      }
    } catch (err) {
      return responseHelper.onError(res, err, 'Error while listing');
    }
  },

  //update pump image
  PumpImage: async(req, res) => {
    const files = req.files;
    const checkUser = req.user

    try{
      if(checkUser){
        files.map( async c => {
            await FuelPump.update({
              image: c.filename,
            }, {
            where: {
              id: checkUser.dataValues.id
            }
          });
        });

        const getPump = await FuelPump.findOne({
              where: {
                id: checkUser.dataValues.id
              },
            })
        return responseHelper.get(res, getPump, 'Pump image updated')
      }
    }catch(err){
      return responseHelper.onError(res, err, 'Error while updating pump image');
    }
  }
}
