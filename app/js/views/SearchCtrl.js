/**
 * Created by Daniel on 4/7/2015.
 */
app.controller('SearchCtrl', function SearchCtrl($scope, $stateParams) {
    var mb = require('musicbrainz');

    mb.searchArtists($stateParams.query, null, null, function (err, results) {
        $scope.results = results;
        $scope.$digest();
    });
});