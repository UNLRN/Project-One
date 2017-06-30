"use strict";

function bandstalker() {

    this.document = $(document);

    this.searchInput = $('#search');

    this.overlaySearchContainer = $('#overlay-search-container');
    this.overlaySearchInput = $('#overlay-search-input');
    this.overlaySearchClose = $('#overlay-search-close');
    this.overlaySearchResults = $('#overlay-search-results');

    this.bio = $('#bio');
    this.tracks = $('#top-tracks');
    this.albums = $('#albums');
    this.events = $('#events');

    this.toggleButton = $('.toggle-button');
    this.artistMain = $('#main');

    this.searchInput.on('focus', this.showSearch.bind(this));
    this.overlaySearchInput.on('keydown', _.debounce(this.search.bind(this), 200));
    this.overlaySearchClose.on('click', this.closeSearch.bind(this));
    this.document.on('click', '.search-results', _.debounce(this.artistBio.bind(this), 1));
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

$(document).ready(function () {
    window.bandstalker = new bandstalker();
});

