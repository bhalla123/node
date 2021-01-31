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

// signIn
router.route('/login')
	.post(validateBody(schemas.signInSchema) , ApiController.login);

// user signup
router.route('/signup')
	.post(validateBody(schemas.createUserSchema), ApiController.signup);

//update profile
/*router.route('/update/profile')
	.post(passportJWT, validateBody(schemas.updateProfileSchema), ApiController.updateProfile);*/

//update profile image
router.route('/update/profile/image')
.post(passportJWT, vaultUploads.array('images', 12), ApiController.userProfileImage);


//update status
router.route('/update/status')
.post(vaultUploads.array('images',1), passportJWT, middleware.isAdmin, validateBody(schemas.updateStatusSchema), ApiController.updateStatus);


// logout
router.route('/logout')
	.post(passportJWT, ApiController.logout);

// add booking
router.route('/create/booking')
.post(passportJWT, ApiController.createBooking);

// Booking listing
router.route('/vault-listing')
.get( ApiController.vaultListing);

module.exports = router; 