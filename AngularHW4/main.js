(function() {
    var app = angular.module('app', []);
    app.run(['$rootScope', function($rootScope) {
        $rootScope.cards = [{
            place: 1,
            text: "Card1"
        }, {
            place: 2,
            text: "Card2"
        }, {
            place: 3,
            text: "Card3"
        }, {
            place: 4,
            text: "Card4"
        }, {
            place: 5,
            text: "Card5"
        }, {
            place: 6,
            text: "Card6"
        }, {
            place: 7,
            text: "Card7"
        }];
        $rootScope.openCard = function(card) {
            console.log('openCard Function card value:', card);
        };
    }]);

    app.directive('smartjsCarousel', [function() {
        return {
            restrict: 'E',
            template: '<div class="cards-wrapper"><div class="card place{{card.place}}" ng-repeat="card in smartjsItems track by card.place" ng-click="smartjsAction({card: card})">{{card.text}}</div></div>',
            scope: {
                smartjsAction: '&',
                smartjsItems: '='
            },
            link: function($scope, $element, $attrs) {
                var isHovered;
                $element.on('mouseenter', function(){
                    isHovered = true;
                });
                $element.on('mouseleave', function(){
                    isHovered = false;
                });

                var intervalId = setInterval(function() {
                    if (!isHovered) {
                        // $scope.smartjsItems.unshift($scope.smartjsItems.pop());
                        $scope.smartjsItems.forEach(function(card, i, arr) {
                            var currentPlace = card.place;
                            arr[i].place = currentPlace === 7 ? 1 : ++currentPlace;
                        });
                        $scope.$apply();
                    }
                }, 3000);

                $scope.$on('destroy', function(){
                    clearTimeout(intervalId);
                });
            }
        };
    }]);
})();