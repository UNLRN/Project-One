var artist = $("#arist").val();

$("#submit").on('click', function(e){
    e.preventDefault();

var artist = $("#artist").val();

    $.ajax({
        method: 'GET',
        url: 'https://rest.bandsintown.com/artists/' + artist + '/events?app_id=bootcamp',
    }).then(function(data) {
        console.log(data);

        // for (var i = 0; i < data.length; i++) {
        //     console.log(data[i].venue.name);
        //     var div = $("<li>");
        //     $(div).text(data[i].venue.name);
        //     $(div).appendTo("#events");
        // }
        // for (var i = 0; i < data.length; i++) {
        //     console.log(data[i].datetime);
        //     var div = $("<li>");
        //     $(div).text(data[i].datetime);
        //     $(div).appendTo("#events");
        // }
        for (var i = 0; i < data.length; i++){
            $('#event-table > tbody').append("<tr><td>" + data[i].venue.name + "</td><td>" + data[i].datetime + "</td><td>" + data[i].venue.city + "</td><td>" + data[i].venue.region + "</td><td>" + data[i].venue.country + "</td><td>" + data[i].venue.latitude + "</td><td>" + data[i].venue.longitude + "</td></tr>"
            )};
    });
});