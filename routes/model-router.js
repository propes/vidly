const express = require('express');
const debug = require('debug')('app:debug');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

class ModelRouter extends express.Router {
   constructor(
      Model,
      reqBodySchema,
      reqBodyMapper
   ) {
      super();
      this.reqBodySchema = reqBodySchema;

      this.get('/', async (req, res) => {
         let query = Model.find();
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

      this.get('/:id', async (req, res, next) => {
         try
         {
            const model = await Model.findById(req.params.id);
            res.send(model);
         }
         catch (ex) {
            // sendModelNotFound(res, req.params.id);
            // debug(ex);
            next(ex);
         }
      });

      this.post('/', auth, async (req, res) => {
         const { valid, message } = validate(req.body, reqBodySchema);
         if (!valid) {
            return res.status(400).send(message);
         }

         const model = new Model(reqBodyMapper(req.body));
     
         try {
            await model.save();
         }
         catch (ex) {
            res.status(400).send(ex.message);
            debug(ex);
            return;
         }

         res.send(model);
      });

      this.put('/:id', auth, async (req, res) => {
         const { valid, message } = validate(req.body, reqBodySchema);
         if (!valid) {
            return res.status(400).send(message);
         }

         try
         {
            const model = await Model.findByIdAndUpdate(req.params.id, {
               $set: reqBodyMapper(req.body)
            }, { new: true });
            res.send(model);
         }
         catch (ex) {
            res.status(400).send(ex.message);
            debug(ex);
         }
      });

      this.delete('/:id', [auth, admin], async (req, res) => {
         try
         {
            res.send(await Model.findByIdAndRemove(req.params.id));
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

module.exports = ModelRouter;