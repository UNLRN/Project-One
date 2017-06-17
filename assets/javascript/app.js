var access_token, artist, newArtist, artistID;
var queryURL = "https://accounts.spotify.com/api/token";
const client_id = "f643b2a87f9247c8ab46f34bdea47061";
const client_secret = "16b82d650ecf478a940efe3eae7d2ff1";

function search(e) {

    artist = $(this).val().trim();
    newArtist = artist.split(' ').join('%20');

    $.ajax({
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(client_id + ":" + client_secret));
            xhr.setRequestHeader("Access-Control-Request-Header", "*");
        },
        crossDomain: true,
        data: { grant_type: 'client_credentials' },
    }).then(function(data) {

        console.log(data.access_token);

        accessToken = data.access_token;

        $.ajax({
            method: "GET",
            url: "https://api.spotify.com/v1/search?q=" + newArtist + '*&type=artist',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }

        }).then(function(data) {

            console.log(data);

            $("#band-info-div").empty();

            var div = $('<div>');

            var ulist = $('<ul>');

            for (var index = 0; index < data.artists.items.length; index++) {
                var element = data.artists.items[index];
                var artist = element.name;
                var li = $('<li>');
                $(li).text(artist);
                $(li).appendTo(ulist);
            }

            $(ulist).appendTo(div);
            $(div).appendTo("#band-info-div");

        });

    })
}

$("#band-search").on("keydown", _.debounce(search, 700));

$("#artist-info").on("click", function() {
	// artist
    $.ajax({
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(client_id + ":" + client_secret));
            xhr.setRequestHeader("Access-Control-Request-Header", "*");
        },
        crossDomain: true,
        data: { grant_type: 'client_credentials' },

    }).then(function(data) {

        console.log(data.access_token);

        accessToken = data.access_token;

        $.ajax({
            method: "GET",
            url: "https://api.spotify.com/v1/artists/1w5Kfo2jwwIPruYS2UWh56",
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }

        }).then(function(data) {

            console.log(data);

        })
    });

    // album
    $.ajax({
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(client_id + ":" + client_secret));
            xhr.setRequestHeader("Access-Control-Request-Header", "*");
        },
        crossDomain: true,
        data: { grant_type: 'client_credentials' },

    }).then(function(data) {

        console.log(data.access_token);

        accessToken = data.access_token;

        $.ajax({
            method: "GET",
            url: "https://api.spotify.com/v1/artists/1w5Kfo2jwwIPruYS2UWh56/albums",
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }

        }).then(function(data) {

            console.log(data);

        })
    });

    // top tracks
    $.ajax({
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(client_id + ":" + client_secret));
            xhr.setRequestHeader("Access-Control-Request-Header", "*");
        },
        crossDomain: true,
        data: { grant_type: 'client_credentials' },

    }).then(function(data) {

        console.log(data.access_token);

        accessToken = data.access_token;

        $.ajax({
            method: "GET",
            url: "https://api.spotify.com/v1/artists/1w5Kfo2jwwIPruYS2UWh56/top-tracks?country=US",
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }

        }).then(function(data) {

            console.log(data);

        })
    });

    // related albums
    $.ajax({
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(client_id + ":" + client_secret));
            xhr.setRequestHeader("Access-Control-Request-Header", "*");
        },
        crossDomain: true,
        data: { grant_type: 'client_credentials' },

    }).then(function(data) {

        console.log(data.access_token);

        accessToken = data.access_token;

        $.ajax({
            method: "GET",
            url: "https://api.spotify.com/v1/artists/1w5Kfo2jwwIPruYS2UWh56/related-artists",
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }

        }).then(function(data) {

            console.log(data);

        })
    });
});
