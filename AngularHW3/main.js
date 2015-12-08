(function() {
  var app = angular.module('app', []);
  /*app.run(function($rootScope) {
    $rootScope.hideSidebar = function() {
      console.log('1');
    }
  });*/
  app.service('magicService', function() {
    console.log('magicService run');
    var magicObject = {};
    this.addToGroup = function(groupName, ctrl) {
      if (!magicObject[groupName]) {
        magicObject[groupName] = [];
      }
      magicObject[groupName].push(ctrl);
    };

    this.clicedGroup = function(groupName, ctrl) {
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

  });


  app.directive('magicRadio', ['magicService', function(magicService) {
    return {
      restrict: 'E',
      scope: {
        group: '@',
        isChecked: '@'
      },
      controller: function($scope, $element) {
        this.uncheck = function() {
          console.log('uncheck', $element);
          $element.find('input').prop('checked', false);
        };
      },
      require: 'magicRadio',
      link: function($scope, $element, $attrs, magicRadioCtrl) {
        console.log('magicRadioDirective run');
        magicService.addToGroup($scope.group, magicRadioCtrl);
        console.log("El:",$element);
        $element.on('click', function(){
            magicService.clicedGroup($scope.group, magicRadioCtrl);
        });
        $element.find('input').prop('checked', $scope.isChecked);
      },
      template: '<label><input type="radio"> Name: {{group}}</label>'

    };
  }]);

})();