const express = require('express');
const router = express.Router();
const request = require('request');
const moment = require('moment');
const async = require('async');

let routecalled = 0;

router.get('/:id/:artist', function (req, res) {
    console.log(req.url);
    const artist = req.params.artist;
    const id = req.params.id;

    const client_id = process.env.SPOTIFY_ID;
    const client_secret = process.env.SPOTIFY_SECRET;
    const api_key = process.env.LASTFM_KEY;

    let bio, events, artistName, avatar, genres, tracks,
    albums;

    const spotifyOptions = function (url, token) {
        let options = {
            url: 'https://api.spotify.com/v1/artists/' + url,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: true
        };
        return options;
    };

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

    async.parallel([
            (callback) => {
                //SPOTIFY
                request.post(authOptions, function (error, response, body) {
                    if (!error && response.statusCode === 200) {

                        // use the access token to access the Spotify Web API
                        let token = body.access_token;

                        //ARTIST INFO
                        let artistInfoOptions = spotifyOptions(id, token);
                        request.get(artistInfoOptions, function (error, response, body) {
                            console.log(error);
                            artistName = `<h4>${body.name}</h4>`;
                            genres = `<ul>
                                ${body.genres[0] ? `<li>${body.genres[0]}</li>` : ``}
                                ${body.genres[1] ? `<li>${body.genres[1]}</li>` : ``}
                                ${body.genres[2] ? `<li>${body.genres[2]}</li>` : ``}
                          </ul>`;

                            if (body.images.length >= 3) {
                                let imgURL = body.images[2].url;
                                avatar = `<img src="${imgURL}" alt="" id="avatar" class="responsive-img">`;
                            } else if (body.images.length >= 2) {
                                let imgURL = body.images[1].url;
                                avatar = `<img src="${imgURL}" alt="" id="avatar" class="responsive-img">`;
                            } else if (body.images.length >= 1) {
                                let imgURL = body.images[0].url;
                                avatar = `<img src="${imgURL}" alt="" id="avatar" class="responsive-img">`;
                            } else if (body.images.length === 0) {
                                avatar = `<i class="fa fa-user-circle" aria-hidden="true"></i>`;
                            }
                            callback();
                        });
                    }
                });
            },
            // (callback) => {
            //     request.post(authOptions, function (error, response, body) {
            //         if (!error && response.statusCode === 200) {

            //             // use the access token to access the Spotify Web API
            //             let token = body.access_token;
                       
            //             // TOP TRACKS
            //             let topTrackOptions = spotifyOptions((id + '/top-tracks?country=US'), token);
            //             request.get(topTrackOptions, function (error, response, body) {
            //                 console.log(error);
            //                 for (let i = 0; i < 5; i++) {
            //                     let uri = body.tracks[i].uri;

            //                     tracks += `<iframe src="https://open.spotify.com/embed?uri=${uri}" width="100%" height="80" frameborder="0" allowtransparency="true" id="iframe"></iframe>`;
            //                 }
            //                 callback();
            //             });
            //         }
            //     });
            // },
            // (callback) => {
            //     request.post(authOptions, function (error, response, body) {
            //         if (!error && response.statusCode === 200) {

            //             // use the access token to access the Spotify Web API
            //             let token = body.access_token;
            //             // ARTIST ALBUMS
            //             let artistAlbumOptions = spotifyOptions((id + '/albums?market=US'), token);
            //             request.get(artistAlbumOptions, function (error, response, body) {
            //                 console.log(error);
            //                 for (let i = 0; i < 5; i++) {
            //                     let albumURI = body.items[i].uri;

            //                     albums += `<iframe src="https://open.spotify.com/embed?uri=${albumURI}" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>`;
            //                 }
            //                 callback();
            //             });
            //         }
            //     });
            // },
            (callback) => {
                // BIO
                let bioOptions = {
                    url: 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artist + '&api_key=' + api_key + '&format=json',
                    json: true
                };
                request.get(bioOptions, function (error, response, body) {
                    bio = `<p>${body.artist.bio.summary}</p>`;
                    callback();
                });

            },
            (callback) => {
                // EVENTS
                let eventOptions = {
                    url: 'https://rest.bandsintown.com/artists/' + artist + '/events?app_id=bootcamp',
                    json: true
                };
                request.get(eventOptions, function (error, response, body) {
                    let eventsArray = [];
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
                        let month = date.format('MMM');
                        let day = date.format('D');
                        let info = `<div id="infowindow">
                            <h3>${artist}</h3>
                            <div id="content">
                                <div>
                                    <h5>${month} ${day}</h5>
                                    <h6>${venue}</h6>
                                    <h6>${city} ${region} ${country}</h6>
                                </div>
                                <div class="map-ticket">
                                    <a href="${url}">tickets</a>
                                </div>
                            </div>
                        </div>`;

                        eventsArray.push({
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
                    events = {
                        eventsArray: eventsArray,
                        html: html
                    };
                    callback();
                });
            }
        ],
        () => {
            res.render('artists', {
                bio: bio,
                artistName: artistName,
                avatar: avatar,
                genres: genres,
                tracks: tracks,
                albums: albums,
                events: events
            });
        });
});

module.exports = router;