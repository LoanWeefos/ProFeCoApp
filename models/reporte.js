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
      Reporte.belongsTo(models.Producto, { foreignKey: 'productoId' });
    }
  }
  Reporte.init({
    descripcion: DataTypes.STRING,
    fecha: DataTypes.DATE,
    estado: DataTypes.STRING,
    productoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reporte',
  });
  return Reporte;
};