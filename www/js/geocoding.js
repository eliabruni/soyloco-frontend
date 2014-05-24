angular.module('soyloco.geocoding', [])

/**********************************************************
 *                  GEO UTILITY
 *
 * ********************************************************/
    .factory('Geo', function(localStorageService, $q) {

        var watchID,
            position,
            map;

        // device APIs are available
        function init() {

            // Wait for device API libraries to load
            document.addEventListener("deviceready", onDeviceReady, false);

            // device APIs are available
            function onDeviceReady() {
                // Throw an error if no update is received every 30 seconds
                var options = { timeout: 30000};
                watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
            }

            // onSuccess Geolocation
            function onSuccess(pos) {
                position =  { 'lat' : pos.coords.latitude, 'long' : pos.coords.longitude };

                // Write position on local storage
                // TODO: Should also send it to the server
                localStorageService.add('position', position);
            }

            // onError Callback receives a PositionError object
            function onError(error) {
                /* alert('code: ' + error.code + '\n' +
                 'message: ' + error.message + '\n');*/
            }
        }

        var getPosition = function(refresh) {

            if(localStorageService.get('position') != null) {
                position = localStorageService.get('position');
            }

            var deferred = $q.defer();

            if( position === null || refresh ) {

                navigator.geolocation.getCurrentPosition(function(pos) {
                    position =  { 'lat' : pos.coords.latitude, 'long' : pos.coords.longitude }
                    deferred.resolve(position);

                }, function(error) {
                    position = null
                    deferred.reject('Failed to Get Position')
                });

            }  else {
                deferred.resolve(position);
            }

            return deferred.promise;

        };


        function createMap(position) {

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
                    fit:true
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

            return map;

        }

        function getMap() {

            var deferred = $q.defer();

            getPosition().then(
                function(position) {
                    var map = createMap(position);
                    deferred.resolve(map);

                },
                function(error) {
                    alert(error);
                    deferred.reject('Failed to Get Map')
                }
            );

            return deferred.promise;
        }

        return {
            init: init,
            getMap: getMap
        }
    })