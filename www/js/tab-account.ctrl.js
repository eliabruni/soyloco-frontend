angular.module('splash.tabAccount.ctrl', [])


    .controller('TabAccountCtrl', function($scope, $state, $ionicModal, $ionicLoading, $ionicPopup, $cordovaFacebook, $cordovaFile, $cordovaGeolocation, $localstorage, Geo) {

        $scope.showView = true;

        if ($localstorage.getObject('myCity') == null) {
            $scope.showView = false;

            $ionicLoading.show({
                template: 'loading'
            });


            // Wait for device API libraries to load
            document.addEventListener("deviceready", onDeviceReady, false);

            // device APIs are available
            function onDeviceReady() {

                $cordovaGeolocation
                    .getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
                    .then(function (position) {


                        Geo.facebookGeoLocation(position.coords.latitude, position.coords.longitude, 50000, function (cities) {
                            $scope.cities = cities;
                            $scope.myCity = cities[0];
                            $ionicLoading.hide();
                            $scope.showView = true;
                            $localstorage.setObject('myCity', cities[0]);
                            $localstorage.setObject('cities', cities);
                        });

                    }, function (err) {
                        console.log("unable to find location");
                        $scope.errorMsg = "Error : " + err.message;
                        alert($scope.errorMsg)
                    });
            }
        } else {
            $scope.cities = $localstorage.getObject('cities');
            $scope.myCity = $localstorage.getObject('myCity');
        }


        // set localStorage when function is called after a value is changed
        $scope.updateStorage = function(city){

            $localstorage.setObject('cities', $scope.cities);
            $localstorage.setObject('myCity', city);
            //$scope.myCity = $localstorage.getObject('myCity');
        };

    })