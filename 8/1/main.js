var app = angular.module('app', ['ngAnimate']);

app.controller('someController', ['$scope', '$rootScope', 'mainService', function($scope, $rootScope, mainService) {
    $scope.userRating = mainService.getUserRating();
}]);

app.service('mainService', ['$http', '$rootScope', function($http, $rootScope) {
    var userRating = {};
    var patches = [];

    this.getUserRating = function() {
        return userRating;
    };

    var ws = new WebSocket('ws://rating.smartjs.academy/rating');
    ws.addEventListener("message", function(event) {
        console.log(event.data);
        var newData = JSON.parse(event.data);
        if (!newData.status) {
            updateData(newData);
        }
    });

    $http.get('http://rating.smartjs.academy/rating?hardMode').then(function(response) {
        initUserRating(response.data);
    });


    function updateData(newData) {
        if (userRating.version){
            patchUserRating(newData);
        } else {
            patches.push(newData);
        }
    }

    function initUserRating(data) {
        _.merge(userRating, data);
        console.log("Start Version:", userRating.version);
        if (patches.length) {
            while (patches.length) {
                var patch = patches.splice(0, 1)[0];
                patchUserRating(patch);
            }
        } else {
            userRatingSort();
        }
    }

    function patchUserRating(patch) {
        var currentVersion = userRating.version;
        var fromVersion = patch.fromVersion;
        var toVersion = patch.toVersion;

        if (userRating.version === fromVersion && patch.updates.length) {

            patch.updates.forEach(function(updatedObj) {
                var id = updatedObj.id;
                userRating.records.forEach(function(oldObj, index) {
                    if (oldObj.id === id) {
                        userRating.records[index].points = updatedObj.points;
                        console.log(updatedObj.points);
                        return;
                    }
                });

            });
        } else if (userRating.version !== fromVersion) {
            console.warn('Patch Error!!!');
        }
        userRating.version = toVersion;
        console.log('Patched to version:', toVersion);
        userRatingSort();
        $rootScope.$applyAsync();
    }

    function userRatingSort(){
        userRating.records = _.sortByOrder(userRating.records, ['points', 'name'], ['desc', 'asc']);
    }

}]);

