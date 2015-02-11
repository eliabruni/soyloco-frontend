angular.module('splash.tabAccount.ctrl', [])


    .controller('TabAccountCtrl', function($scope, $q, $state, $ionicModal, $ionicLoading,
                                           $ionicPopup, $cordovaFacebook, $cordovaFile,
                                           $cordovaGeolocation, $localstorage, $profile) {

        $scope.showView = true;

        if ($localstorage.get('profilePhoto') == null ||  $localstorage.getObject('basicInfo') == null || $localstorage.getObject('myCity') == null) {


            alert('Profile info problems, need to deal with this case')
           /* $scope.showView = false;

            $ionicLoading.show({
                template: 'loading'
            });

            if ($localstorage.get('profilePhoto') == null) {
                $scope.profilePhotoReady = false;
            }

            if ($localstorage.getObject('myCity') == null) {
                $scope.profileInfoReady = false;
            }

            // Wait for device API libraries to load
            document.addEventListener("deviceready", onDeviceReady, false);

            // device APIs are available
            function onDeviceReady() {

                $scope.$watchGroup(['profilePhotoReady', 'profileInfoReady'], function(newValues, oldValues) {
                    if (newValues[0] && newValues[1]) {
                        $ionicLoading.hide();
                        $scope.showView = true;
                    }
                });

                if(!$scope.profilePhotoReady) {

                    $profile.getProfilePhoto()
                        .then(function(success) {
                            $scope.profilePhoto = success;
                            $localstorage.set('profilePhoto', $scope.profilePhoto);
                            $scope.profilePhotoReady = true;
                        }, function (error) {
                            // error
                        });
                }

                if (!$scope.profileInfoReady) {

                    $profile.getCities()
                        .then(function(success) {
                            $scope.cities = success;
                            $scope.myCity = $scope.cities[0];
                            $localstorage.setObject('myCity', $scope.cities[0]);
                            $localstorage.setObject('cities', $scope.cities);
                            $scope.profileInfoReady = true;
                        }, function (error) {
                            // error
                        })
                }
            }*/
        } else {
            $scope.cities = $localstorage.getObject('cities');
            $scope.myCity = $localstorage.getObject('myCity');
            $scope.basicInfo = $localstorage.getObject('basicInfo');
            $scope.profilePhoto = $localstorage.get('profilePhoto');
        }

        // set localStorage when function is called after a value is changed
        $scope.updateStorage = function(city){

            $localstorage.setObject('cities', $scope.cities);
            $localstorage.setObject('myCity', city);
        };

        $scope.logout = function() {
            $cordovaFacebook.logout().then(function (success) {
                $localstorage.set('profileInfoRetrieved', 'false');
                $state.go('signin');
            }, function (error) {
                // error
            })
        }

    })