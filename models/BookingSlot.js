module.exports = function (sequelize, DataTypes) {
	const BookingSlot = sequelize.define('booking_slots', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		from_time: {
			type: DataTypes.DATE,
			allowNull: false,
 		},
	    to_time: {
			type: DataTypes.DATE,
			allowNull: false,
 		},
		fuel_in_liter: {
			type: DataTypes.STRING,
			allowNull: false,
 		},
		vehicle_type: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'vehicle_type'
		},
		booking_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
 		},
	},
	{
            underscored: true,
            freezeTableName: true,
    });
	BookingSlot.associate = models => {
        BookingSlot.belongsTo(models.bookings);
      };
    return BookingSlot;
};
