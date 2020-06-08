const express = require('express'); 
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const _ = require('lodash');

const router = express.Router();

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const reqSchema = Joi.object({
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

const Genre = mongoose.model('genre', dbSchema);

router.get('/', async (req, res) => {
    let query = Genre.find();
    if (req.query.sortBy) {
        query = query.sort({ [req.query.sortBy]: req.query.orderBy });
    }
    const genres = await query;
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    try
    {
        res.send(await Genre.findById(req.params.id));
    }
    catch (ex) {
        return sendGenreNotFound(res, req.params.id);
    }
});

router.post('/', async (req, res) => {
    const { valid, message } = isGenreValid(req.body);
    if (!valid) {
        return res.status(400).send(message);
    }

    const genre = new Genre({
        name: req.body.name
    });

    try {
        const result = await genre.save();
        res.send(result);
    }
    catch (ex) {
        res.status(400).send(ex.message);
    }
});

router.put('/:id', async (req, res) => {
    const { valid, message } = isGenreValid(req.body);
    if (!valid) {
        return res.status(400).send(message);
    }

    try
    {
        const genre = await Genre.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name
            }
        }, { new: true });

        res.send(genre);
    }
    catch (ex) {
        res.status(400).send(ex.message);
    }
});

router.delete('/:id', async (req, res) => {
    try
    {
        res.send(await Genre.findByIdAndRemove(req.params.id));
    }
    catch (ex) {
        res.status(400).send(ex.message);
    }
});

function isGenreValid(genre) {
    const { error } = reqSchema.validate(genre);
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

function sendGenreNotFound(res, id) {
    res.status(404).send(`Could not find genre with id: ${id}`);
}

module.exports = router;