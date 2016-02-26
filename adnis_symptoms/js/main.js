(function() {
    var adnis = angular.module('adnis', ['ngResource', 'ui.bootstrap']);

    adnis.controller('SymptomsCtrl', function($scope, $uibModal, SymptomsService, elementsPerPageConst) {
        var symptomsResource = {
            $cancelRequest: function(){}
        };
        var queryParams = {
            skip: 0,
            limit: elementsPerPageConst
        };

        $scope.pagination = {
            itemsPerPage: elementsPerPageConst,
            currentPage: 1
        };

        $scope.getSymptoms = _getSymptoms;

        $scope.getSymptoms();

        $scope.remove = function() {
            var selected = $scope.symptoms.filter(function(symptom){
                return symptom.selected;
            });

            SymptomsService.remove({_id: "53f622a843e3552327c32ffbu"});
        };

        $scope.openModal = function(){
            $uibModal.open({
                templateUrl: 'templates/modalTemplate.html',
                controller: function($scope, $uibModalInstance){
                    $scope.ok = function () {
                        console.log($scope.formData);
                        SymptomsService.save($scope.formData).$promise.then(function(data){
                            $uibModalInstance.dismiss('save');
                            _getSymptoms();
                        });
                    };
                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };

                }
            });
        };

        function _getSymptoms() {
            symptomsResource.$cancelRequest();

            queryParams.skip = ($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage;
            // queryParams.limit = $scope.pagination.itemsPerPage;

            symptomsResource = SymptomsService.query(queryParams);
            symptomsResource.$promise.then(function() {
                $scope.symptoms = symptomsResource;
            });
        }
    });

    adnis.factory('SymptomsService', function($resource) {
        return $resource('http://adnis.smartjs.academy/list/:id', {}, {
            'query': {
                method: 'GET',
                cancellable: true,
                isArray: true,
                transformResponse: function(data) {
                    var dataArr = angular.fromJson(data);
                    result = dataArr.data;
                    result.$total = dataArr.total;
                    return result;
                },
                interceptor: {
                    response: function (response) {
                        response.resource.$total = response.data.$total;
                        return response.resource;
                    }
                }
            },
        });
    });

    adnis.constant('elementsPerPageConst', 10);

    adnis.run(function($http){
        // $http.defaults.headers.common.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IjUzZjMzYzhkMjk0N2NkNDU2ZmI5NGJjMyI.jY0oeE2D3-D14d6Z2WqILKfWR5PTduau6R492czGJ80';
    });
})();