const express = require('express');

const router = express.Router();

module.exports = ({ controllers }) => {
  router.get('/', controllers.pages.index);
  router.get('/results', controllers.pages.show);
  router.post('/check', controllers.pages.check);
  router.post('/new', controllers.pages.new);
  router.get('/generate', controllers.pages.regenerate);

  return router;
};
