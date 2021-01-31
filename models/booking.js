/* jshint indent: 1 */
const imgUrl = require('../config/main');
module.exports = function (sequelize, DataTypes) {
	const Booking =  sequelize.define('bookings', {
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
	    fuel_pump_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'fuel_pump_id'
		},
		booking_status: {
			type:DataTypes.STRING(255),
			allowNull:true,
 			field:'booking_status'
		}
	},
	{
            underscored: true,
            freezeTableName: true,
    });
	Booking.associate = models => {
        Booking.hasMany(models.booking_slots);
		Booking.belongsTo(models.users);
        Booking.belongsTo(models.fuel_pump);
      };
    return Booking;
};
