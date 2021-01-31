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
    cb(null, `${process.cwd() + '/public/uploads/vaults/' }`)
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
.post(passportJWT, vaultUploads.array('images', 1), middleware.isActive, userController.userProfileImage);


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
/*router.route('/vault-listing')
.get(middleware.isActive, BookingController.vaultListing);*/

module.exports = router; 