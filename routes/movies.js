const express = require('express');
const { Model: Movie, schema, mapper } = require('../models/movie');
const { Model: Genre } = require('../models/genre');

class ModelRouter extends express.Router {
   constructor(
      Movie,
      reqBodySchema,
      reqBodyMapper
   ) {
      super();
      this.reqBodySchema = reqBodySchema;

      this.get('/', async (req, res) => {
         let query = Movie.find();
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

      this.get('/:id', async (req, res) => {
         try
         {
            const model = await Movie.findById(req.params.id);
            res.send(model);
         }
         catch (ex) {
            sendModelNotFound(res, req.params.id);
            debug(ex);
         }
      });

      this.post('/', async (req, res) => {
         const { valid, message } = validate(req.body, reqBodySchema);
         if (!valid) {
            return res.status(400).send(message);
         }

         try {
            var genre = await Genre.findById(req.body.genreId);
         }
         catch (ex) {
            res.status(400).send(`Invalid genre, id: ${id}`);
            return debug(ex);
         }

         let model = new Movie({
            title: req.body.title,
            genre: genre,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
         });
     
         try {
            model = await model.save();
            res.send(model);
         }
         catch (ex) {
            res.status(400).send(ex.message);
            debug(ex);
         }
      });

      this.put('/:id', async (req, res) => {
         const { valid, message } = validate(req.body, reqBodySchema);
         if (!valid) {
            return res.status(400).send(message);
         }

         try {
            var genre = await Genre.findById(req.body.genreId);
         }
         catch (ex) {
            res.status(400).send(`Invalid genre, id: ${id}`);
            return debug(ex);
         }

         try
         {
            const model = await Movie.findByIdAndUpdate(req.params.id, {
               title: req.body.title,
               genre: genre,
               numberInStock: req.body.numberInStock,
               dailyRentalRate: req.body.dailyRentalRate
            }, { new: true });

            res.send(model);
         }
         catch (ex) {
            res.status(400).send(ex.message);
            debug(ex);
         }
      });

      this.delete('/:id', async (req, res) => {
         try
         {
            res.send(await Movie.findByIdAndRemove(req.params.id));
         }
         catch (ex) {
            res.status(400).send(ex.message);
            debug(ex);
         }
      });
   }
}

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

const router = new ModelRouter(
   Movie,
   schema,
   mapper
);

module.exports = router;