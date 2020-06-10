const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');

const { Model: User, schema: reqBodySchema, mapper: reqBodyMapper } = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
   const { valid, message } = validate(req.body);
   if (!valid) {
      return res.status(400).send(message);
   }

   let user = await User.findOne({ email: req.body.email });
   if (!user) return res.status(400).send('Invalid email or password.');

   const validPassword = await bcrypt.compare(req.body.password, user.password);
   if (!validPassword) return res.status(400).send('Invalid email or password.');

   const token = user.generateAuthToken();
   res.send(token);
});

function validate(model) {
   const schema = {
      email: Joi.string().required().max(255).email(),
      password: Joi.string().max(255).required()
   };

   const { error } = Joi.object(schema).validate(model);
   if (error) {
      return {
         valid: false,
         message: error.details[0].message
      };
   }

   return {
      valid: true
   };
}

module.exports = router;