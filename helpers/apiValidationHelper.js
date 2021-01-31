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

		updateProfileSchema: joi.object().keys({
			email: joi.string().required(),
			firstName: joi.string().empty(''),
			lastName: joi.string().empty(''),
			gender: joi.string().empty(''),
			about: joi.string().empty(''),
			phone: joi.string().empty(''),
			dob: joi.string().empty(''),
		}),

		createUserSchema: joi.object().keys({
			first_name: joi.string().empty(''),
			last_name: joi.string().empty(''),
			email: joi.string().email().required(),
			password: joi.string().required(),
			phone_number: joi.string().empty(''),
			role_name: joi.string().empty(''),
			type: joi.string().valid('admin', 'user', 'employee').required(),
		}),

		updateStatusSchema: joi.object().keys({
			user_id: joi.string().required(),
			status: joi.string().valid('block', 'deleted', 'active').required(),
		}),

		addVaultSchema: joi.object().keys({
			name: joi.string().required(),
			phoneNumber: joi.string().required(),
			beneficiaries: joi.string().required(),
			triggerType: joi.number().required(),
			triggerDate: joi.string().required(),
			triggerTime: joi.string().required(),
			alertDuration: joi.number().required(),
			notes: joi.string().empty(''),
		}),

		userIdSchema: joi.object().keys({
			userId: joi.number().required(),
		}),


	}
}
