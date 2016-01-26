(function() {
  'use strict';

  angular
    .module('jediTool')
    .factory('jediServices', jediServices);

  /** @ngInject */
  function jediServices($http, $rootScope) {
    var currentPlanet = {
      id: 0,
      name: ''
    };
    var planetWS = new WebSocket('ws://jedi.smartjs.academy');
    planetWS.addEventListener("message", function(event) {
        var newData = angular.fromJson(event.data);
        for (var key in newData) {
          currentPlanet[key] = newData[key];
        }
        $rootScope.$applyAsync();
    });

    var service = {
      getCurrentPlanet: getCurrentPlanet
    };

    return service;

    function getCurrentPlanet() {
      return currentPlanet;
    }

  }
})();