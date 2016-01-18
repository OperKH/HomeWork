(function() {
    var adnis = angular.module('adnis', []);

    adnis.controller('mainCtrl', ['$scope','$http', function($scope, $http) {

        var normalmode = {
            type: 'normal'
        };

        var heatmapMode = {
            type: 'heatmap',
            options: {
                size: 7,
                isPlaying: false,
                position: 100
            }
        };
        $scope.boundingRect = {
            latitude: 5.877674994795961,
            longitude: 38.45339266561527,
            zoom: 5
        };

        $http.defaults.headers.common.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IjUzZjMzYzhkMjk0N2NkNDU2ZmI5NGJjMyI.jY0oeE2D3-D14d6Z2WqILKfWR5PTduau6R492czGJ80';
        $http.get('http://notification.systems/api/filterReports').then(function(resp){
            console.log('resp',resp);
            $scope.reports = resp.data.reports;
        });

        $scope.mode = normalmode;

        $scope.changeMode = function() {
            if ($scope.isHeatMap) {
                $scope.mode = heatmapMode;
            } else {
                $scope.mode = normalmode;
            }
        };

    }]);

    adnis.directive('map', [function() {
        return {
            restrict: 'E',
            scope: {
                reports: '=',
                boundingRect: '=',
                mode: '='
            },
            link: function($scope, $element, $attrs) {
                var group;
                var arrayofMarkers = [];
                var map = L.map($element[0]).setView([$scope.boundingRect.latitude, $scope.boundingRect.longitude], $scope.boundingRect.zoom);
                L.tileLayer(
                    'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
                        id: 'examples.map-9ijuk24y'
                    }
                ).addTo(map);

                $scope.$watch('reports', drawMarkers);

                $scope.$watch('mode', function(newmode, oldmode){
                    console.log('Mode:',newmode);
                    if ($scope.mode.type === "normal") {
                        drawMarkers($scope.reports);
                    } else if ($scope.mode.type === "heatmap") {
                        drawHeatmap();
                    }

                }, true );
                group = new L.featureGroup();
                group.addTo(map);

                var heatLayer = L.heatLayer([], {blur: 10,maxZoom: 10});

                function drawMarkers(newreports, oldreports) {
                    if ($scope.mode.type === "normal") {
                        map.removeLayer(heatLayer);
                        group.clearLayers();
                        if (newreports) {
                            newreports.forEach(function(report) {
                                var loc = report.location;
                                L.marker([loc.latitude, loc.longitude]).addTo(group);
                            });
                            map.fitBounds(group.getBounds().pad(0.1));
                        }
                    }
                }
                function drawHeatmap(){
                    if ($scope.mode.type === "heatmap") {
                        group.clearLayers();
                        map.removeLayer(heatLayer);

                        latLngs = $scope.reports.map(report => [report.location.latitude, report.location.longitude]);
                        heatLayer.setLatLngs(latLngs);
                        map.addLayer(heatLayer);
                    }
                }

            },
            controller: function($scope, $element, $attrs) {

            },
        };
    }]);
})();