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
      Calificacion.belongsTo(models.Producto, { foreignKey: 'productoId', onDelete: 'CASCADE' });
      Calificacion.belongsTo(models.Usuario, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
    }
  }
  Calificacion.init({
    liked: DataTypes.BOOLEAN,
    comentario: DataTypes.STRING,
    productoId: DataTypes.INTEGER,
    usuarioId: DataTypes.INTEGER,
    comentario: DataTypes.STRING,
    nombreProducto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Calificacion',
    tableName: 'calificaciones'
  });
  return Calificacion;
};