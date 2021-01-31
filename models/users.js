/* jshint indent: 1 */
require('dotenv').config();
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
      defaultValue: "active",
      field: 'status'
    },
    type: {
      type: DataTypes.STRING(100),
      defaultValue: "normalUser",
      field: 'type'
    },

  }, 
  {
    getterMethods: {
        image: function () {
            return this.getDataValue('image')!= null ? process.env.baseUrl+"/images/"+this.getDataValue('image') : ''
        }
    }, 
  },
    {
    tableName: 'users'
  });
};
