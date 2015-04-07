/**
 * Created by Daniel on 4/7/2015.
 */
app.controller('HeaderCtrl', function HeaderCtrl($scope, $state) {
    $scope.searchSubmitHandler = function (e) {
        $state.go('search', {query: $scope.searchQuery});
    }
});