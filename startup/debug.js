const morgan = require('morgan');
const debug = require('debug')('app:debug');

module.exports = function(app) {
   if (app.get('env') === 'development') {
      app.use(morgan('tiny'));
      debug('Morgan enabled...');
   }
}