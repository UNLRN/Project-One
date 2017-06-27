const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', function (req, res, next) {
    res.render('search');
});

router.post('/', function (req, res, next) {
    const artist = req.param('q');
    const api_key = '31a1c50e2e441abc5e49871a165bad68';

    var options = {
        url: 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artist + '&api_key=' + api_key + '&format=json',
        json: true
    };
    request.get(options, function (error, response, body) {
        let html = `<p>${body.artist.bio.summary}</p>`
        res.send(html);
    });
})


module.exports = router;