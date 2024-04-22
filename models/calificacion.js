'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Calificacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Calificacion.belongsTo(models.Producto, { foreignKey: 'productoId' });
    }
  }
  Calificacion.init({
    liked: DataTypes.BOOLEAN,
    comentario: DataTypes.STRING,
    productoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Calificacion',
  });
  return Calificacion;
};