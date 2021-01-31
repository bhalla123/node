const passport = require('passport');
var f= require('dotenv').config();
console.log(f)
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JWT_SECRET = process.env.JWT_SECRET;
const db = require('../models');
const User = db.users;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = JWT_SECRET;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
		try {
			const user = await User.findOne({
				where : {
					id : jwt_payload.id
				}
			});
			if (!user) {
				return done(null, false);
			}
			done(null, user);
		} catch (error) {
			done(error, false);
		}
    }));
};


