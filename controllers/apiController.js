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
const BaseThumbNailUrl = require('../config/main').thumbnailUrl;

const User = db.users;
const Booking = db.bookings;
const Document = db.documents;

signtoken = user => {
  return JWT.sign({
    id: user.dataValues.id,
    role_name: user.dataValues.type
  }, JWT_SECRET);
}

//start associations //
Booking.belongsTo(User, { foreignKey: 'user_id' })
//end associations //

module.exports = {

  // user signup
  signup: async (req, res) => {
    try {
      const data = req.body;

      //check Email 
      const checkEmail = await User.findOne({
        attributes: ['id', 'email'],
        where: {
          email: data.email
        }
      });

      if (checkEmail) {
        return responseHelper.Error(res, {}, 'Email is already used, Please select another')
      }
     
      let newPassword = await helperFxn.generatePass(data.password);

      let newObj = {
        first_name: data.first_name ,
        last_name: data.last_name ,
        email: data.email,
        password: newPassword,
        phone_number: data.phone_number,
        type:data.type,
      }

      const createUser = await User.create(newObj);
      if (createUser) {
        const getUser = await User.findOne({
          where: {
            id: createUser.dataValues.id
          },
        })
        const access_token = signtoken(getUser)
        delete getUser.dataValues.password;
        getUser.dataValues.access_token = access_token;
        return responseHelper.post(res, getUser, 'User Registered');
      } else {
        return responseHelper.Error(res, {}, 'Error in registering user')
      }
    } catch (err) {
      return responseHelper.onError(res, err, 'Error while registering User');
    }

  },

  // login
  login: async (req, res) => {
    try {
      const data = req.body;
      // Match email
      const user = await User.findOne({
        attributes: ['id', 'email', 'password'],
        where: {
          email: data.email
        },
        include:[

        ]
      });

      console.log(user);
      if (user) {
        // Match password
        const isMatch = await helperFxn.comparePass(data.password, user.dataValues.password);
        if (!isMatch) {
          return responseHelper.Error(res, {}, 'Invalid login details')
        }
        
        const getUser = await User.findOne({
          where: {
            id: user.dataValues.id
          },
        })

        const access_token = signtoken(getUser)
        delete getUser.dataValues.password;
        getUser.dataValues.access_token = access_token;
        return responseHelper.post(res, getUser, 'User Successfully logged in');
      } else {
        return responseHelper.Error(res, {}, 'Invalid login details')
      }

    } catch (err) {
      return responseHelper.onError(res, err, 'Error while logging In');
    }
  },


  // LOGOUT
  logout: async (req, res) => {
    try {
      const checkUser = req.user;
      if (checkUser) {
        await User.update({
          deviceToken: '',
        }, {
          where: {
            id: checkUser.dataValues.id
          }
        });
        return responseHelper.post(res, {}, 'User successfully logged out');
      } else {
        return responseHelper.unauthorized(res);
      }
    } catch (err) {
      return responseHelper.onError(res, err, 'Error while logging out of the app');
    }
  },
  
  //booking
  createBooking: async (req, res) => {
    try {
      const data = req.body;
      const files = req.files

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

        let bookingObj = {
          user_id: user.id,
          petrol_pump_id: data.station_id,
          filler_type: data.filler_type,
        }
        const createBooking = await Booking.create(bookingObj);

        if (createBooking) {
          return responseHelper.post(res, createBooking, 'Booking created')
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
  vaultListing: async (req, res) => {
    try {
      const checkUser = req.user
      if (checkUser) {
        // get vault listing
        const getVault = await Vault.findAll({
          where : {
            userId : checkUser.dataValues.id
          },
          include : [
            {
              model: User, attributes: ['id', 'userName', 'email'],
            },
            {
              model: VaultFile, attributes: ['id', 'vaultId', 'file'],
            },
          ],
          order : [
            [ 'id', 'DESC']
          ]
        });
          return responseHelper.get(res, getVault, 'Vault listing')
      } else {
        return responseHelper.unauthorized(res);
      }
    } catch (err) {
      return responseHelper.onError(res, err, 'Error while listing vaults');
    }
  },

  //update status
  updateStatus: async(req, res) => {
    try {

      var data = req.body;

      // get user
      const user = await User.findOne({
          where : {
            id : data.user_id
          }
      });

      if (user){
        await User.update({
              status: data.status,
            }, {
            where: {
              id: data.user_id
            }
          });

        const getUser = await User.findOne({
          where: {
            id: user.dataValues.id
          },
        })

        return responseHelper.get(res, getUser, 'Status updated successfully')
      }else{
        return responseHelper.Error(res, {}, 'User does not exist')
      }

    }catch(err){
      return responseHelper.onError(res, err, 'Error while updating user status');
    }
  },

  //update profile image
  userProfileImage: async(req, res) => {
    const files = req.files;
    const checkUser = req.user

    try{
      if(checkUser){
        files.map( async c => {
            await User.update({
              image: c.filename,
            }, {
            where: {
              id: checkUser.dataValues.id
            }
          });
        });

        const getUser = await User.findOne({
              where: {
                id: checkUser.dataValues.id
              },
            })
        return responseHelper.get(res, getUser, 'User profile updated')
      }
    }catch(err){
      return responseHelper.onError(res, err, 'Error while updating profile image');
    }
  }
}
