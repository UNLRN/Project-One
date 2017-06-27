const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/', function(req, res, next) {
    const artistID = req.param('q');


    var client_id = '8f01408378c5438096f5f11e50a9d395';
    var client_secret = 'cb37a328aaa84304aefdbe043f993412';

    // your application requests authorization
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

            // use the access token to access the Spotify Web API
            var token = body.access_token;

            // albums
            var options = {
                url: 'https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?country=US',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function(error, response, body) {

                var resObj = [];

                for (var i = 0; i < body.tracks.length; i++) {
                    var topTrackName = body.tracks[i].name;
                    var topTrackURL = body.tracks[i].external_urls.spotify;

                    var temp = {
                        track: topTrackName,
                        url: topTrackURL
                    }

                    resObj.push(temp);
                }

                res.send(resObj);
            });
        }
    });

});

module.exports = router;
