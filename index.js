const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:debug');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');

const demoMiddleware = require('./middleware/demo');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

const app = express();

app.use(helmet());

if (app.get('env') === 'development') {
   app.use(morgan('tiny'));
   debug('Morgan enabled...');
}

if (!config.get('jwtPrivateKey')) {
   console.error("FATAL ERROR: jwtPrivateKey is not defined.")
   process.exit(1);
}

mongoose.connect(config.get('dbConnectionString'))
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use(demoMiddleware);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));