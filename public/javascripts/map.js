var map = new google.maps.Map(document.getElementById('map'), {
    scrollwheel: false,
    center: {
        lat: -34.397,
        lng: 150.644
    },
    zoom: 7
});

function initVenues(beg, wypts, end) {

    console.log(wypts);
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    // Set destination, origin and travel mode.
    var request = {
        origin: beg,
        waypoints: wypts,
        destination: end,
        travelMode: 'DRIVING',
        optimizeWaypoints: false
    };

    // Pass the directions request to the directions service.
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (response, status) {
        if (status == 'OK') {
            // Display the route on the map.
            directionsDisplay.setDirections(response);
        }
    });
}



$.ajax({
    method: 'GET',
    url: 'https://rest.bandsintown.com/artists/metallica/events?app_id=gtbc'
}).then(function(data) {
    console.log(data);
    let eventLocations = [];
    for (var index = 0; index < 5; index++) {
        var element = data[index];
        let latLng = new google.maps.LatLng(element.venue.latitude, element.venue.longitude);
        let loc = { location: latLng, stopover: true };
        eventLocations.push(loc);
    }
    let origin = eventLocations[0].location;
    let waypoints = eventLocations.slice(1, (eventLocations[eventLocations.length-1]));
    let destination = eventLocations[eventLocations.length-1].location;

    initVenues(origin, waypoints, destination);

});


