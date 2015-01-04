angular.module('splash.tabAccount.ctrl', [])


    .controller('TabAccountCtrl', function($scope, $q, $state, $ionicModal, $ionicLoading,
                                           $ionicPopup, $cordovaFacebook, $cordovaFile,
                                           $cordovaGeolocation, $localstorage, Geo) {

        $scope.showView = true;

        if ($localstorage.getObject('myCity') == null || $localstorage.getObject('profilePhoto') == null) {
            $scope.showView = false;

            $ionicLoading.show({
                template: 'loading'
            });

            // Wait for device API libraries to load
            document.addEventListener("deviceready", onDeviceReady, false);

            // device APIs are available
            function onDeviceReady() {

                $scope.profilePhotoReady = false;
                $scope.profileInfoReady = false;

                $scope.$watchGroup(['profilePhotoReady', 'profileInfoReady'], function(newValues, oldValues) {
                    if (newValues[0] && newValues[1]) {
                        $ionicLoading.hide();
                        $scope.showView = true;
                    }
                });

                getProfilePhoto()
                    .then(function(success) {
                        $scope.profilePhotoReady = true;
                    }, function (error) {
                        // error
                    });

                getCities()
                    .then(function(success) {
                        $scope.profileInfoReady = true;
                    }, function (error) {
                        // error
                    });
            }
        } else {
            $scope.cities = $localstorage.getObject('cities');
            $scope.myCity = $localstorage.getObject('myCity');
            $scope.profilePhoto = $localstorage.get('profilePhoto');

        }

        // set localStorage when function is called after a value is changed
        $scope.updateStorage = function(city){

            $localstorage.setObject('cities', $scope.cities);
            $localstorage.setObject('myCity', city);
            //$scope.myCity = $localstorage.getObject('myCity');
        };

        /***********************************************
         *               HELPER FUNCTIONS              *
         ***********************************************/

        function getProfilePhoto() {

            var d = $q.defer();

            $cordovaFacebook.api("me/picture?redirect=0&height=400&type=normal&width=400", ["public_profile"])
                .then(function (success) {

                    var photo = success.data;
                    var fileTransferDir = cordova.file.externalDataDirectory;

                    var hostPath = photo.url;
                    var clientPath = fileTransferDir + 'test.jpg';
                    var fileTransferOptions = {};

                    $cordovaFile.downloadFile(hostPath, clientPath, true, fileTransferOptions).then (function(result) {
                        // Success!
                        $scope.profilePhoto = clientPath;
                        $localstorage.set('profilePhoto', $scope.profilePhoto);
                        d.resolve();

                    }, function(err) {
                        // Error
                        d.reject();
                    }, function (progress) {
                        // constant progress updates
                    });

                }, function (error) {
                    d.reject();
                });

            return d.promise;
        }

        function getCities() {

            var d = $q.defer();

            $cordovaGeolocation
                .getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
                .then(function (position) {

                    Geo.facebookGeoLocation(position.coords.latitude, position.coords.longitude, 50000, function (cities) {
                        $scope.cities = cities;
                        $scope.myCity = cities[0];
                        $localstorage.setObject('myCity', cities[0]);
                        $localstorage.setObject('cities', cities);
                        d.resolve();
                    });

                }, function (err) {
                    d.reject();

                });
            return d.promise;
        }

    })