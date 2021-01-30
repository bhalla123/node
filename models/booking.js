/* jshint indent: 1 */
const imgUrl = require('../config/main');
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('bookings', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		user_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'user_id'
		},
		petrol_pump_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'petrol_pump_id'
		},
		filler_type: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'filler_type'
		},
		status: {
			type:DataTypes.STRING(255),
			allowNull:false,
			defaultValue: 'Requested',
			field:'status'
		}
	},
	{
		tableName: 'bookings'
	});
};
