'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mercado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Mercado.belongsTo(models.Usuario, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
    }
  }
  Mercado.init({
    nombre: DataTypes.STRING,
    tipo: DataTypes.STRING,
    estado: DataTypes.STRING,
    usuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Mercado',
  });
  return Mercado;
};