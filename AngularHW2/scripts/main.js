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
            link: function (scope, el, attrs) {
                $document[0].addEventListener('click', clickOutsideHandler, true);
                scope.$on('$destroy', function(){
                    $document[0].removeEventListener('click', clickOutsideHandler, true);
                });

                function clickOutsideHandler(e) {
                    if (el !== e.target && !el[0].contains(e.target)) {
                        scope.$applyAsync(function () {
                            scope.$eval(attrs.clickOutside);
                        });
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
