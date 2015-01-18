angular.module('splash.profile', [])

    .factory('$profile', ['$window', '$q', '$cordovaFacebook', '$cordovaFile', '$localstorage', '$cordovaGeolocation', '$geo',
        function($window, $q, $cordovaFacebook, $cordovaFile, $localstorage, $cordovaGeolocation, $geo) {

            function getBasicInfo() {

                var q = $q.defer();

                $cordovaFacebook.api("me", ["public_profile"])
                    .then(function (success) {

                        var user = success;
                        q.resolve(user);

                    }, function (err) {
                        // Error
                        q.reject();
                    });

                return q.promise;
            }

            function getProfilePhoto() {

                var q = $q.defer();

                $cordovaFacebook.api("me/picture?redirect=0&height=400&type=normal&width=400", ["public_profile"])
                    .then(function (success) {

                        var photo = success.data;
                        var fileTransferDir = cordova.file.externalDataDirectory;

                        var hostPath = photo.url;
                        var clientPath = fileTransferDir + 'profilePhoto.jpg';
                        var fileTransferOptions = {};

                        $cordovaFile.downloadFile(hostPath, clientPath, true, fileTransferOptions).then(function (result) {
                            // Success!
                            q.resolve(clientPath);

                        }, function (err) {
                            // Error
                            q.reject();
                        }, function (progress) {
                            // constant progress updates
                        });

                    }, function (error) {
                        q.reject();
                    });

                return q.promise;
            }

            function getCities() {

                var d = $q.defer();

                $cordovaGeolocation
                    .getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
                    .then(function (position) {

                        $geo.facebookGeoLocation(position.coords.latitude, position.coords.longitude, 50000, function (cities) {
                            d.resolve(cities);
                        });

                    }, function (err) {
                        d.reject();

                    });
                return d.promise;
            }

            function retrieveProfileInfo() {

                var d = $q.defer();

                // Wait for device API libraries to load
                document.addEventListener("deviceready", onDeviceReady, false);

                // device APIs are available
                function onDeviceReady() {

                    $scope.$watchGroup(['profilePhotoReady', 'profileInfoReady'], function (newValues, oldValues) {
                        if (newValues[0] && newValues[1]) {
                            d.resolve();
                        }
                    });

                    $info.getProfilePhoto()
                        .then(function (success) {
                            var profilePhoto = success;
                        }, function (error) {
                            // error
                        });


                    $info.getCities()
                        .then(function (success) {
                            var cities = success;
                        }, function (error) {
                            // error
                        })

                }

                return d.promise;
            }

            return {
                getBasicInfo : getBasicInfo,
                getProfilePhoto :getProfilePhoto,
                getCities : getCities
            }

        }]);