const JWT = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../models')
 const responseHelper = require('../helpers/responseHelper');
const helperFxn = require('../helpers/hashPasswords');
  
const User = db.users;
const Fuel = db.fuel;
const FuelPump = db.fuel_pump;

  
module.exports = {
  
  //pump list
  createPump: async (req, res) => {
    try {
      const data = req.body;
      const files = req.files

      var authToken = req.headers.authorization;

      //get login user
      var decoded = JWT.verify(authToken.split(' ')[1], process.env.JWT_SECRET);
      
      // get user
      const user = await User.findOne({
          where : {
            id : decoded.sub
          }
      });

      if (user) {

         
        const createPump = await FuelPump.create(data);

        if (createPump) {
          return responseHelper.post(res, createPump, 'Booking created')
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
