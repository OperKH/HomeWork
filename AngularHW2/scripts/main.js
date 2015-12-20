(function() {
    'use strict';

    angular
        .module('app4', [])
        .directive('actionOnClickOutside', ['$document',_actionOnClickOutside])
        .run(['$rootScope', rubBlock]);

    function _actionOnClickOutside($document) {
        var directive = {
            restrict: 'A',
            scope: false,
            link: function($scope, $element, $attrs){
                console.log('Directive actionOnClickOutside run');

                $document[0].addEventListener('click', clickOutside, true);
                $scope.$on('$destroy', function(){
                    $document[0].removeEventListener('click', clickOutside, true);
                });

                function clickOutside(e) {
                    var currentNode = e.target;
                    var isOutsideSidebar = true;
                    while (currentNode) {
                        if (currentNode === $element[0]) {
                            isOutsideSidebar = false;
                            break;
                        }
                        currentNode = currentNode.parentNode;
                    }
                    console.log(isOutsideSidebar ? "Outside" : "Inside");
                    if (isOutsideSidebar) {
                        $scope.$eval($attrs.actionOnClickOutside);
                        $scope.$apply();
                    }
                }

            }
        };
        return directive;
    }

    function rubBlock($rootScope){
        $rootScope.test = {};
        $rootScope.showSidebar = function () {
            $rootScope.test.showSidebar = true;
        };
        $rootScope.hideSidebar = function () {
            $rootScope.test.showSidebar =  false;
            //Этой строчки здесь быть не должно, поправьте код директивы
            // $rootScope.$apply();
        };
    }
})();