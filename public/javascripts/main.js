"use strict";

function bandstalker() {

    this.eventMarkers = [];

    this.document = $(document);

    this.searchInput = $('#search');
    this.searchIcon = $('.fa-search');

    this.overlaySearchContainer = $('#overlay-search-container');
    this.overlaySearchInput = $('#overlay-search-input');
    this.overlaySearchClose = $('#overlay-search-close');
    this.overlaySearchResults = $('#overlay-search-results');

    this.bio = $('#bio');
    this.tracks = $('#tracks');
    this.albums = $('#albums');
    this.events = $('#event-container');

    this.toggleButton = $('.toggle-button');
    this.artistMain = $('#main');

    this.searchInput.on('focus', this.showSearch.bind(this));
    this.searchIcon.on('click', this.showSearch.bind(this));
    this.overlaySearchInput.on('keydown', _.debounce(this.search.bind(this), 200));
    this.overlaySearchClose.on('click', this.closeSearch.bind(this));
    this.document.on('click', '.search-results', this.clearMarkers.bind(this));
    this.document.on('click', '.search-results', this.artistInfo.bind(this));
    this.document.on('click', '.search-results', this.artistBio.bind(this));
    this.document.on('click', '.search-results', this.artistTracks.bind(this));
    this.document.on('click', '.search-results', this.artistEvents.bind(this));
    this.document.on('click', '.search-results', this.closeSearch.bind(this));
    this.toggleButton.on('click', this.toggleInfo.bind(this));
}

bandstalker.prototype.showSearch = function () {
    this.overlaySearchContainer.css('transform', 'scale(1)');
    this.overlaySearchInput.focus();
};

bandstalker.prototype.closeSearch = function () {
    this.overlaySearchContainer.css('transform', 'scale(0)');
    this.overlaySearchInput.val('');
    this.overlaySearchResults.empty();
};

bandstalker.prototype.toggleInfo = function () {
    this.artistMain.toggleClass("in");
    this.toggleButton.toggleClass("on");
};

bandstalker.prototype.search = function () {
    let $this = this;
    let artist = this.overlaySearchInput.val().trim();
    $.ajax({
        method: 'POST',
        url: `/artist?q=${artist}`,
    }).then(function (html) {
        $this.overlaySearchResults.html(html);   
    });
};

bandstalker.prototype.artistBio = function (e) {
    e.preventDefault();
    let $this = this;
    let artist = e.target.text;
    $.ajax({
        method: 'POST',
        url: `/artist/bio?q=${artist}`
    }).then(function(html) {
        $this.bio.html(html);
    });
};

bandstalker.prototype.artistInfo = function (e) {
    e.preventDefault
    let $this = this;
    let id = $(e.target).attr('artistid');
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
    })
};

bandstalker.prototype.artistTracks = function (e) {
    let $this = this;
    let id = $(e.target).attr('artistid');
    $.ajax({
        method: 'POST',
        url: `/artist/${id}/tracks`
    }).then(function(html) {
        $this.tracks.html(html);
    });
}

bandstalker.prototype.artistEvents = function (e) {
    let $this = this
    let artist = e.target.text;
    $.ajax({
        method: 'POST',
        url: `/artist/events?q=${artist}`
    }).then(function(data) {

        let image = {
            url: '../images/placeholder.png',
            size: new google.maps.Size(48, 48),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(24, 48)
        }

        for (let index = 0; index < data.events.length; index++) {
            let element = data.events[index];
            let latLng = new google.maps.LatLng(element.lat, element.lng);
            let marker = new google.maps.Marker({
                map: map,
                position: latLng,
                icon: image,
                title: element.venue
            });
            $this.eventMarkers.push(marker);
        } 
        $this.events.html(data.html)
    });
};

bandstalker.prototype.clearMarkers = function () {
    let $this = this;
    if ($this.eventMarkers.length > 0) {
        for (let index = 0; index < $this.eventMarkers.length; index++) {
            $this.eventMarkers[index].setMap(null);
        }
    }
    $this.eventMarkers = [];
};

$(document).ready(function () {
    window.bandstalker = new bandstalker();
});

