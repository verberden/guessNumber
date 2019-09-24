const express = require('express');

const router = express.Router();

module.exports = ({ controllers }) => {
  router.get('/', controllers.pages.index);

  return router;
};
