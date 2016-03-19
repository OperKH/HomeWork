(function() {
    var adnis = angular.module('adnis', ['ngResource', 'ui.bootstrap']);

    adnis.controller('SymptomsCtrl', function($scope, $uibModal, SymptomsService, SymptomsServiceList, elementsPerPageConst) {
        var symptomsResource = {
            $cancelRequest: function(){}
        };
        var queryParams = {
            skip: 0,
            limit: elementsPerPageConst
        };

        $scope.isPag = false;

        $scope.$watch('isPag', function(){
            _getSymptoms();
        });

        $scope.pagination = {
            itemsPerPage: elementsPerPageConst,
            currentPage: 1
        };

        $scope.getSymptoms = _getSymptoms;

        // $scope.getSymptoms();

        $scope.remove = function() {
            var selected = $scope.symptoms.filter(function(symptom){
                return symptom.selected;
            });

            var selectedLength = selected.length;
            var index = 0;

            sequenceDelete();

            function sequenceDelete() {
                if (index < selectedLength) {
                    console.log('Delete:',selected[index].key);
                    removeSymptom(selected[index++]._id).then(sequenceDelete);
                } else {
                    _getSymptoms();
                }
            }

            function removeSymptom(id) {
                return SymptomsService.remove({id: id}).$promise;
            }
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
            var service;

            symptomsResource.$cancelRequest();

            if ($scope.isPag) {
                queryParams.skip = ($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage;
                // queryParams.limit = $scope.pagination.itemsPerPage;
                symptomsResource = SymptomsServiceList.query(queryParams);
            } else {
                symptomsResource = SymptomsService.query();
            }

            symptomsResource.$promise.then(function() {
                $scope.symptoms = symptomsResource;
            });
        }
    });

    adnis.factory('SymptomsServiceList', function($resource) {
        return $resource('http://adnis.smartjs.academy/list/:id', {}, {
            query: {
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


    adnis.factory('SymptomsService', function($resource) {
        var authKey = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IjUzZjMzYzhkMjk0N2NkNDU2ZmI5NGJjMyI.jY0oeE2D3-D14d6Z2WqILKfWR5PTduau6R492czGJ80';
        return $resource('http://notification.systems/api/symptoms/:id', {}, {
            query: {
                method: 'GET',
                cancellable: true,
                isArray: true,
                headers: {
                    Authorization: authKey
                }
            },
            save: {
                method: 'POST',
                headers: {
                    Authorization: authKey
                }
            },
            remove: {
                method:'DELETE',
                headers: {
                    Authorization: authKey
                }
            }
        });
    });

    adnis.constant('elementsPerPageConst', 10);

    adnis.run(function($http){
        // $http.defaults.headers.common.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IjUzZjMzYzhkMjk0N2NkNDU2ZmI5NGJjMyI.jY0oeE2D3-D14d6Z2WqILKfWR5PTduau6R492czGJ80';
    });
})();