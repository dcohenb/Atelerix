var app = angular.module('app', ['ui.router']);

app.config(function ($urlRouterProvider, $stateProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/home");

    // Now set up the states
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "../partials/Home.html",
            controller: 'HomeCtrl'
        })
        .state('search', {
            url: "/search/:query",
            templateUrl: "../partials/Search.html",
            controller: 'SearchCtrl'
        })
        .state('artist', {
            url: "/artist/:artist_id",
            templateUrl: "../partials/Artist.html",
            controller: 'ArtistCtrl'
        })
        .state('settings', {
            url: "/settings",
            templateUrl: "../partials/Settings.html",
            controller: 'SettingsCtrl'
        });
});