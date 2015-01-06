angular.module('splash.profile', [])

    .factory('$profile', ['$window', '$q', '$cordovaFacebook', '$cordovaFile', '$localstorage', '$cordovaGeolocation', '$geo',
        function($window, $q, $cordovaFacebook, $cordovaFile, $localstorage, $cordovaGeolocation, $geo) {

            function getProfilePhoto() {

                alert('profile 0')

                var q = $q.defer();

                alert('profile 1')

                $cordovaFacebook.api("me/picture?redirect=0&height=400&type=normal&width=400", ["public_profile"])
                    .then(function (success) {

                        alert('profile 2')


                        var photo = success.data;
                        var fileTransferDir = cordova.file.externalDataDirectory;

                        var hostPath = photo.url;
                        var clientPath = fileTransferDir + 'test.jpg';
                        var fileTransferOptions = {};

                        $cordovaFile.downloadFile(hostPath, clientPath, true, fileTransferOptions).then(function (result) {
                            // Success!
                            alert('profile 3')

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

                alert('0b')

                var d = $q.defer();

                alert('1b')

                $cordovaGeolocation
                    .getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
                    .then(function (position) {

                        alert('location obtained')

                        $geo.facebookGeoLocation(position.coords.latitude, position.coords.longitude, 50000, function (cities) {
                            d.resolve(cities);
                        });

                    }, function (err) {
                        d.reject();

                    });
                return d.promise;
            }

            function retrieveProfileInfo() {

                alert('0x')

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
                            alert(success)
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
                getProfilePhoto :getProfilePhoto,
                getCities : getCities
            }

        }]);