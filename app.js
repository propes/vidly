const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const genres = require('./routes/genres');

const app = express();

app.use(helmet());

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
}

app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));