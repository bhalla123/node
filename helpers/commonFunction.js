var FCM = require('fcm-node');
var serverKey = ''; //put your server key here
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const constant = require('../config/main');
var crypto = require('crypto');
const db = require('../models');
const User = db.users;
//const Notification = db.notifications;

module.exports = {

  // FCM Notification for MULTIPLE users
  pushNotification: async (data, userId) => {
    console.log('pushData==>', data);
    const checkUser = await User.findOne({
      attributes: ['id', 'deviceType', 'deviceToken'],
      where: {
        id: userId
      }
    });
    if (checkUser) {
      if (checkUser.dataValues.deviceType == "1") {	// For iOS		
        var fcm = new FCM(serverKey);
        var userToken = checkUser.dataValues.deviceToken;
        var message = {
          to: userToken,
          notification: {
            title: data['title'],
            type: data['type'],
            body: data['message'],
          },
          data: data['jobDetail']

        };
        console.log("message : ", message)
        fcm.send(message, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!");
            console.log('FCM error===>', err)
          } else {
            console.log("Successfully sent with response: ", response);
          }
        });
      } else if (checkUser.dataValues.deviceType == "2") { // For Android
        var fcm = new FCM(serverKey);
        var userToken = checkUser.dataValues.deviceToken;
        /*  var message = {
           to: userToken,
           notification: {
             title: data['title'],
             body: {
               data: data['message'],
               type: data['type']
             }
           },
           data:  data['jobDetail']
           
         }; */
        var message = {
          to: userToken,
          notification: {
            title: data['title'],
            type: data['type'],
            body: data['message'],
          },
          data: data['jobDetail']

        };
        fcm.send(message, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!");
            console.log('FCM error===>', err)
          } else {
            console.log("Successfully sent with response: ", response);
          }
        });
      } else {
        console.log("No device type found!");
      }
      // save push notification data
      let createPushData = {
        senderId: data['senderId'],
        receiverId: userId,
        jobId: data['jobId'],
        description: data['message'],
        type: data['type'],
      }
      // Notification.create(createPushData);
      //
    }
  },


  // create Random Number
  createRandomValue: async () => {
    try {
      let currentDate = (new Date()).valueOf().toString();
      let random = Math.random().toString();
      return crypto.createHash('sha1').update(currentDate + random).digest('hex');
    } catch (err) {
      throw err;
    }
  },
}