/* jshint indent: 1 */
const fileURL = require('../config/main');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'first_name'
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'last_name'
    },
    email: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'email'
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'password'
    },
    image: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'image'
    },
    phone_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'phone_number'
    },
    gender: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'gender'
    },
    status: {
      type: DataTypes.STRING(100),
      defaultValue: "Active",
      field: 'status'
    },
    type: {
      type: DataTypes.STRING(100),
      defaultValue: "NormalUser",
      field: 'status'
    },

  }, 
  {
    getterMethods: {
        image: function () {
            return this.getDataValue('image')!='' ? fileURL.fileUrl+this.getDataValue('image') : ''
        }
    }, 
  },
    {
    tableName: 'users'
  });
};
