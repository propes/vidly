const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const reqBodySchema = Joi.object({
   name: Joi.string().required().max(50),
   email: Joi.string().required().max(255).email(),
   password: Joi.string().max(255).required(),
   isAdmin: Joi.boolean()
});

const dbSchema = mongoose.Schema({
   name: { 
      type: String,
      required: true,
      maxlength: 50
   },
   email: {
      type: String,
      required: true,
      maxlength: 255,
      unique: true
   },
   password: {
      type: String,
      require: true
   },
   isAdmin: Boolean,
   roles: [],
   permissions: [],
   operations: []
});

dbSchema.methods.generateAuthToken = function() {
   return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}

const Model = mongoose.model('user', dbSchema);

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