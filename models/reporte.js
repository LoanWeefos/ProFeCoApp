'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reporte extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reporte.belongsTo(models.Producto, { foreignKey: 'productoId', onDelete: 'CASCADE' });
    }
  }
  Reporte.init({
    descripcion: DataTypes.STRING,
    estado: DataTypes.STRING,
    productoId: DataTypes.INTEGER,
    nombreProducto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reporte',
  });
  return Reporte;
};