const ModelRouter = require('./model-router');
const { Model, schema, mapper } = require('../models/genre');

const router = new ModelRouter(
   Model,
   schema,
   mapper
);

module.exports = router;