/* jshint indent: 1 */
const fileURL = require('../config/main');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('documents', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'type_id'
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'type'
    },
    file: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'file'
    },
  },
    {
        getterMethods: {
        file: function () {
            return this.getDataValue('file')!='' ? fileURL.fileUrl+this.getDataValue('file') : ''
        }
    },
    },
    {
      tableName: 'documents'
    });
};
