const joi = require('joi');

module.exports = {

	validateBody: (schema) => {
		return (req, res, next) => {
			const result = joi.validate(req.body, schema, (err, value) => {
				if (err) {
					return res.status(422).json({
						success: false,
						message: err.details[0].message.replace(/[^a-zA-Z ]/g, ""),
					});
				} else {
					req.data = value;
					next();
				}
			});
		}
	},
	validateQuery: (schema) => {
		return (req, res, next) => {
			const result = joi.validate(req.query, schema, (err, value) => {
				if (err) {
					return res.status(422).json({
						success: false,
						message: err.details[0].message.replace(/[^a-zA-Z ]/g, ""),
					});
				} else {
					req.data = value;
					next();
				}
			});
		}
	},
	validateFile: (schema) => {
		return (req, res, next) => {
			const result = joi.validate(req.file, schema, (err, value) => {
				if (err) {
					return res.status(422).json({
						success: false,
						message: err.details[0].message.replace(/[^a-zA-Z ]/g, ""),
					});
				} else {
					req.data = value;
					next();
				}
			});
		}
	},

	schemas: {
		signInSchema: joi.object().keys({
			password: joi.string().required(),
			email: joi.string().required(),
		}),

		createUserSchema: joi.object().keys({
			first_name: joi.string().empty(''),
			last_name: joi.string().empty(''),
			email: joi.string().email().required(),
			password: joi.string().required(),
			phone_number: joi.string().empty(''),
			role_name: joi.string().empty(''),
			type: joi.string().valid('admin', 'user', 'employee', 'owner').required(),
		}),

		updateStatusSchema: joi.object().keys({
			user_id: joi.number().required(),
			status: joi.string().valid('block', 'deleted', 'active').required(),
		}),

		createBookingSchema: joi.object().keys({
			fuel_pump_id: joi.number().required(),
			booking_slot: joi.array().items({
				from_time: joi.string().required(),
				to_time: joi.string().required(),
				fuel_in_liter: joi.string().required(),
				vehicle_type: joi.string().empty(''),
				booking_id:joi.string().empty(''),
			}),
		})
	}
}
