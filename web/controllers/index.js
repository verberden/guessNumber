const fs = require('fs');
const path = require('path');

module.exports = (modules) => {
  const controllers = {};

  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') return;

    const name = file.split('.')[0];
    controllers[name] = require(`./${name}`)(modules);
  });

  return controllers;
};
