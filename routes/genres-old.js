const express = require('express'); 
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const debug = require('debug')('app:debug');

const router = express.Router();

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

const Genre = mongoose.model('genre', dbSchema);

router.get('/', async (req, res) => {
    let query = Genre.find();
    if (req.query.sortBy) {
        query = query.sort({ [req.query.sortBy]: req.query.orderBy });
    }

    try {
        const genres = await query;
        res.send(genres);
    }
    catch (ex) {
        debug(ex);
    }
});

router.get('/:id', async (req, res) => {
    try
    {
        const genre = await Genre.findById(req.params.id);
        res.send(genre);
    }
    catch (ex) {
        sendGenreNotFound(res, req.params.id);
        debug(ex);
    }
});

router.post('/', async (req, res) => {
    const { valid, message } = isRequestBodyValid(req.body);
    if (!valid) {
        return res.status(400).send(message);
    }

    let genre = new Genre({
        name: req.body.name
    });

    try {
        genre = await genre.save();
        res.send(genre);
    }
    catch (ex) {
        res.status(400).send(ex.message);
        debug(ex);
    }
});

router.put('/:id', async (req, res) => {
    const { valid, message } = isRequestBodyValid(req.body);
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
        debug(ex);
    }
});

router.delete('/:id', async (req, res) => {
    try
    {
        res.send(await Genre.findByIdAndRemove(req.params.id));
    }
    catch (ex) {
        res.status(400).send(ex.message);
        debug(ex);
    }
});

function isRequestBodyValid(genre) {
    const { error } = reqBodySchema.validate(genre);
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