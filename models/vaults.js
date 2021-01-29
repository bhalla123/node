/* jshint indent: 1 */
const imgUrl = require('../config/main');
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('vaults', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'userId'
		},
		name: {
			type: DataTypes.STRING(200),
			allowNull: true,
			field: 'name'
		},
		phoneNumber: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'phoneNumber'
		},
		beneficiaries: {
			type: DataTypes.STRING(200),
			allowNull: true,
			field: 'beneficiaries'
		},
		triggerType: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'triggerType'
		},

		triggerDate: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'triggerDate'
		},
		triggerTime: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'triggerTime'
		},
		triggerDateTimeStamp: {
			type: DataTypes.STRING(200),
			allowNull: true,
			field: 'triggerDateTimeStamp'
		},

		alertDuration: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			field: 'alertDuration'
		},
		notes: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'notes'
		},
	},
		{
		},
		{
			tableName: 'vaults'
		});
};
