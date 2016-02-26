(function() {
    var adnis = angular.module('adnis', ['ngResource', 'ui.bootstrap']);

    adnis.controller('SpeciesCtrl', function($scope, SpeciesService, $uibModal) {
        $scope.species = SpeciesService.query();
        $scope.openModal = function(){
            $uibModal.open({
                templateUrl: 'templates/modalTemplate.html',
                controller: function($scope, $uibModalInstance){
                    $scope.formData = {
                        color: generateRandomColor()
                    };


                    $scope.changeColor = function () {
                        debugger;
                    };
                    $scope.randomColor = function() {
                        $scope.formData.color = generateRandomColor();
                    };

                    $scope.ok = function () {
                        console.log($scope.formData);
                        SpeciesService.save($scope.formData);
                    };
                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };

                    function generateRandomColor() {
                        return "#" + ("000000" + (~~(Math.random()*0xffffff)).toString(16)).slice(-6);
                    }

                }
            });
        };
    });

    adnis.factory('SpeciesService', function($resource) {
        return $resource('http://notification.systems/api/species/:id');
    });

    adnis.run(function($http){
        $http.defaults.headers.common.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IjUzZjMzYzhkMjk0N2NkNDU2ZmI5NGJjMyI.jY0oeE2D3-D14d6Z2WqILKfWR5PTduau6R492czGJ80';
    });
})();