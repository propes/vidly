const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

const { Model: User, schema: reqBodySchema, mapper: reqBodyMapper } = require('../models/user');

const router = express.Router();

router.get('/', async (req, res) => {
   let query = User.find();
   if (req.query.sortBy) {
      query = query.sort({ [req.query.sortBy]: req.query.orderBy });
   }

   try {
      const models = await query.select('-password');
      res.send(models);
   }
   catch (ex) {
      debug(ex);
   }
});

router.get('/me', auth, async (req, res) => {
   const user = await User.findById(req.user._id).select('-password');
   res.send(user);
});

router.post('/', async (req, res) => {
   const { valid, message } = validate(req.body, reqBodySchema);
   if (!valid) {
      return res.status(400).send(message);
   }

   let user = await User.findOne({ email: req.body.email });
   if (user) return res.status(400).send('User already registered.');

   user = new User(req.body);

   const salt = await bcrypt.genSalt(10);
   user.password = await bcrypt.hash(req.body.password, salt);

   try {
      await user.save();
   }
   catch (ex) {
      res.status(400).send(ex.message);
      debug(ex);
      return;
   }

   const token = user.generateAuthToken();
   res.header('x-auth-token', token).send(_.pick(user, [ '_id', 'name', 'email' ]));
});

function validate(model, schema) {
   const { error } = schema.validate(model);
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