(function() {
    var app = angular.module('app', []);
    app.run(['$rootScope', function($rootScope) {
        $rootScope.cards = [{
            id: 1,
            text: "Card1"
        }, {
            id: 2,
            text: "Card2"
        }, {
            id: 3,
            text: "Card3"
        }, {
            id: 4,
            text: "Card4"
        }, {
            id: 5,
            text: "Card5"
        }, {
            id: 6,
            text: "Card6"
        }, {
            id: 7,
            text: "Card7"
        }];
        $rootScope.openCard = function(card) {
            debugger
            console.log('openCard', card);
        };
    }]);

    app.directive('smartjsCarousel', [function() {
        return {
            restrict: 'E',
            template: '<div class="cards-wrapper"><div class="card place{{$index+1}}" ng-repeat="card in smartjsItems track by card.id">{{card.text}}</div></div>',
            scope: {
                smartjsAction: '@',
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
                // $element.on('click', function(e){
                //     var currentElement = e.target;
                //     while (currentElement) {
                //         if (currentElement.classList) {
                //             var classListLength = currentElement.classList.length;
                //             for (var i = 0; i < classListLength; i++) {
                //                 var currentClassName = currentElement.classList[i];
                //                 if (currentClassName === 'card') {
                //                     console.log('clicked on Card');
                //                     return;
                //                 }
                //             }
                //         }
                //         currentElement = currentElement.parentNode;
                //     }
                // });
                var intervalId = setInterval(function() {
                    if (!isHovered) {
                        $scope.smartjsItems.unshift($scope.smartjsItems.pop());
                        $scope.$apply();
                    }
                }, 3000);

                $scope.$on('destroy', function(){
                    clearTimeout(intervalId);
                });
            },
            controller: function($scope, $element, $attrs) {

            },
        };
    }]);
})();