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
        $rootScope.$applyAsync(function() {
          for (var key in newData) {
            currentPlanet[key] = newData[key];
          }
        });
    });

    var lordDefaultURL = 'http://jedi.smartjs.academy/dark-jedis/';
    var lords = [{},{},{},{},{}];




    var service = {
      getCurrentPlanet: getCurrentPlanet,
      getLords: getLords
    };
    return service;




    function getCurrentPlanet() {
      return currentPlanet;
    }

    function getLords() {
      if (!(lords.filter(function(lord){return lord.data;})).length) {
        getAllLords();
      }
      return lords;
    }

    function getAllLords() {
      var index = 0;
      var url = lordDefaultURL;

      httpGet(url)
        .then(applyData)
        .then(httpGet)
        .then(applyData)
        .then(httpGet)
        .then(applyData)
        .then(httpGet)
        .then(applyData)
        .then(httpGet)
        .then(applyData);

      function httpGet(url) {
        return $http.get(url);
      }

      function applyData(resp) {
        url = resp.data.master.url;
        $rootScope.$applyAsync(function() {
          lords[index++].data = resp.data;
        });
        return url;
      }

    }


  }
})();