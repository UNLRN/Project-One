//search overlay
$('#search').on('focus', function(){
    $('#overlay-search-container').css('transform', 'scale(1)');
    $('#overlay-search-input').focus();
});
$('#overlay-search-close').on('click', function(){
    $('#overlay-search-container').css('transform', 'scale(0)');
    $('#overlay-search-input').val('');
});

const spotifyApp = {};
const credentials = btoa('8f01408378c5438096f5f11e50a9d395'+':'+'cb37a328aaa84304aefdbe043f993412');

spotifyApp.apiUrl = 'https://accounts.spotify.com/api/token';

let myHeaders = new Headers();
myHeaders.append("Authorization", "Basic " + credentials);
myHeaders.append("Access-Control-Allow-Origin", "https://unlrn.github.io/");

let params = new URLSearchParams();
params.append('grant_type', 'client_credentials');

let spotifyReq = new Request(spotifyApp.apiUrl, {
    method: 'POST',
    mode: 'cors',
    headers: myHeaders,
    body: params
});


spotifyApp.searchArtist = () => fetch(spotifyReq)
    .then(blob => blob.json())
    .then(data => console.log(data));


spotifyApp.init = function() {
    // spotifyApp.events();
    spotifyApp.searchArtist();
};

$(spotifyApp.init);