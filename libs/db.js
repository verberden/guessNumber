const Sequelize = require('sequelize');

module.exports = ({ config }) => {
  const data = {};

  Object.keys(config).map((name) => {
    if (config[name].adapter === 'sequelize') {
      const db = config[name];

      const options = {
        host: db.host,
        dialect: db.dialect,
        logging: false,
      };

      const sequelize = new Sequelize(db.database, db.user, db.password, options);

      data[name] = sequelize;
    }
  });

  data.Sequelize = Sequelize;


  return data;
};
