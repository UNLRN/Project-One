const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/:artist', function (req, res) {
    const artist = req.params.artist;

    const client_id = process.env.SPOTIFY_ID;
    const client_secret = process.env.SPOTIFY_SECRET;

    // your application requests authorization
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            // use the access token to access the Spotify Web API
            let token = body.access_token;
            
            let options = {
                url: 'https://api.spotify.com/v1/search?q='+artist+'*&type=artist',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function (error, response, body) {
                let html = "";
                for (let index = 0; index < body.artists.items.length; index++) {
                    let element = body.artists.items[index];
                    let artist = element.name;
                    let id = element.id;
                    html += `<li><a href="/artists/${id}/${artist}" class="search-results" artistid="${id}">${artist}</a></li>`;
                }
                res.send(html);
            });
        }
    });
});

module.exports = router;