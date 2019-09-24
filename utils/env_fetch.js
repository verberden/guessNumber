module.exports = function envFetch(key, defaultValue) {
  return process.env[key] ? process.env[key] : defaultValue;
};
