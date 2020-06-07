const express = require('express'); 
const Joi = require('@hapi/joi');

const router = express.Router();

const genres = [{
    id: 1,
    name: 'action'
}, {
    id: 2,
    name: 'thrillers'
}, {
    id: 3,
    name: 'comedy'
}];

let nextId = 4;

router.get('/', (req, res) => {
    if (req.query.sortBy) {
        const sortedGenres = sortGenres(req.query.sortBy, req.query.sortDesc);
        return res.send(sortedGenres);
    }

    res.send(genres);
});

router.get('/:id', (req, res) => {
    const genre = findGenre(req.params.id);
    if (!genre) {
        return sendGenreNotFound(res, req.params.id);
    }

    res.send(genre);
});

router.post('/', (req, res) => {
    const { valid, message } = isGenreValid(req.body);
    if (!valid) {
        return res.status(400).send(message);
    }

    const genre = {
        id: nextId++,
        name: req.body.name
    };

    genres.push(genre);
    res.send(genre);
});

router.put('/:id', (req, res) => {
    const genre = findGenre(req.params.id);
    if (!genre) {
        return sendGenreNotFound(res, req.params.id);
    }

    const { valid, message } = isGenreValid(req.body);
    if (!valid) {
        return res.status(400).send(message);
    }

    genre.name = req.body.name;

    res.send(genre);
});

router.delete('/:id', (req, res) => {
    const genre = findGenre(req.params.id);
    if (!genre) {
        return sendGenreNotFound(res, req.params.id);
    }

    deleteGenre(genre);

    res.send(genre);
});

function findGenre(id) {
    return genres.find(genre => genre.id === parseInt(id));
}

function sortGenres(sortBy, sortDesc) {
    return genres.sort((a, b) => 
        (sortDesc === 'true' ?
            a[sortBy] < b[sortBy] :
            a[sortBy] > b[sortBy])
        ? 1 : -1
    );
}

function deleteGenre(genre) {
    const index = genres.indexOf(genre);
    genres.splice(index, 1);
}

function isGenreValid(genre) {
    const schema = Joi.object({
        name: Joi.string()
            .alphanum()
            .required()
    });

    const { error } = schema.validate(genre);
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