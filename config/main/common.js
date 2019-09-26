const envFetch = require('../../utils/env_fetch');

module.exports = {
  session_name: [envFetch('SESSION_NAME', 'session_name')],
  secret: [envFetch('SECRET', 'session_secret')],
};
