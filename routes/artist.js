const express = require('express');
const router = express.Router();
const request = require('request');


router.get('/', function (req, res) {
    res.render('search');
});

router.post('/', function (req, res, next) {
    const artist = req.param('q');


    let client_id = '8f01408378c5438096f5f11e50a9d395';
    let client_secret = 'cb37a328aaa84304aefdbe043f993412';

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
                    html += `<li><a href="#" class="search-results" artistid="${id}">${artist}</a></li>`;
                }
                res.send(html);
            });
        }
    });
});

router.post('/bio', function (req, res) {
    const artist = req.param('q');
    const api_key = '31a1c50e2e441abc5e49871a165bad68';

    let options = {
        url: 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artist + '&api_key=' + api_key + '&format=json',
        json: true
    };
    request.get(options, function (error, response, body) {
        let html = `<p>${body.artist.bio.summary}</p>`
        res.send(html);
    });
});

router.post('/events', function (req, res) {
    let artist = req.param('q');

    let options = {
        url: 'https://rest.bandsintown.com/artists/' + artist + '/events?app_id=bootcamp',
        json: true
    };
    request.get(options, function (error, response, body) {
        let events = [];
        for (let index = 0; index < body.length; index++) {
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

router.post('/:id', function (req, res) {
    const id = req.params.id;


    const client_id = '8f01408378c5438096f5f11e50a9d395';
    const client_secret = 'cb37a328aaa84304aefdbe043f993412';

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
                url: 'https://api.spotify.com/v1/artists/' + id,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function (error, response, body) {
                res.send(body);
            });
        }
    });
});

router.post('/:id/related', function (req, res) {
    const artistID = req.params.id;


    const client_id = '8f01408378c5438096f5f11e50a9d395';
    const client_secret = 'cb37a328aaa84304aefdbe043f993412';

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

            // albums
            let options = {
                url: 'https://api.spotify.com/v1/artists/' + artistID + '/related-artists',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function (error, response, body) {

                let resObj = [];

                for (let i = 0; i < body.artists.length; i++) {
                    let artistName = body.artists[i].name;
                    let artistImage = body.artists[i].images;
                    let artistURL = body.artists[i].external_urls.spotify;
                    let artistGenres = body.artists[i].genres;

                    let temp = {
                        artist: artistName,
                        image: artistImage,
                        url: artistURL,
                        genres: artistGenres
                    }

                    resObj.push(temp);
                }

                res.send(resObj);
            });
        }
    });
});

router.post('/:id/albums', function (req, res) {
    const artistID = req.params.id;


    let client_id = '8f01408378c5438096f5f11e50a9d395';
    let client_secret = 'cb37a328aaa84304aefdbe043f993412';

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

            // albums
            let options = {
                url: 'https://api.spotify.com/v1/artists/' + artistID + '/albums',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function (error, response, body) {

                let resObj = [];

                for (let i = 0; i < body.items.length; i++) {
                    let albumName = body.items[i].name;
                    let albumURL = body.items[i].external_urls.spotify;
                    let albumImage = body.items[i].images;

                    let temp = {
                        album: albumName,
                        image: albumImage,
                        url: albumURL
                    }

                    resObj.push(temp);
                }

                res.send(resObj);
            });
        }
    });
});

router.post('/:id/tracks', function (req, res) {
    const artistID = req.params.id;

    let client_id = '8f01408378c5438096f5f11e50a9d395';
    let client_secret = 'cb37a328aaa84304aefdbe043f993412';

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

            // albums
            let options = {
                url: 'https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?country=US',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function (error, response, body) {

                let resObj = [];

                for (let i = 0; i < body.tracks.length; i++) {
                    let topTrackName = body.tracks[i].name;
                    let topTrackURL = body.tracks[i].external_urls.spotify;

                    let temp = {
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