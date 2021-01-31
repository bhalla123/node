const JWT = require('jsonwebtoken');
const Sequelize = require('sequelize');
require('dotenv').config();
const Op = Sequelize.Op;
const db = require('../models')
const responseHelper = require('../helpers/responseHelper');
const helperFxn = require('../helpers/hashPasswords');
 
const User = db.users;
const Booking = db.bookings;
 
signtoken = user => {
  return JWT.sign({
    id: user.dataValues.id,
    role_name: user.dataValues.type,
  }, process.env.JWT_SECRET);
}

  
module.exports = {

  // user signup
  signup: async (req, res) => {
    try {
      const data = req.body;

      //check Email 
      const checkEmail = await User.findOne({
        attributes: ['id', 'email', 'status'],
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
        attributes: ['id', 'email', 'password', 'status'],
        where: {
          email: data.email
        }
      });

      if(user.status == "block" || user.status == "deleted"){
        return responseHelper.Error(res, {}, 'You are account is suspended please talk to our customer support for further detail')
      }

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
        if(files.length > 0){
          files.map( async c => {
              await User.update({
                image: c.filename,
              }, {
              where: {
                id: checkUser.dataValues.id
              }
            })
            .then(async ress=>{
            const getUser = await User.findOne({
              where: {
                id: checkUser.dataValues.id
              },
            });
            Promise.resolve(responseHelper.get(res, getUser, 'user image updated'));

          });
        });

      }else{
          await User.update({
                image: null,
              }, {
              where: {
                id: checkUser.dataValues.id
              }
            }).then(async ress=>{
              const getUser =  await User.findOne({
                where: {
                  id: checkUser.dataValues.id
                },
              });
            Promise.reject(responseHelper.get(res, getUser, 'user image updated'));
        });
      }
    }else{
    }}catch(err){
      return responseHelper.onError(res, err, 'Error while updating pump image');
    }
  }
}
