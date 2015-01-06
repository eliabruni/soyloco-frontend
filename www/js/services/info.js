angular.module('splash.info', [])

    .factory('$info', ['$scope', '$q', '$cordovaFacebook', '$cordovaFile', '$localstorage', '$cordovaGeolocation', '$geo',
        function($scope, $q, $cordovaFacebook, $cordovaFile, $localstorage, $cordovaGeolocation, $geo) {
            return {

                getProfilePhoto: function () {

                    alert('0a')

                    var d = $q.defer();

                    alert('1a')

                    $cordovaFacebook.api("me/picture?redirect=0&height=400&type=normal&width=400", ["public_profile"])
                        .then(function (success) {

                            var photo = success.data;
                            var fileTransferDir = cordova.file.externalDataDirectory;

                            var hostPath = photo.url;
                            var clientPath = fileTransferDir + 'test.jpg';
                            var fileTransferOptions = {};

                            $cordovaFile.downloadFile(hostPath, clientPath, true, fileTransferOptions).then(function (result) {
                                // Success!
                                d.resolve(clientPath);

                            }, function (err) {
                                // Error
                                d.reject();
                            }, function (progress) {
                                // constant progress updates
                            });

                        }, function (error) {
                            d.reject();
                        });

                    return d.promise;
                }/*,

                getCities: function () {

                    alert('0b')

                    var d = $q.defer();

                    alert('1b')

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
                }*/


               /* retrieveProfileInfo: function () {

                    alert('0x')

                    var d = $q.defer();

                    $scope.profilePhotoReady = true;

                    $scope.profilePhotoReady = true;

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
                                $localstorage.set('profilePhoto', profilePhoto);
                                $scope.profilePhotoReady = true;
                            }, function (error) {
                                // error
                            });


                        $info.getCities()
                            .then(function (success) {
                                var cities = success;
                                $localstorage.setObject('myCity', cities[0]);
                                $localstorage.setObject('cities', cities);
                                $scope.profileInfoReady = true;
                            }, function (error) {
                                // error
                            })

                    }

                    return d.promise;
                }
*/
            }

        }]);