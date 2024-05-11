'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuario.hasOne(models.Consumidor, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
      Usuario.hasOne(models.Mercado, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
      Usuario.hasMany(models.ListaDeseos, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
      Usuario.hasMany(models.Producto, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
      Usuario.hasMany(models.Calificacion, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
    }
  }
  Usuario.init({
    correo: DataTypes.STRING,
    contraseña: DataTypes.STRING,
    tipo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};