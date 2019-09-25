const Sequelize = require('sequelize');

module.exports = ({ env, config }) => {
  const data = {};

  Object.keys(config).map((name) => {
    if (config[name].adapter === 'sequelize') {
      const db = config[name];

      const options = {
        host: db.host,
        dialect: db.dialect,
      };


      if (env !== 'development') options.logging = false;

      const sequelize = new Sequelize(db.database, db.username, db.password, options);

      data[name] = sequelize;
    }
  });

  data.Sequelize = Sequelize;


  return data;
};
