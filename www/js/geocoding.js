angular.module('soyloco.geocoding', [])

/**********************************************************
 *                  GEO UTILITY
 *
 * ********************************************************/
    .factory('Geo', function($rootScope, $q, $interval, localStorageService) {

        var geoWatchTime = 5000,
            geoWatchId,
            position,
            map,
            mapInitialized = false,
            mapInitStop,
            needToReloadView = false;

        // device APIs are available
        function init() {

            // Wait for device API libraries to load
            document.addEventListener("deviceready", onDeviceReady, false);

            // device APIs are available
            function onDeviceReady() {
                $rootScope.deviceReady = true;
                // Start getting position
                start();
            }

        }

        function start() {
            navigator.geolocation.getCurrentPosition(success, error, {maximumAge: 1000});

            geoWatchId = $interval(function () {
                navigator.geolocation.getCurrentPosition(success, error, {maximumAge: 1000});
            }, geoWatchTime);
        }

        function stop() {
            if (geoWatchId) {
                $interval.cancel(geoWatchId);
            }
        }

        function success(pos) {

            position = { 'lat': pos.coords.latitude, 'long': pos.coords.longitude };

            // Write position on local storage
            // TODO: Should also send it to the server
            localStorageService.add('position', position);


            if(mapInitialized) {
                map.selfMarker.isReady = true;


                // We update position only when a reasonable lat or long change happens
                if ((position.lat.toFixed(4) != map.selfMarker.latitude.toFixed(4))
                    || (position.long.toFixed(4) != map.selfMarker.longitude.toFixed(4)))  {

                    updatePosition(position);
                }
            }
        }

        // onError Callback receives a PositionError object
        function error(error) {

            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');

            if(mapInitialized) {
                map.selfMarker.isReady = false;
            }

        }

        function constructMap(position) {

            var lat = position.lat;
            var long = position.long;

            map = {
                center : {
                    latitude: lat,
                    longitude: long
                },
                selfMarker : {
                    icon: 'img/maps/self_marker.png',
                    latitude:lat,
                    longitude:long,
                    fit:true,
                    isReady:true
                },
                zoom: 14,
                draggable: true,
                options: {
                    streetViewControl: false,
                    panControl: false,
                    mapTypeId: "roadmap",
                    disableDefaultUI: true
                },
                markers : [
                    {
                        icon: 'img/maps/blue_marker.png',
                        "latitude":lat+0.001,
                        "longitude":long+0.003,
                        fit:true
                    },
                    {
                        icon: 'img/maps/blue_marker.png',
                        "latitude":lat+0.002,
                        "longitude":long+0.001,
                        fit:true
                    }
                ]
            };

            return map

        }

        function updatePosition(position) {
            map.selfMarker.latitude = position.lat;
            map.selfMarker.longitude = position.long;
        }

        function getMap() {

            var deferred = $q.defer();

            if (!mapInitialized) {

                if(localStorageService.get('position') != null
                    && navigator.network.connection.type != Connection.NONE) {

                    var actualPosition = localStorageService.get('position');

                    createMap(actualPosition);

                } else {

                    mapInitStop = $interval(function () {

                        if(localStorageService.get('position') != null
                            && navigator.network.connection.type != Connection.NONE) {

                            if (angular.isDefined(mapInitStop)) {
                                $interval.cancel(mapInitStop);
                                mapInitStop = undefined;
                            }
                            var actualPosition = localStorageService.get('position');
                            createMap(actualPosition);
                            needToReloadView = true;
                        }
                    }, 3000);

                }
            } else {
                deferred.resolve(map);
            }

            // Utility to create map
            function createMap(actualPosition) {
                map = constructMap(actualPosition);
                deferred.resolve(map);
                mapInitialized = true;

            }

            return deferred.promise;

        }

        function getSelfMarker() {
            return map.selfMarker;
        }

        function isMapInitialized() {
            return mapInitialized;
        }

        function getViewToReload() {
            return needToReloadView;
        }

        function setViewToReload(toReload) {
            needToReloadView = toReload;
        }

        return {
            init: init,
            getMap: getMap,
            getSelfMarker: getSelfMarker,
            isMapInitialized: isMapInitialized,
            getViewToReload:getViewToReload,
            setViewToReload:setViewToReload
        }

    })