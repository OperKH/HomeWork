(function() {
    var app = angular.module('app', []);

    app.service('magicService', _magicService);
    app.directive('magicRadio', ['magicService', _magicRadio]);

    function _magicService() {
        console.log('magicService run');
        var magicObject = {};
        this.addToGroup = function(groupName, ctrl) {
            if (!magicObject[groupName]) {
                magicObject[groupName] = [];
            }
            magicObject[groupName].push(ctrl);
        };

        this.clickedGroup = function(groupName, ctrl) {
            magicObject[groupName].forEach(function(currCtrl) {
                if (ctrl !== currCtrl) {
                    currCtrl.uncheck();
                }
            });
        };

        this.removeFromGroup = function(groupName, ctrl) {
            var currentGroupArr = magicObject[groupName];
            var indexof = currentGroupArr.indexOf(ctrl);
            if (indexof !== -1) {
                currentGroupArr.splice(indexof, 1);
            }
        };
    }

    function _magicRadio(magicService) {
        return {
            restrict: 'E',
            require: 'magicRadio',
            scope: {
                group: '@',
            },
            controller: function($scope, $element) {
                this.uncheck = function() {
                    console.log('uncheck', $element);
                    $element.find('input').prop('checked', false);
                };
            },
            link: function($scope, $element, $attrs, magicRadioCtrl) {
                console.log('magicRadioDirective run');
                magicService.addToGroup($scope.group, magicRadioCtrl);

                $element.find('input').on('click', function(e) {
                    console.log('"'+$scope.group+'" group clicked');
                    magicService.clickedGroup($scope.group, magicRadioCtrl);
                });

                $scope.$on('$destroy', function(){
                    magicService.removeFromGroup($scope.group, magicRadioCtrl);
                });
            },
            template: '<label><input type="radio">Name: {{group}}</label>'
        };
    }

})();