angular.module('soyloco.map', [])

/**********************************************************
 *                  GEO UTILITY
 *
 * ********************************************************/
    .factory('GMap', function($rootScope, $q, $interval, localStorageService, Geo) {

        var position,
            map,
            mapInitialized = false,
            mapInitStop,
            needToReloadView = false,
            positionWatchTime = 5000;

        function getMap() {

            var deferred = $q.defer();

            if (!mapInitialized) {

                if((Geo.isPositionAvailable())
                    && navigator.network.connection.type != Connection.NONE) {

                    var actualPosition = localStorageService.get('position');
                    createMap(actualPosition);

                } else {

                    mapInitStop = $interval(function () {

                        if((Geo.isPositionAvailable())
                            && navigator.network.connection.type != Connection.NONE) {

                            if (angular.isDefined(mapInitStop)) {
                                $interval.cancel(mapInitStop);
                                mapInitStop = undefined;
                            }
                            var actualPosition = localStorageService.get('position');
                            createMap(actualPosition);
                            //needToReloadView = true;
                        }
                    }, 3000);

                }
            } else {
                deferred.resolve(map);
            }

            // Utility to create map
            function createMap(actualPosition) {
                map = constructMap(actualPosition);
                watchPosition();
                deferred.resolve(map);
                mapInitialized = true;
            }

            return deferred.promise;

        }

        /*
         HELPER FUNCTIONS
         */

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
                markersWhoYouLike : [
                    {
                        id: 1,
                        icon: 'img/maps/blue_marker.png',
                        latitude:lat+0.001,
                        longitude:long+0.003,
                        showWindow: false,
                        place: {
                            id: 1,
                            name: 'Walthers',
                            address: 'Piazza Walther',
                            image: 'img/walthers.jpg'
                        }
                    },
                    {
                        id: 2,
                        icon: 'img/maps/blue_marker.png',
                        latitude:lat+0.001,
                        longitude:long+0.001,
                        showWindow: false,
                        place: {
                            id: 2,
                            name: 'Nadamas',
                            address: 'Piazza Erbe',
                            image: 'img/nadamas.jpg'
                        }


                    }
                ],
                markersWhoLikesYou : [
                    {
                        id: 1,
                        icon: 'img/maps/blue_marker.png',
                        latitude:lat+0.002,
                        longitude:long+0.002,
                        showWindow: false,
                        place: {
                            id: 1,
                            name: 'Walthers',
                            address: 'Piazza Walther',
                            image: 'img/walthers.jpg'
                        }

                    },
                    {
                        id: 2,
                        icon: 'img/maps/blue_marker.png',
                        latitude:lat+0.002,
                        longitude:long+0.001,
                        showWindow: false,
                        place: {
                            id: 2,
                            name: 'Nadamas',
                            address: 'Piazza Erbe',
                            image: 'img/nadamas.jpg'
                        }

                    }
                ],
                markersMatches : [
                    {
                        id: 1,
                        icon: 'img/maps/blue_marker.png',
                        latitude:lat+0.003,
                        longitude:long+0.001,
                        showWindow: false,
                        place: {
                            id: 1,
                            name: 'Walthers',
                            address: 'Piazza Walther',
                            image: 'img/walthers.jpg'
                        }

                    },
                    {
                        id: 2,
                        icon: 'img/maps/blue_marker.png',
                        latitude:lat+0.001,
                        longitude:long+0.002,
                        showWindow: false,
                        place: {
                            id: 2,
                            name: 'Nadamas',
                            address: 'Piazza Erbe',
                            image: 'img/nadamas.jpg'
                        }

                    }
                ]
            };

            return map

        }

        function watchPosition() {

            var positionWatchId = $interval(function () {

                var position = localStorageService.get('position');

                // We update position only when a reasonable lat or long change happens
                if ((position.lat.toFixed(4) != map.selfMarker.latitude.toFixed(4))
                    || (position.long.toFixed(4) != map.selfMarker.longitude.toFixed(4)))  {

                    updatePosition(position);

                }

            }, positionWatchTime);

        }

        function updatePosition(position) {
            map.selfMarker.latitude = position.lat;
            map.selfMarker.longitude = position.long;
        }


        /*
         GETTERS AND SETTERS
         */

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
            getMap: getMap,
            getSelfMarker: getSelfMarker,
            isMapInitialized: isMapInitialized,
            getViewToReload:getViewToReload,
            setViewToReload:setViewToReload
        }

    })