const express = require('express');
const router = express.Router();
passport = require('passport');
require('../helpers/passport')(passport);
const passportJWT = passport.authenticate('jwt', { session: false });
const ApiController = require('../controllers/apiController');
const { validateBody, validateQuery, validateFile, schemas } = require('../helpers/apiValidationHelper');
const multer = require('multer');
var path = require('path');

var middleware = require("../middlewares");


var vaultFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd() + '/public/uploads/vaults/' }`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var ImageUpload = multer({ dest: process.cwd() + '/public/assets/images/' })// file data uploading path for images
var vaultUploads = multer({storage : vaultFileStorage })// file data uploading path vault files

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
.post(passportJWT, ImageUpload.array('images', 12), ApiController.userProfileImage);


// logout
router.route('/logout')
	.post(passportJWT, ApiController.logout);

// add vault
router.route('/create/booking')
.post(passportJWT, vaultUploads.array('vaultFiles', 12), ApiController.createBooking);

// vault listing
router.route('/vault-listing')
.get(passportJWT, ApiController.vaultListing);

module.exports = router; 