const winston = require('winston');
const config = require('config');
require('winston-mongodb');

module.exports = function(app) {
   if (app.get('env') != 'development') {
      winston.exceptions.handle(
         new winston.transports.Console({ colorize: true, prettyPrint: true }),
         new winston.transports.File({ filename: 'uncaughtExceptions.log' })
      );

      process.on('unhandledRejection', (ex) => {
         throw ex;
      });
   }

   winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));
   winston.add(new winston.transports.MongoDB({ db: config.get('dbConnectionString') }));
}