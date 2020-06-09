const mongoose = require('mongoose');
const ModelRouter = require('./model-router');
const { Model, schema, mapper } = require('../models/movie');

mongoose.connect('mongodb://localhost/vidly')
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('Could not connect to MongoDB...', err));

const router = new ModelRouter(
   Model,
   schema,
   mapper
);

module.exports = router;