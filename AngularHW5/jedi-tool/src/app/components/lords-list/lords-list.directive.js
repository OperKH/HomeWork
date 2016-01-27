(function() {
  'use strict';

  angular
    .module('jediTool')
    .directive('lordsList', lordsList);

  /** @ngInject */
  function lordsList(jediServices) {
    var directive = {
      restrict: 'E',
      scope: {},
      // template: '<img>',
      templateUrl: 'app/components/lords-list/lords-list.template.html',
      link: linkFunc
    };

    return directive;

    function linkFunc($scope) {
      $scope.lords = jediServices.getLords();
      console.log($scope.lords);
    }

  }

})();