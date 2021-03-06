"use strict";
let eventMarkers = [];

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

function search() {
    let artist = $(this).val().trim();
    $.ajax({
        method: 'POST',
        url: `/search?q=${artist}`,
    }).then(function (html) {
        $('#overlay-search-results').html(html);   
    });
}

function clearMarkers(markerArr) {
    if (markerArr.length > 0) {
        for (let index = 0; index < markerArr.length; index++) {
            markerArr[index].setMap(null);
 
        }
    }
    markerArr = [];
}

function populateInfo(e) {
    e.preventDefault();
    closeSearch();
    clearMarkers(eventMarkers);
    let artist = ($(this).text());
    let id = ($(this).attr('artistid'));
    

// EVENTS
    $.ajax({
        method: 'POST',
        url: `/events?q=${artist}`
    }).then(function(events) {
        console.log(events);

        for (let index = 0; index < events.length; index++) {
            let element = events[index];
            let latLng = new google.maps.LatLng(element.lat, element.lng);
            let marker = new Marker({
                map: map,
                position: latLng,
                icon: {
                    path: SQUARE_PIN,
                    fillColor: '#ffffff',
                    fillOpacity: 1,
                    strokeColor: '',
                    strokeWeight: 0
                },
	            map_icon_label: '<span class="map-icon map-icon-label"></span>',
                title: element.venue
            });
            eventMarkers.push(marker);
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

// ARTIST
    $.ajax({
        method: 'POST',
        url: `/artist/${id}`
    }).then(function(data) {
        let html = `
            <h4>${data.name}</h4>
            <ul>
                <li>${data.genres[0]}</li>
                <li>${data.genres[1]}</li>
                <li>${data.genres[2]}</li>
            </ul>` 
        $('#artist-name').html(html);

        if (data.images.length == 3) {
            let imgURL = data.images[2].url;
            let avatar = `<img src="${imgURL}" alt="" id="avatar" class="responsive-img">`;
            $("#artist-image").html(avatar);
        } else if (data.images.length == 2) {
            let imgURL = data.images[1].url;
            let avatar = `<img src="${imgURL}" alt="" id="avatar" class="responsive-img">`;
            $("#artist-image").html(avatar);
        } else if (data.images.length == 1) {
            let imgURL = data.images[0].url;
            let avatar = `<img src="${imgURL}" alt="" id="avatar" class="responsive-img">`;
            $("#artist-image").html(avatar);
        } else {
            let avatar = `<i class="fa fa-user-circle" aria-hidden="true"></i>`
            $("artist-image").html(avatar);
        }

    });


// ARTIST BIO
    $.ajax({
        method: 'POST',
        url: `/bio?q=${artist}`
    }).then(function(html) {
        $('#information').html(html);
    });

// RELATED ARTISTS
    $.ajax({
        method: 'POST',
        url: `/artist/${id}/related`
    }).then(function(data) {
        console.log(data);
    });

// TOP TRACKS
    $.ajax({
        method: 'POST',
        url: `/artist/${id}/tracks`
    }).then(function(data) {
        console.log(data);
    });

// ALBUMS
    $.ajax({
        method: 'POST',
        url: `/artist/${id}/albums`
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