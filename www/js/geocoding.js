angular.module('soyloco.geocoding', [])

/**********************************************************
 *                  GEO UTILITY
 *
 * ********************************************************/
    .factory('Geo', function(localStorageService, $q, $interval, $timeout) {

        var geoWatchTime = 5000,
            geoWatchId,
            position,
            map,
            mapInitialized = false,
            mapInitStop;

        // device APIs are available
        function init() {

            // Wait for device API libraries to load
            document.addEventListener("deviceready", onDeviceReady, false);

            // device APIs are available
            function onDeviceReady() {

                // Start getting position
                start();
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
                    isReady:false
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

        function getMapInitialized() {
            return mapInitialized;
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

            //alert('inside success')


            if(mapInitialized) {
                //alert('inside mapInitialized')

                map.selfMarker.isReady = true;

                // We update position only when a reasonable lat or long change happens
                if ((position.lat.toFixed(4) == map.selfMarker.latitude.toFixed(4))
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

        function updatePosition(position) {
            map.selfMarker.latitude = position.lat+0.0001;
            map.selfMarker.longitude = position.long;
        }

        function getMap() {

            //alert('0')

            var deferred = $q.defer();

            //alert('1')


            if (!mapInitialized) {

               // alert('2')

                if(localStorageService.get('position') != null
                    && navigator.network.connection.type != Connection.NONE) {
                 //   alert('3a')

                    var actualPosition = localStorageService.get('position');
                   // alert('3b')

                    createMap(actualPosition);
                    //alert('3c')

                } else {
                    mapInitStop = $interval(function () {
                      //  alert('4a')

                        if(localStorageService.get('position') != null
                            && navigator.network.connection.type != Connection.NONE) {
                        //    alert('4b')

                            if (angular.isDefined(mapInitStop)) {
                          //      alert('4e')

                                $interval.cancel(mapInitStop);
                            //    alert('4f')

                                mapInitStop = undefined;
                              //  alert('4g')

                            }

                            $timeout(function() {


                                var actualPosition = localStorageService.get('position');
                             //   alert('4c')


                             //   alert(map.draggable);
                                createMap(actualPosition);
                             //   alert('4d')


                            }, 5000);

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

        return {
            init: init,
            getMapInitialized: getMapInitialized,
            getMap: getMap

        }
    })