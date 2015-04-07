/**
 * Created by Daniel on 4/7/2015.
 */
app.controller('DownloadCtrl', function DownloadCtrl($scope, dlm) {
    $scope.queue = dlm.queue;
});