"use strict";

function bandstalker() {

    this.searchInput = $('#search');

    this.overlaySearchContainer = $('#overlay-search-container');
    this.overlaySearchInput = $('#overlay-search-input');
    this.overlaySearchClose = $('#overlay-search-close');
    this.overlaySearchResults = $('#overlay-search-results');

    this.searchInput.on('focus', this.showSearch.bind(this));

    this.overlaySearchClose.on('click', this.closeSearch.bind(this));
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

$(document).ready(function () {
    window.bandstalker = new bandstalker();
});

