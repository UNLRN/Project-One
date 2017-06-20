let eventLoc = [];

// DEFAULT MAP
$.ajax({
    method: 'GET',
    url: "https://rest.bandsintown.com/artists/pile/events?app_id=gtbc"
}).then(function (data) {
    for (var index = 0; index < data.length; index++) {
        var element = data[index];
        let venue = "venue-" + index;
        let locObj = {};
        locObj[venue] = {
            "latitude": element.venue.latitude,
            "longitude": element.venue.longitude
        };
        eventLoc.push(locObj);
    }
}).then(function () {
    L.mapbox.accessToken = 'pk.eyJ1IjoidW5scm4iLCJhIjoiY2ozejI1cXNqMDBidDMyamtnbzN3b21tMiJ9.YDWSfOH7HuBlj79uo2Ou7A';
    var map = L.mapbox.map('map', 'mapbox.streets')
        .setView([eventLoc[0]["venue-0"].latitude, eventLoc[0]["venue-0"].longitude], 4);
    L.mapbox.styleLayer('mapbox://styles/unlrn/cj44t0yip9y6v2rmrz9br04sk').addTo(map);
    // Add a new line to the map with no points.
    var polyline = L.polyline([], {
        className: "poly-line"
    }).addTo(map);

    // Keep track of points added to the map
    let pointsAdded = 0;

    function add() {
        var index = pointsAdded.toString();
        var lat = eventLoc[index]["venue-" + index].latitude;
        var lng = eventLoc[index]["venue-" + index].longitude;

        // `addLatLng` takes a new latLng coordinate and puts it at the end of the
        // line. 
        polyline.addLatLng(
            L.latLng(lat, lng)
        );
        // Pan the map along with where the line is being added.
        map.panTo([lat, lng], 9);

        if (++pointsAdded < eventLoc.length) window.setTimeout(add, 500);
    }

    // Start drawing the polyline.
    add(eventLoc);
});



// MAPBOX GL
// $.ajax({
//     method: 'GET',
//     url: "https://rest.bandsintown.com/artists/pile/events?app_id=gtbc"
// }).then(function (data) {
//     for (var index = 0; index < data.length; index++) {
//         var element = data[index];
//         let venue = "venue-" + index;
//         let locObj = {};
//         locObj[venue] = {
//             "latitude": element.venue.latitude,
//             "longitude": element.venue.longitude
//         };
//         eventLoc.push(locObj);
//     }
// }).then(function () {
//     mapboxgl.accessToken = 'pk.eyJ1IjoidW5scm4iLCJhIjoiY2ozejI1cXNqMDBidDMyamtnbzN3b21tMiJ9.YDWSfOH7HuBlj79uo2Ou7A';
//     var map = new mapboxgl.Map({
//         container: 'map',
//         style: 'mapbox://styles/unlrn/cj44t0yip9y6v2rmrz9br04sk'
//            // 'mapbox://styles/mapbox/dark-v9'
//     });


//     // Create a GeoJSON source with an empty lineString.
//     var geojson = {
//         "type": "FeatureCollection",
//         "features": [{
//             "type": "Feature",
//             "geometry": {
//                 "type": "LineString",
//                 "coordinates": [
//                     [0, 0]
//                 ]
//             }
//         }]
//     };

//     var speedFactor = 30; // number of frames per longitude degree
//     var animation; // to store and cancel the animation
//     var startTime = 0;
//     var progress = 0; // progress = timestamp - startTime
//     var resetTime = false; // indicator of whether time reset is needed for the animation
//     var pauseButton = document.getElementById('pause');

//     map.on('load', function () {

//         // add the line which will be modified in the animation
//         map.addLayer({
//             'id': 'line-animation',
//             'type': 'line',
//             'source': {
//                 'type': 'geojson',
//                 'data': geojson
//             },
//             'layout': {
//                 'line-cap': 'round',
//                 'line-join': 'round'
//             },
//             'paint': {
//                 'line-color': '#ed6498',
//                 'line-width': 5,
//                 'line-opacity': .8
//             }
//         });

//         startTime = performance.now();

//         animateLine();

//         // click the button to pause or play
//         pauseButton.addEventListener('click', function () {
//             pauseButton.classList.toggle('pause');
//             if (pauseButton.classList.contains('pause')) {
//                 cancelAnimationFrame(animation);
//             } else {
//                 resetTime = true;
//                 animateLine();
//             }
//         });

//         // reset startTime and progress once the tab loses or gains focus
//         // requestAnimationFrame also pauses on hidden tabs by default
//         document.addEventListener('visibilitychange', function () {
//             resetTime = true;
//         });

//         // animated in a circle as a sine wave along the map.
//         function animateLine(timestamp) {
//             if (resetTime) {
//                 // resume previous progress
//                 startTime = performance.now() - progress;
//                 resetTime = false;
//             } else {
//                 progress = timestamp - startTime;
//             }

//             // restart if it finishes a loop
//             if (progress > speedFactor * 360) {
//                 startTime = timestamp;
//                 geojson.features[0].geometry.coordinates = [];
//             } else {
//                 var x = progress / speedFactor;
//                 // draw a sine wave with some math.
//                 var y = Math.sin(x * Math.PI / 90) * 40;
//                 // append new coordinates to the lineString
//                 geojson.features[0].geometry.coordinates.push([x, y]);
//                 // then update the map
//                 map.getSource('line-animation').setData(geojson);
//             }
//             // Request the next frame of the animation.
//             animation = requestAnimationFrame(animateLine);
//         }
//     });
// });