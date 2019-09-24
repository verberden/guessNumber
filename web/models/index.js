const fs = require('fs');
const path = require('path');

module.exports = (modules) => {
  const models = {};

  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') return;

    const modelName = file.split('.')[0];
    models[modelName] = require(`./${modelName}`)(modules);
  });

  return models;
};
