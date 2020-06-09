const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const { Model: Rental, schema: reqBodySchema, mapper: reqBodyMapper } = require('../models/rental');
const { Model: Customer } = require('../models/customer');
const { Model: Movie } = require('../models/movie');

const router = express.Router();
Fawn.init(mongoose);

router.get('/', async (req, res) => {
   let query = Rental.find().sort('-dateOut');
   if (req.query.sortBy) {
      query = query.sort({ [req.query.sortBy]: req.query.orderBy });
   }

   try {
      const models = await query;
      res.send(models);
   }
   catch (ex) {
      debug(ex);
   }
});

router.post('/', async (req, res) => {
   const { valid, message } = validate(req.body, reqBodySchema);
   if (!valid) {
      return res.status(400).send(message);
   }

   // PRE-PROCESSING ----------------------------

   try {
      var customer = await Customer.findById(req.body.customerId);
   }
   catch (ex) {
      res.status(400).send(`Invalid customer, id: ${id}`);
      return debug(ex);
   }

   try {
      var movie = await Movie.findById(req.body.movieId);
   }
   catch (ex) {
      res.status(400).send(`Invalid movie, id: ${id}`);
      return debug(ex);
   }

   // Business rule
   if (movie.numberInStock === 0) return res.status(400).send('Movie is not in stock');

   let model = new Rental({
      title: req.body.title,
      customer: customer,
      movie: movie
   });

   // -------------------------------------------

   try {
      new Fawn.Task()
         .save('rentals', model)
         .update('movies', { _id: movie._id }, {
            $inc: { numberInStock: -1 }
         })
         .run();

      res.send(model);
   }
   catch (ex) {
      res.status(500).send(ex.message);
      debug(ex);
   }
});

router.delete('/:id', async (req, res) => {
   try
   {
      res.send(await Rental.findByIdAndRemove(req.params.id));
   }
   catch (ex) {
      res.status(400).send(ex.message);
      debug(ex);
   }
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

function sendModelNotFound(res, id) {
   res.status(404).send(`Could not find model with id: ${id}`);
}

module.exports = router;