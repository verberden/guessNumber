const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, 'main');

fs.readdirSync(configDir).forEach((file) => {
  const confName = file.split('.')[0];
  module.exports[confName] = require(path.join(configDir, file));
});
