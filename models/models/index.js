const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('spotinode', 'root', 'your_password', {
    host: 'localhost',
    dialect: 'mysql'
});

const User = require('./User')(sequelize, Sequelize);
const Song = require('./Song')(sequelize, Sequelize);

sequelize.sync();

module.exports = { sequelize, User, Song };
