(function() {
  'use strict';

  angular
    .module('jediTool')
    .directive('planetMonitor', planetMonitor);

  /** @ngInject */
  function planetMonitor(jediServices) {
    var directive = {
      restrict: 'E',
      scope: {},
      template: '<h1 class="css-planet-monitor">Obi-Wan currently on {{currentPlanet.name}}</h1>',
      link: linkFunc
    };

    return directive;

    function linkFunc($scope) {
      $scope.currentPlanet = jediServices.getCurrentPlanet();
    }

  }

})();