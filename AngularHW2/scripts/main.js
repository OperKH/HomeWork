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
                console.log('I am run')
                $document.on('click',function(e){
                    var currentNode = e.target;
                    var isOutsideSidebar = true;
                    while (currentNode) {
                        if (currentNode === $element[0]) {
                            isOutsideSidebar = false;
                        break;
                        }
                        currentNode = currentNode.parentNode;
                    }
                    console.log(isOutsideSidebar?"Outside":"Inside");
                    // $element.toggleClass('sidebar-hidden',isOutsideSidebar)
                    // if (isOutsideSidebar) {
                    //     $scope.$eval("hideSidebar()");
                    // }

                })
            },
        };
        return directive;
    }

    function rubBlock($rootScope){
        $rootScope.test = {};
        $rootScope.showSidebar = function () {
            $rootScope.test.showSidebar = true;
        }
        $rootScope.hideSidebar = function () {
            $rootScope.test.showSidebar =  false;
            //Этой строчки здесь быть не должно, поправьте код директивы
            $rootScope.$apply();
        }
    }
})();