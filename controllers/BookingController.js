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
const FuelPump = db.fuel_pumps;
const Fuel = db.fuels;
  
module.exports = {
  
  //pump list
  createBooking: async (req, res) => {
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

        let newObj = {
          fuel_pump_id: data.fuel_pump_id,
          user_id: user.id,
          booking_status:"requested"
        }

        const bookingObj = await Booking.create(newObj);

        if (bookingObj) {

          var newSlotObj = [];

          var slotObj = data.booking_slot;

          slotObj.forEach(function(item) {
            item['booking_id'] = bookingObj.id;
          });

          await BookingSlot.bulkCreate(slotObj);

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

  //get booking list
  bookingList: async (req, res) => {
    try {

      var userId = req.user.id;
      
      // get user
      const user = await User.findOne({
          where : {
            id : userId
          }
      });

      if (user) {

        //get fuel station id
        var fuelStationId = await FuelPump.findOne({
            where : {
              user_id : userId
            }
        });

        if(fuelStationId){
          // get pump listing
          const getlisting = await Booking.findAll({
            where : {
              fuel_pump_id: fuelStationId.id
            },
            include : [
              {
                model: FuelPump,
              },
            ],
            order : [
              [ 'id', 'DESC']
            ]
          });
          return responseHelper.get(res, getlisting, 'Fuel Pump listing')
        }else{
          return responseHelper.onError(res, 'error', 'No Fuel station associated with this user');
        }

      } else {
        return responseHelper.unauthorized(res);
      }
    } catch (err) {
      return responseHelper.onError(res, err, 'Error while listing');
    }
  },

  //update pump image
  updateFuelStation: async(req, res) => {
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
