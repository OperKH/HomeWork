var app = angular.module('app', []);

app.controller('someController', ['$scope', '$rootScope', 'mainService', function($scope, $rootScope, mainService) {
    $scope.userRating = mainService.getUserRating();
    // $rootScope.$on('dataLoaded', function() {
    //     console.log($scope.userRating);
    // });
}]);

app.service('mainService', ['$http', '$rootScope', function($http, $rootScope) {
    var userRating = {
        data: {}
    };

    this.getUserRating = function() {
        return userRating;
    };
    $http.get('http://rating.smartjs.academy/rating?hardMode').then(function(response) {
        userRating.data = response.data;
        console.log("Start Version:", userRating.data.version);
        $rootScope.$applyAsync();
        // $rootScope.$emit('dataLoaded');
    });

    var ws = new WebSocket('ws://rating.smartjs.academy/rating');
    ws.addEventListener("message", function(event) {
        console.log(event.data);

        var newData = JSON.parse(event.data);

        if (!newData.status) {
            updateData(newData);
        }
    });

    var patches = [];
    function updateData(newData) {
        patches.push(newData);
        var currentVersion = userRating.data.version;

        if (currentVersion){

            while (patches.length) {
                var patch = patches.splice(0,1)[0];
                var fromVersion = patch.fromVersion;
                var toVersion = patch.toVersion;

                if (userRating.data.version === fromVersion) {

                    if (patch.updates.length) {


                        patch.updates.forEach(function(updatedObj) {
                            var id = updatedObj.id;


                            userRating.data.records.forEach(function(oldObj, index) {
                                if (oldObj.id === id) {
                                    userRating.data.records[index].points = updatedObj.points;
                                    // console.log(updatedObj.points);
                                    return;
                                }
                            });


                        });


                    }
                    userRating.data.version = toVersion;
                    console.log('Patched to version:', toVersion);
                    $rootScope.$applyAsync();

                } else {
                    console.warn('Patch Error!!!');
                }

            }

        }

    }
}]);

