require('dotenv').config();
const databases = require('./main/mysql');

const config = databases.guess_number;
const env = process.env.NODE_ENV || 'development';

module.exports = {
  [env]: config,
};
