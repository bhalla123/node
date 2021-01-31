const express = require('express');
const router = express.Router();
passport = require('passport');
require('../helpers/passport')(passport);
const passportJWT = passport.authenticate('jwt', { session: false });
const userController = require('../controllers/UserController');
const bookingController = require('../controllers/BookingController');
const FillerStationController = require('../controllers/FillerStationController');
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
router.route('/login')
	.post(validateBody(schemas.signInSchema), userController.login);

//user signup
router.route('/signup')
	.post(validateBody(schemas.createUserSchema), userController.signup);

//update profile image
router.route('/update/profile')
.post(passportJWT, vaultUploads.array('images', 1), userController.userProfileImage);


//update profile
router.route('/update/profile')
	.post(passportJWT, vaultUploads.array('images', 1), userController.userProfileImage);

//update status for admin only
router.route('/update/status')
.post(passportJWT, middleware.isAdmin, validateBody(schemas.updateStatusSchema), userController.updateStatus);

// logout
router.route('/logout')
	.post(passportJWT, userController.logout);

// create booking
router.route('/v1/create/booking')
.post(passportJWT, validateBody(schemas.createBookingSchema), bookingController.createBooking);

// Booking listing
router.route('/v1/booking/list')
.get(passportJWT, bookingController.bookingList);

//update fuel 
router.route('/v1/update/station/image')
.post(passportJWT,vaultUploads.array('images', 1), bookingController.updateFuelStation);

module.exports = router; 