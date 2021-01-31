const fileURL = require('../config/main');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('fuel_pump', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'name'
    },
	location: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'location'
    },
    country: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'country'
    },
    city: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'city'
    },
	state: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'state'
    },
	zip: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'zip'
    },
    latitude: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: { min: -90, max: 90 }
	  },
	  longitude: {
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: null,
		validate: { min: -180, max: 180 }
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

  }, 
  {
    getterMethods: {
        image: function () {
            return this.getDataValue('image')!='' ? fileURL.fileUrl+this.getDataValue('image') : ''
        }
    }, 
  },
    {
    tableName: 'fuel_pump'
  });
  
  FuelPump.associate = models => {
        FuelPump.hasMany(models.fuel);
      };
    return FuelPump;
};
