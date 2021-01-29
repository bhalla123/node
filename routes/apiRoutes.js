const express = require('express');
const router = express.Router();
passport = require('passport');
require('../helpers/passport')(passport);
const passportJWT = passport.authenticate('jwt', { session: false });
const ApiController = require('../controllers/apiController');
const { validateBody, validateQuery, validateFile, schemas } = require('../helpers/apiValidationHelper');
const multer = require('multer');
var path = require('path')

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
	.post(validateBody(schemas.signInSchema), ApiController.login);

// user signup
router.route('/signup')
	.post(validateBody(schemas.createUserSchema), ApiController.signup);

//update profile
router.route('/update/profile')
	.post(passportJWT, validateBody(schemas.updateProfileSchema), ApiController.updateProfile);

//update profile image
router.route('/update/profile/image')
.post(passportJWT, ImageUpload.array('images', 12), ApiController.userProfileImage);

// forgot Password	
router.route('/forgot-password')
	.post(validateBody(schemas.forgotPasswordSchema), ApiController.forgotPassword);

// cLickOnUrl
router.route('/reset-password/:id')
	.get(ApiController.apiUrl);

// change Password
router.route('/change-password')
	.post(ApiController.changePassword);

// logout
router.route('/logout')
	.post(passportJWT, ApiController.logout);

// social login
router.route('/social-login')
.post(validateBody(schemas.socialLoginSchema), ApiController.socialLogin);

// add vault
router.route('/add-vault')
.post(passportJWT, /* validateBody(schemas.addVaultSchema), */ vaultUploads.array('vaultFiles', 12), ApiController.addVault);

// vault listing
router.route('/vault-listing')
.get(passportJWT, ApiController.vaultListing);

// get user profile
router.route('/user-profile')
.get(passportJWT, validateQuery(schemas.userIdSchema), ApiController.userProfile);


module.exports = router; 