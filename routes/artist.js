const express = require('express');
const router = express.Router();
const request = require('request');
const moment = require('moment');


router.get('/', function (req, res) {
    res.render('artist');
});

router.post('/', function (req, res, next) {
    const artist = req.param('q');


    let client_id = process.env.SPOTIFY_ID;
    let client_secret = process.env.SPOTIFY_SECRET;

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
    const api_key = process.env.LASTFM_KEY;

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
        let eventData = [];
        let events = [];
        let html = "";
        for (let index = 0; index < body.length; index++) {
            let date = moment(body[index].datetime);
            let element = body[index].venue;
            let venue = element.name;
            let city = element.city;
            let region = element.region;
            let country = element.country;
            let latitude = element.latitude;
            let longitude = element.longitude;
            let url = body[index].url;
            let month = date.format('MMM')
            let day = date.format('D')
            let info = `
            <div id="infowindow">
                <h3>${artist}</h3>
                <div id="content">
                    <div class="date">
                        <span class="month">${month}</span>
                        <span class="day">${day}</span>
                    </div>
                    <div class="location">
                        <span class="venue">${venue}</span>
                        <span class="city">${city} ${region} ${country}</span>
                    </div>
                    <div class="ticket">
                        <a href="${url}">tickets</a>
                    </div>
                </div>
            </div>
            `;

            events.push({
                venue: venue,
                lat: latitude,
                lng: longitude,
                info: info
            });

            html += `<div class="event">
                        <div class="date">
                            <span class="month">${month}</span>
                            <span class="day">${day}</span>
                        </div>
                        <div class="location">
                            <span class="venue">${venue}</span>
                            <span class="city">${city} ${region} ${country}</span>
                        </div>
                        <div class="ticket">
                            <a href="${url}">tickets</a>
                        </div>
                    </div>`;
        }
        let data = {
            events: events,
            html: html
        }

        res.send(data);
    });
});

router.post('/:id', function (req, res) {
    const id = req.params.id;


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


    let client_id = process.env.SPOTIFY_ID;
    let client_secret = process.env.SPOTIFY_SECRET;

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

    let client_id = process.env.SPOTIFY_ID;
    let client_secret = process.env.SPOTIFY_SECRET;

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

                let html = "";
                for (let i = 0; i < body.tracks.length; i++) {
                    let uri = body.tracks[i].uri;
                    html += `<iframe src="https://open.spotify.com/embed?uri=${uri}" width="100%" height="80" frameborder="0" allowtransparency="true" id="iframe"></iframe>`;
                }

                res.send(html);
            });
        }
    });
});

module.exports = router;