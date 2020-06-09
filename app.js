const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:debug');
const demoMiddleware = require('./middleware/demo');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');

const app = express();

app.use(helmet());

if (app.get('env') === 'development') {
   app.use(morgan('tiny'));
   debug('Morgan enabled...');
}

app.use(demoMiddleware);
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));