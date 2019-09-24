require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const uglifyJs = require('uglify-js');
const csrf = require('csurf');
const fs = require('fs');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const Router = require('./config/router');
const config = require('./config');

const app = express();
const env = process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV;
app.set('views', path.join(__dirname, 'web', 'views'));
app.set('view engine', 'pug');

/* const appClientFiles = [
  'public/js/app.js',
];
const codeObject = {};
appClientFiles.forEach((pathName) => {
  const code = fs.readFileSync(pathName, 'utf8');
  codeObject[`${path.basename(pathName)}`] = code;
});

const uglified = uglifyJs.minify(codeObject, { compress: false });
fs.writeFile('public/src/app.min.js', uglified.code, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Script generated and saved:', 'app.min.js');
  }
});
*/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

const options = {
  host: config.databases.guess_number.host,
  port: config.databases.guess_number.port,
  user: config.databases.guess_number.username,
  password: config.databases.guess_number.password,
  database: config.databases.guess_number.database,
};

const sessionStore = new MySQLStore(options);

app.use(
  session({
    key: config.common.session_name,
    secret: config.common.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(csrf());
const libs = require('./libs');

const dbs = libs.db({ env, config: config.databases });

const models = require('./web/models')({ dbs, logger });

const controllers = require('./web/controllers')({
  config,
  libs,
  models,
});

const routes = Router({ controllers });
app.use('/', routes);

module.exports = app;
