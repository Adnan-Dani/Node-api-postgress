
const Sequelize = require("sequelize");
// Set up database connection
const sequelize = new Sequelize("curd", "postgres", "root", {
  host: "localhost",
  dialect: 'postgres',
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.User = require('./User.js')(sequelize, Sequelize);
module.exports = db;
