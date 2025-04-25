const { DataTypes } = require('sequelize');
const sequelize = require('../Db');
const Sequelize = require('sequelize');
const fs = require('fs');

const models = {};

fs.readdirSync(__dirname)
  .filter(file => file !== 'models.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    Object.assign(models, model);
  });

  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
  
  module.exports = {models};