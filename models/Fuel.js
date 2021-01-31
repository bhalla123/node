 module.exports = function (sequelize, DataTypes) {
  const Fuel= sequelize.define('fuels', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    fuel_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
	fuel_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
	price_per_liter: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    fuel_pump_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
     },
  }, 
  
  {
      underscored: true,
      freezeTableName: true,
  });
  
  Fuel.associate = models => {
    Fuel.belongsTo(models.fuel_pumps);
  };
  
  return Fuel;

};
