angular.module('soyloco.geocoding', [])

/**********************************************************
 *                  GEO UTILITY
 *
 * ********************************************************/
    .factory('Geo', function($rootScope, localStorageService, $q, $interval) {

        var geoActivateTime = 5000,
            stop,
            position,
            map,
            mapInitialized = false;

        // device APIs are available
        function init() {

            /*if(localStorageService.get('position') != null) {
             var position = localStorageService.get('position');
             alert('calling on local storage get map apply');

             $rootScope.map = createMap(position);
             $rootScope.map.isReady = true;
             mapInitialized = true;
             }*/


            // Wait for device API libraries to load
            document.addEventListener("deviceready", onDeviceReady, false);

            // Function to kill the $interval call to geolocation
            function stopGeoActivate() {
                if (angular.isDefined(stop)) {
                    $interval.cancel(stop);
                    stop = undefined;
                }
            };

            // device APIs are available
            function onDeviceReady() {

                // Brutal way to force watching in any case.
                // The problem is when GPS is first off and is then switched on,
                // in tat case position isn't watched with the standard navigator.geolocation.watchPosition.
                //TODO: Need to find a better, more efficient way to do this.
                // Works only with device online
                stop = $interval(function () {
                    navigator.geolocation.getCurrentPosition(onSuccess, onError, {maximumAge: 0});
                }, geoActivateTime)

            }

            // onSuccess Geolocation
            function onSuccess(pos) {
                position = { 'lat': pos.coords.latitude, 'long': pos.coords.longitude };

                // Write position on local storage
                // TODO: Should also send it to the server
                localStorageService.add('position', position);
/*
                // TODO: Do we really need connection? And only here are also above?
                if (!mapInitialized && navigator.network.connection.type != Connection.NONE) {

                    alert('calling on success get map apply');

                    $rootScope.map = createMap(position);
                    $rootScope.map.isReady = true;
                    $rootScope.loading.hide();

                    mapInitialized = true;
                }*/
            }

            // onError Callback receives a PositionError object
            function onError(error) {
                alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            }
        }

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

            return map

        }

        function getMapInitialized() {
            return mapInitialized;
        }


        //TESTING

        function getMap() {

            var deferred = $q.defer();

            alert('calling getmap')

            if (!mapInitialized) {

                alert('calling not init map case')


                stop = $interval(function () {

/*                if(localStorageService.get('position') != null) {
                    position = localStorageService.get('position');
                }*/

                if(!angular.isUndefined(position) || !position === null) {

                    map = createMap(position);
                    deferred.resolve(map);
                    mapInitialized = true;
                    if (angular.isDefined(stop)) {
                        $interval.cancel(stop);
                        stop = undefined;
                    }
                }


            }, 3000);

            } else {
                alert('calling init map case')
                alert(map.center.latitude);
                deferred.resolve(map);
            }

            return deferred.promise;

        }

        //TESTING

        return {
            init: init,
            getMapInitialized: getMapInitialized,
            getMap: getMap

        }
    })