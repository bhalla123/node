const express = require('express');
const router = express.Router();
passport = require('passport');
require('../helpers/passport')(passport);
const passportJWT = passport.authenticate('jwt', { session: false });
const ApiController = require('../controllers/apiController');
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
	.post(validateBody(schemas.signInSchema), ApiController.login);

//user signup
router.route('/signup')
	.post(validateBody(schemas.createUserSchema), ApiController.signup);

//update profile image
router.route('/upload/file')
.post(vaultUploads.array('attachment', 1), middleware.isActive, ApiController.userProfileImage);

//update status
router.route('/update/status')
.post(passportJWT, middleware.isAdmin, validateBody(schemas.updateStatusSchema), ApiController.updateStatus);

// logout
router.route('/logout')
	.post(passportJWT, middleware.isActive, ApiController.logout);

// add booking
router.route('/create/booking')
.post(passportJWT, middleware.isActive, ApiController.createBooking);

// Booking listing
router.route('/vault-listing')
.get(middleware.isActive, ApiController.vaultListing);

module.exports = router; 