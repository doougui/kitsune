const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite'
});

const Servers = require('./models/Servers')(sequelize, Sequelize.DataTypes);

module.exports = { Servers };
