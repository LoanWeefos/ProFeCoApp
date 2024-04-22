'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListaDeseos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ListaDeseos.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
      ListaDeseos.belongsTo(models.Producto, { foreignKey: 'productoId' });
    }
  }
  ListaDeseos.init({
    usuarioId: DataTypes.INTEGER,
    productoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ListaDeseos',
  });
  return ListaDeseos;
};