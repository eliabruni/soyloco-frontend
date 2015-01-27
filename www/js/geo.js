angular.module('soyloco.geo', [])

/**********************************************************
 *                  GEO UTILITY
 *
 * ********************************************************/
    .factory('Geo', function($interval, localStorageService) {

        var geoWatchTime = 3000,
            geoWatchId,
            position,
            positionMaxAge = 12000,
            positionAvailable = false
        //isTracking = false,


        // Before calling start(), check that device APIs are available with
        // document.addEventListener("deviceready", onDeviceReady, false);
        function start() {

            navigator.geolocation.getCurrentPosition(success, error, {maximumAge: 1000});

            geoWatchId = $interval(function () {

                // TODO: need to check if already tracking, otherwise too many promises. But then we got some probs
                //if(!isTracking) {
                //isTracking = true;

                navigator.geolocation.getCurrentPosition(success, error, {maximumAge: 1000});

                //}

                // Check if there's an updated position
                // TODO: Te only way for now (with Cordova) to check if GPS is working
                if(localStorageService.get('position') != null) {
                    var tempPosition = localStorageService.get('position');
                    var date = new Date();
                    var actualTimestamp = date.getTime();
                    if ((actualTimestamp - tempPosition.timestamp) < positionMaxAge) {
                        position = tempPosition;
                        positionAvailable = true;
                    } else {
                        positionAvailable = false;
                    }
                } else {
                    positionAvailable = false;
                }

            }, geoWatchTime);
        }

        function stop() {
            if (geoWatchId) {
                $interval.cancel(geoWatchId);
            }
        }

        function success(pos) {

            position = { 'lat': pos.coords.latitude, 'long': pos.coords.longitude, 'timestamp': pos.timestamp };

            // Write position on local storage
            // TODO: Should also send it to the server
            localStorageService.add('position', position);

            positionAvailable = true;

        }

        // onError Callback receives a PositionError object
        function error(error) {

            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');

        }

        function isPositionAvailable() {
            return positionAvailable;
        }

        return {
            start: start,
            isPositionAvailable:isPositionAvailable
        }

    })