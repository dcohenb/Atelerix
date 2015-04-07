/**
 * Created by Daniel on 4/7/2015.
 */
app.controller('ArtistCtrl', function ArtistCtrl($scope, $stateParams) {
    var mb = require('musicbrainz');

    mb.lookupArtist($stateParams.artist_id, ["releases"], null, function (error, artist) {
        $scope.artist = artist;

        /*var Kickass = require('node-kickass'),
            k = new Kickass();

        k.setQuery(query + ' category:music')   // Set search Query parameter
            .run(function (errors, data) {
                if (!errors.length > 0) {
                    // No errors occurred.
                    $scope.searchResults = this.items;
                    $scope.$digest();
                } else {
                    // One or more errors occurred.
                    console.warn(errors, "errors");
                }
            });*/
    });
});