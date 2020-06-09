const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const reqBodySchema = Joi.object({
   name: Joi.string()
      .alphanum()
      .required()
});

const dbSchema = mongoose.Schema({
   name: { 
      type: String,
      required: true
   }
});

const Model = mongoose.model('genre', dbSchema);

const reqBodyMapper = (body) => {
   return {
      name: body.name
   };
}

module.exports = {
   Model: Model,
   schema: reqBodySchema,
   mapper: reqBodyMapper,
   dbSchema: dbSchema
};