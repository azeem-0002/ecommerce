'use strict';
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    key: { type: DataTypes.STRING, unique: true, allowNull: false },
    value: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'Settings',
    timestamps: false
  });

  return Setting;
};
