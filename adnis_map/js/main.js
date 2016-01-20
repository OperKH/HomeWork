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
                isPlaying: true,
                position: 0
            }
        };
        this.boundingRect = {
            latitude: 5.877674994795961,
            longitude: 38.45339266561527,
            zoom: 5
        };

        $http.defaults.headers.common.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IjUzZjMzYzhkMjk0N2NkNDU2ZmI5NGJjMyI.jY0oeE2D3-D14d6Z2WqILKfWR5PTduau6R492czGJ80';
        $http.get('http://notification.systems/api/filterReports').then(resp => {
            console.log('resp',resp);
            this.reports = resp.data.reports;
        });

        this.mode = normalmode;

        this.changeMode = () => {
            if (this.isHeatMap) {
                this.mode = heatmapMode;
            } else {
                this.mode = normalmode;
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
                var datesArr, minDate, maxDate, size, timeoutID;
                var map = L.map($element[0]).setView([$scope.boundingRect.latitude, $scope.boundingRect.longitude], $scope.boundingRect.zoom);
                var group = new L.markerClusterGroup();
                var heatLayer = L.heatLayer([], {blur: 10,maxZoom: 10});

                L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png',{id: 'examples.map-9ijuk24y'}).addTo(map);
                group.addTo(map);

                $scope.$watch('reports', function(){
                    if ($scope.reports) {
                        //Рассчитываю количество дней между минимальной и максимальной датой единоразово при обновлении репортов.
                        datesArr = $scope.reports.map(report => (new Date(report.submissionDate)).valueOf());
                        minDate = Math.min.apply(null, datesArr);
                        maxDate = Math.max.apply(null, datesArr);
                        size = getDaysBetweenDates(minDate, maxDate);
                    }
                    drawLayers();
                });
                $scope.$watch('mode', drawLayers, true);

                function drawLayers() {
                    if ($scope.mode.type === "normal") {
                        drawMarkers();
                    } else if ($scope.mode.type === "heatmap") {
                        drawHeatmap();
                    }
                }

                function drawMarkers() {
                    if (timeoutID) {
                        clearTimeout(timeoutID);
                        timeoutID = null;
                    }
                    map.removeLayer(heatLayer);
                    group.clearLayers();
                    if ($scope.reports) {
                        $scope.reports.forEach(function(report) {
                            var loc = report.location;
                            L.marker([loc.latitude, loc.longitude]).addTo(group);
                        });
                        map.fitBounds(group.getBounds().pad(0.1));
                    }
                }

                function drawHeatmap() {
                    if (!$scope.mode.options.isPlaying && timeoutID) {
                        clearTimeout(timeoutID);
                        timeoutID = null;
                        return;
                    }
                    group.clearLayers();
                    map.removeLayer(heatLayer);
                    if ($scope.reports) {
                        var stepsCount = Math.ceil(size / $scope.mode.options.size);
                        var stepPercent = 100 / stepsCount;
                        var currentStep = Math.round($scope.mode.options.position / stepPercent);

                        var minCountDate = minDate + currentStep * $scope.mode.options.size * 86400000;
                        var maxCountDate = minCountDate + $scope.mode.options.size * 86400000;

                        latLngs = $scope.reports.filter(report => {
                            var dateToFilter = (new Date(report.submissionDate)).valueOf();
                            return minCountDate <= dateToFilter && dateToFilter < maxCountDate;
                        }).map(report => [report.location.latitude, report.location.longitude]);

                        heatLayer.setLatLngs(latLngs);
                        map.addLayer(heatLayer);

                        if ($scope.mode.options.isPlaying) {
                            currentStep++;
                            if (currentStep > stepsCount) {
                                $scope.mode.options.isPlaying = false;
                            } else {
                                timeoutID = setTimeout(function() {
                                    $scope.$applyAsync(function() {
                                        $scope.mode.options.position = currentStep * stepPercent;
                                    });
                                }, 1000);
                            }
                        }
                    }
                }

                function getDaysBetweenDates(minDate, maxDate) {
                    return ( (new Date(maxDate)) - (new Date(minDate)) ) / 86400000;
                }

            },
            controller: function($scope, $element, $attrs) {

            },
        };
    }]);
})();