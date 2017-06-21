//search overlay
$('#search').on('focus', function(){
    $('#overlay-search-container').css('transform', 'scale(1)');
    $('#overlay-search-input').focus();
});
$('#overlay-search-close').on('click', function(){
    $('#overlay-search-container').css('transform', 'scale(0)');
    $('#overlay-search-input').val('');
    $('#overlay-search-results').empty();
});

function search(e) {
    let artist = $(this).val().trim();
    $.ajax({
        method: 'POST',
        url: '/search?q=' + artist,
    }).then(function (data) {

        console.log(data);
        let ulist = $('#overlay-search-results');

        $(ulist).empty();

        for (var index = 0; index < data.artists.items.length; index++) {
            var element = data.artists.items[index];
            var artist = element.name;
            var artistLink = element.external_urls.spotify;
            var li = $('<li>');
            var link = $('<a>');
            $(link).text(artist);
            $(link).attr('href', artistLink);
            $(link).appendTo(li);
            $(li).appendTo(ulist);
        }      
    });
}

$('#overlay-search-input').on('keydown', _.debounce(search, 700));


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