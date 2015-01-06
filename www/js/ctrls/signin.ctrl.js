angular.module('splash.signin.ctrl', [])


    .controller('SigninCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, $state, $cordovaFacebook,
                                       $ionicLoading, $profile, $localstorage) {

        $ionicSideMenuDelegate.canDragContent(false);

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/signin.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        })

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {

            $cordovaFacebook.getAccessToken()
                .then(function (success) {

                    // success
                    $state.go('tab.play')

                }, function (error) {

                    // error
                    $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                        .then(function(success) {


                            /**********************************************************
                             *              RETRIEVE PROFILE INFO
                             *
                             * ********************************************************/

                            // Wait for device API libraries to load
                            document.addEventListener("deviceready", onDeviceReady, false);

                            // device APIs are available
                            function onDeviceReady() {

                                $scope.profilePhotoReady = false;
                                $scope.profileInfoReady = false;

                                $ionicLoading.show({
                                    template: 'loading'
                                });

                                $scope.$watchGroup(['profilePhotoReady', 'profileInfoReady'], function(newValues, oldValues) {
                                    if (newValues[0] && newValues[1]) {
                                        $ionicLoading.hide();
                                        $scope.showView = true;
                                        $state.go('tab.play');
                                    }
                                });

                                $profile.getCities()
                                    .then(function(success) {
                                        var cities = success;
                                        $localstorage.setObject('myCity', cities[0]);
                                        $localstorage.setObject('cities', cities);
                                        $scope.profileInfoReady = true;

                                        $profile.getProfilePhoto()
                                            .then(function(success) {
                                                var profilePhoto = success;
                                                $localstorage.set('profilePhoto', profilePhoto);
                                                $scope.profilePhotoReady = true;
                                            }, function (error) {
                                                // error
                                            });

                                    }, function (error) {
                                        // error
                                    })
                            }

                        }, function (error) {
                            // error
                            //$state.go('tab.play')
                            $state.go('signin');
                        });
                });
        }
    })