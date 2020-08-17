const Sequelize = require('sequelize');
const logger = require('./src/modules/Logger');

const sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite'
});

require('./src/models/Servers')(sequelize, Sequelize.DataTypes);
const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(() => {
  logger.log('Database synced');
  sequelize.close();
}).catch(console.error);
