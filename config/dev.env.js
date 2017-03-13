var merge = require('webpack-merge');
var prodEnv = require('./prod.env');
var api_config = require('./api_config');


module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_SERVER: api_config.development
});
