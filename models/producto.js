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
      Producto.hasOne(models.Imagen, { foreignKey: 'productoId', onDelete: 'CASCADE' });
      Producto.hasMany(models.Calificacion, { foreignKey: 'productoId', onDelete: 'CASCADE' });
      Producto.hasMany(models.Reporte, { foreignKey: 'productoId', onDelete: 'CASCADE' });
      Producto.hasMany(models.ListaDeseos, { foreignKey: 'productoId', onDelete: 'CASCADE' });
      Producto.hasMany(models.Categoria, { foreignKey: 'productoId', onDelete: 'CASCADE' });
      Producto.belongsTo(models.Usuario, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
    }
  }
  Producto.init({
    nombre: DataTypes.STRING,
    precio: DataTypes.DECIMAL,
    oferta: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    usuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Producto',
  });
  return Producto;
};