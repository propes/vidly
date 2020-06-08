const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const ModelRouter = require('./model-router');

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

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

const reqBodyMapper = (body) => {
    return {
        name: body.name
    };
}

const Genre = mongoose.model('genre', dbSchema);

const router = new ModelRouter(
    Genre,
    reqBodySchema,
    reqBodyMapper
);

module.exports = router;