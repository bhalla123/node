/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('roles', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		type: {
			type: DataTypes.STRING(250),
			allowNull: true,
			field: 'name'
		},
		user_id: {
	      type: DataTypes.INTEGER(11),
	      allowNull: false,
	      field: 'userId'
	    },
	}, {
		tableName: 'roles'
	});
};
