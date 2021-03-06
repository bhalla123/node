const JWT = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../models')
const responseHelper = require('../helpers/responseHelper');
const helperFxn = require('../helpers/hashPasswords');
  
const User = db.users;
const Booking = db.bookings;
const BookingSlot = db.booking_slots;
const FuelPump = db.fuel_pumps;
const Fuel = db.fuels;
  
module.exports = {
  
  //pump list
  createBooking: async (req, res) => {
    
    const t = await db.sequelize.transaction();
    
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

        const bookingObj = await Booking.create(newObj, { transaction: t });

        if (bookingObj) {

          var newSlotObj = [];

          var slotObj = data.booking_slot;

          slotObj.forEach(function(item) {
            item['booking_id'] = bookingObj.id;
          });

          await BookingSlot.bulkCreate(slotObj, { transaction: t });
          await t.commit();
          return responseHelper.post(res, bookingObj, 'Booking created')
        } else {
          return responseHelper.Error(res, {}, 'Error in creating booking')
        }
      } else {
        return responseHelper.unauthorized(res);
      }
    } catch (err) {
      await t.rollback();
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
              {
                model: User,
                where:{"status":"active"}
              }
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
        if(files.length > 0){
          files.map( async c => {
              await FuelPump.update({
                image: c.filename,
              }, {
              where: {
                user_id: checkUser.dataValues.id
              }
            })
            .then(async ress=>{
            const getPump = await FuelPump.findOne({
              where: {
                user_id: checkUser.dataValues.id
              },
            });
            Promise.resolve(responseHelper.get(res, getPump, 'Pump image updated'));

          });
        });

      }else{
          await FuelPump.update({
                image: null,
              }, {
              where: {
                user_id: checkUser.dataValues.id
              }
            }).then(async ress=>{
              const getPump =  await FuelPump.findOne({
                where: {
                  user_id: checkUser.dataValues.id
                },
              });
            Promise.reject(responseHelper.get(res, getPump, 'Pump image updated'));
        });
      }
    }else{
    }}catch(err){
      return responseHelper.onError(res, err, 'Error while updating pump image');
    }
  }
}
