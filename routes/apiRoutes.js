const express = require('express');
const router = express.Router();
passport = require('passport');
require('../helpers/passport')(passport);
const passportJWT = passport.authenticate('jwt', { session: false });
const userController = require('../controllers/UserController');
const bookingController = require('../controllers/BookingController');
const fillerStationController = require('../controllers/FillerStationController');
const { validateBody, validateQuery, validateFile, schemas } = require('../helpers/apiValidationHelper');
const multer = require('multer');
var path = require('path');
var app = express();
var middleware = require("../middlewares");

var vaultFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd() + '/public/images/' }`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var vaultUploads = multer({storage : vaultFileStorage, limits: { fileSize: (1024 * 1024) * 3} })// file data uploading path vault files

//**********  API CONTROLLER ROUTES **********//

//signIn
router.route('/v1/login')
	.post(validateBody(schemas.signInSchema), userController.login);

//user signup
router.route('/v1/signup')
	.post(validateBody(schemas.createUserSchema), userController.signup);

//update profile image
router.route('/v1/update/profile')
.post(passportJWT, vaultUploads.array('images', 1), userController.userProfileImage);

//update status for admin only
router.route('/v1/update/status')
.post(passportJWT, middleware.isAdmin, validateBody(schemas.updateStatusSchema), userController.updateStatus);

// create booking
router.route('/v1/create/booking')
.post(passportJWT, validateBody(schemas.createBookingSchema), bookingController.createBooking);

//booking listing
router.route('/v1/booking/list')
.get(passportJWT, middleware.isOwner, bookingController.bookingList);

//create Pump
router.route('/v1/create/fuel/station')
.post(passportJWT, fillerStationController.createStation);

//update fuel 
router.route('/v1/update/station/image')
.post(passportJWT, middleware.isOwner, vaultUploads.array('images', 1), bookingController.updateFuelStation);

//update fuel 
router.route('/v1/station/listing')
.post(passportJWT, fillerStationController.listing);

module.exports = router; 