const fs = require('fs');
const path = require('path');

fs.readdirSync(__dirname).forEach((file) => {
  if (file === 'index.js') return;

  const libName = file.split('.')[0];
  module.exports[libName] = require(`./${libName}`);
});
