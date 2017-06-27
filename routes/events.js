var express = require('express');
var router = express.Router();
const request = require('request');

router.get('/', function (req, res, next) {
    res.render('search');
});

router.post('/', function (req, res, next) {
    let artist = req.param('q');

    var options = {
        url: 'https://rest.bandsintown.com/artists/' + artist + '/events?app_id=bootcamp',
        json: true
    };
    request.get(options, function (error, response, body) {
        let events = [];
        for (var index = 0; index < body.length; index++) {
            let date = body[index].datetime;
            let element = body[index].venue;
            events.push({
                date: date,
                venue: element.name,
                city: element.city,
                region: element.region,
                country: element.country,
                lat: element.latitude,
                lng: element.longitude
            });
        }
        res.send(events);
    });
});

module.exports = router;