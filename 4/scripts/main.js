(function() {
    'use strict';

    angular
        .module('app4', [])
        .directive('smartButton', ['$timeout', _smartButton])
        .directive('makeTransparent', _makeTransparent);

    function _smartButton($timeout) {
        var directive = {
            restrict: 'E',
            template: '<button class="btn btn-success"><span></span>{{text}}</button>',
            scope: {
                text: '@',
            },
            link: function($scope, $element, $attrs){
                $attrs.$observe('loading', function(value){
                    value = (value === "true");
                    $timeout(function(){
                        $element.children('button').children('span').toggleClass('icon-spin6 animate-spin',value);
                        $scope.spinner.isRotating = value;
                    },100);
                });
            },
            controller: function ($scope, $element, $attrs) {
                $scope.spinner = {isRotating: false};
                this.getSpinner = function (){
                    return $scope.spinner;
                };
            }
        };
        return directive;
    }

    function _makeTransparent() {
        var directive = {
            require: 'smartButton',
            restrict: 'A',
            scope: false,
            link: function($scope, $element, $attrs, smartCtrl){
                $scope.smartButtonSpinner = smartCtrl.getSpinner();
                $scope.$watch('smartButtonSpinner.isRotating', function(value){
                    $element.children('button').toggleClass('opacity',value);
                });
            }
        };
        return directive;
    }

})();