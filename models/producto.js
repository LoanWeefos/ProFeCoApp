'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Producto.belongsTo(models.Imagen, { foreignKey: 'imagenId' });
      Producto.hasMany(models.Calificacion, { foreignKey: 'productoId' });
      Producto.hasMany(models.Reporte, { foreignKey: 'productoId' });
      Producto.hasMany(models.ListaDeseos, { foreignKey: 'productoId' });
      Producto.hasMany(models.Categoria, { foreignKey: 'productoId' });
    }
  }
  Producto.init({
    nombre: DataTypes.STRING,
    precio: DataTypes.DECIMAL,
    descripcion: DataTypes.STRING,
    imagenId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Producto',
  });
  return Producto;
};