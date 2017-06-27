//search overlay
$('#search').on('focus', function(){
    $('#overlay-search-container').css('transform', 'scale(1)');
    $('#overlay-search-input').focus();
});
$('#overlay-search-close').on('click', closeSearch);

function closeSearch() {
    $('#overlay-search-container').css('transform', 'scale(0)');
    $('#overlay-search-input').val('');
    $('#overlay-search-results').empty();
}

function search(e) {
    let artist = $(this).val().trim();
    $.ajax({
        method: 'POST',
        url: '/search?q=' + artist,
    }).then(function (html) {
        $('#overlay-search-results').html(html);   
    });
}

function populateInfo(e) {
    e.preventDefault();
    closeSearch();
    let artist = ($(this).text());
    let id = ($(this).attr('artistid'));

// EVENTS
    $.ajax({
        method: 'POST',
        url: '/events?q=' + artist
    }).then(function(events) {
        console.log(events);

        for (let index = 0; index < events.length; index++) {
            let element = events[index];
            let latLng = new google.maps.LatLng(element.lat, element.lng);
            let marker = new google.maps.Marker({
                position: latLng,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10
                },
                map: map,
                title: element.venue
            });
        } 

        // let date = moment(data[0].date)

        // let month = date.format('MMM')
        // let day = date.format('D')
        // let year = date.format('YYYY')

        // console.log(`
        // ${month}
        // ${day}
        // ${year}
        // `)
    });

// ARTIST BIO
    $.ajax({
        method: 'POST',
        url: '/bio?q=' + artist
    }).then(function(html) {
        $('#information').html(html);
    });

// RELATED ARTISTS
    $.ajax({
        method: 'POST',
        url: '/related_artists?q=' + id
    }).then(function(data) {
        console.log(data);
    });

// TOP TRACKS
    $.ajax({
        method: 'POST',
        url: '/top_tracks?q=' + id
    }).then(function(data) {
        console.log(data);
    });

// ALBUMS
    $.ajax({
        method: 'POST',
        url: '/albums?q=' + id
    }).then(function(data) {
        console.log(data);
    });

    
}



$('#overlay-search-input').on('keydown', _.debounce(search, 200));
$(document).on('click', '.search-results', _.debounce(populateInfo, 1));


//AJAX USING FETCH API
// const spotifyApp = {};
// const credentials = btoa('8f01408378c5438096f5f11e50a9d395'+':'+'cb37a328aaa84304aefdbe043f993412');

// spotifyApp.apiUrl = 'https://accounts.spotify.com/api/token';

// let myHeaders = new Headers();
// myHeaders.append("Authorization", "Basic " + credentials);
// myHeaders.append("Access-Control-Allow-Origin", "https://unlrn.github.io/");

// let params = new URLSearchParams();
// params.append('grant_type', 'client_credentials');

// let spotifyReq = new Request(spotifyApp.apiUrl, {
//     method: 'POST',
//     mode: 'cors',
//     headers: myHeaders,
//     body: params
// });


// spotifyApp.searchArtist = () => fetch(spotifyReq)
//     .then(blob => blob.json())
//     .then(data => console.log(data));


// spotifyApp.init = function() {
//     // spotifyApp.events();
//     spotifyApp.searchArtist();
// };

// $(spotifyApp.init);