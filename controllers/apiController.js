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
const BaseThumbNailUrl = require('../config/main').thumbnailUrl

const User = db.users;
const Role = db.roles;
const Booking = db.bookings;
const Document = db.documents;

signtoken = user => {
  return JWT.sign({
    sub: user.dataValues.id,
  }, JWT_SECRET);
}

//start associations //
Booking.belongsTo(User, { foreignKey: 'user_id' })
Booking.hasMany(Document, { foreignKey: 'type_id' })
Role.hasMany(Role, { foreignKey: 'user_id' })
//end associations //

module.exports = {

  // user signup
  signup: async (req, res) => {
    try {
      const data = req.body;

      //const files = req.file;
      // check Email 
      const checkEmail = await User.findOne({
        attributes: ['id', 'email'],
        where: {
          email: data.email
        }
      })
      if (checkEmail) {
        return responseHelper.Error(res, {}, 'Email is already used, Please select another')
      }
     
      let newPassword = await helperFxn.generatePass(data.password);

      let newObj = {
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email,
        password: newPassword,
        phone_number: data.phone_number || '',
      }
      const createUser = await User.create(newObj);
      if (createUser) {
        const getUser = await User.findOne({
          where: {
            id: createUser.dataValues.id
          },
        })

        //Create user role
        {
          let roleObj = {
            user_id: getUser.id,
            name: data.role_name,
          }

          const createRole = await Role.create(roleObj);
        }

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
        }
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

  // forgot Password 
  forgotPassword: async (req, res) => {
    try {
      const data = req.body;
      // check email
      const checkEmail = await User.findOne({
        attributes: ['id', 'email','userName'],
        where: {
          email: data.email,
        }
      });
      if (checkEmail) {
        let rndm = await commonFunction.createRandomValue();
        let mail = {
          from: constant.emailFrom,
          to: checkEmail.dataValues.email,
          subject: constant.emailSubject,
          //html: `Click here to change password <a href="${constant.baseUrl}api/reset-password/${rndm}"> Click</a>`
          html: `<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet"/><script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script><script src="//code.jquery.com/jquery-1.11.1.min.js"></script><div style="font-family: Helvetica Neue, Helvetica, Helvetic, Arial, sans-serif"><table style="width: 100%"><tr><td></td><td bgcolor="#FFFFFF "><div style="padding: 15px; max-width: 600px;margin: 0 auto;display: block; border-radius: 0px;padding: 0px; border: 1px solid blue"><table style="width: 100%;background: #F66801 "><tr><td></td><td><div><table width="100%"><tr><td rowspan="2" style="text-align:center;padding:10px"><img src="${constant.imageUrl}time-secured.jpg" style="width: 130px; height: auto"/></td></tr></table></div></td><td></td></tr></table><table style="padding: 10px;font-size:14px; width:100%"><tr><td style="padding:10px;font-size:14px; width:100%"><p><br/> Hi <b>${checkEmail.dataValues.userName}</b>!</p> <p>Forgot your password?</p> <p>No worries, please click <a href="${constant.baseUrl}api/reset-password/${rndm}"> here</a> to reset your password or you can ignore if already changed. </p> <p>Best Regards,</p><p>Team Time Secured</p></td></tr>                        <tr><td><div align="center" style="font-size:12px; margin-top:20px; padding:5px; width:100%; background:#eee">ⓒ  <a style="text-decoration:none" >Time Secured </a> Copyright 2020 </div></td></tr></table></div></td></tr></table></div>`

        };
        await User.update({
          forgotPassword: rndm
        }, {
          where: {
            id: checkEmail.dataValues.id
          }
        });
        // send mail
        commonFunction.sendMail(mail);
        return responseHelper.post(res, {},'Email sent, Please check your inbox');

      } else {
        return responseHelper.Error(res, {}, 'Email not found')
      }
    } catch (err) {
      return responseHelper.onError(res, err, 'Error while resetting password ');
    }
  },

  // click on Url
  apiUrl: async (req, res) => {
    try {
      const data = req.params;
      const checkUser = await User.findOne({
        where: {
          forgotPassword: data.id
        }
      });
      if (checkUser) {
        res.render('resetPassword', {
          response: checkUser,
          flash: "",
          hash: data.id,
          layout: 'resetPassword'
        });
      } else {
        res.send("Link has been expired!");
      }
    } catch (err) {
      console.log(err);
    }
  },

  // reset Password
  changePassword: async (req, res) => {
    try {
      const data = req.body;
      let newPassword = await helperFxn.generatePass(data.confirm_password);
      const updatePassword = await User.update({
        password: newPassword
      }, {
        where: {
          forgotPassword: data.hash
        }
      });
      if (updatePassword) {
        res.send('Password changed successfully, Please login to app');
      } else {
        res.send('Invalid User');
      }
    } catch (e) {
      console.log(e);
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
      //const authUser = j
      
      //return;
      if (checkUser) {

        let newObj = {
          userId: checkUser.dataValues.id,
          name: data.name,
          phoneNumber: data.phoneNumber,
          beneficiaries: data.beneficiaries,
          triggerType: data.triggerType,  // 1=> passing, 2=> time passing
          triggerDate: data.triggerDate,
          triggerTime: data.triggerTime,
          triggerDateTimeStamp: newTriggerDate,
          alertDuration: data.alertDuration, // 1=> 3 days , 2=> 1 week
          notes: data.notes, 
        }
        const createVault = await Vault.create(newObj);
        if (createVault) {
          // add files if any
          if (files) {
            files.map( async c => {
              await VaultFile.create({
                userId : checkUser.dataValues.id,
                vaultId : createVault.dataValues.id,
                file : c.filename
              })
            })
          }
          return responseHelper.post(res, createVault, 'Vault added')
        } else {
          return responseHelper.Error(res, {}, 'Error in adding vault')
        }
      } else {
        return responseHelper.unauthorized(res);
      }
    } catch (err) {
      return responseHelper.onError(res, err, 'Error while adding vault');
    }
  },

  // get vault list
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

  // user profile
  userProfile: async (req, res) => {
    try {
      const checkUser = req.user;
      const userId = req.query.userId;
      if (checkUser) {
        // get vault listing
        const getUser = await User.findOne({
          where : {
            id : userId
          }
        });
        if(getUser) {
          delete getUser.dataValues.password
          delete getUser.dataValues.forgotPassword
          return responseHelper.get(res, getUser, 'User profile')
        } else {
          return responseHelper.Error(res, {}, 'User not found')  
        }
      } else {
        return responseHelper.unauthorized(res);
      }
    } catch (err) {
      return responseHelper.onError(res, err, 'Error while getting user profile');
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
