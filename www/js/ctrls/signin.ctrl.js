angular.module('splash.signin.ctrl', [])


    .controller('SigninCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, $state, $cordovaFacebook,
                                       $ionicLoading, $profile, $localstorage, $cordovaGoogleAnalytics) {

        // GA
        $scope.$on('$ionicView.beforeEnter', function() {
            $cordovaGoogleAnalytics.trackView('Signin');
        });

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

                    if($localstorage.get('profileInfoRetrieved') == 'true') {

                        // Save fb token into local storage
                        //$localstorage.setObject('fbToken', success);
                        $state.go('tab.play');

                    } else {
                        retrieveProfileInfo();
                    }

                }, function (error) {

                    // error
                    $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                        .then(function(success) {

                            retrieveProfileInfo();

                        }, function (error) {
                            // error
                            $state.go('signin');
                        });
                });
        }

        function retrieveProfileInfo() {

            /**********************************************************
             *              RETRIEVE PROFILE INFO
             *
             * ********************************************************/

                // TODO: refactor this as a $profile function

                // Wait for device API libraries to load
            document.addEventListener("deviceready", onDeviceReady, false);

            // device APIs are available
            function onDeviceReady() {

                $scope.cityInfoReady = false;
                $scope.basicProfileReady = false;
                $scope.profilePhotoReady = false;

                $ionicLoading.show({
                    template: 'Connecting with Facebook...'
                });

                $scope.$watchGroup(['cityInfoReady', 'basicProfileReady', 'profilePhotoReady'], function(newValues, oldValues) {
                    if (newValues[0] && newValues[1] && newValues[2]) {
                        $ionicLoading.hide();
                        $state.go('tab.play');
                    }
                });

                $profile.getCities()
                    .then(function(success) {
                        var cities = success;
                        $localstorage.setObject('myCity', cities[0]);
                        $localstorage.setObject('cities', cities);
                        $scope.cityInfoReady = true;


                        $profile.getBasicInfo()
                            .then(function(success) {
                                var basicInfo = success;
                                $localstorage.setObject('basicInfo', basicInfo);
                                $scope.basicProfileReady = true;


                                $profile.getProfilePhoto()
                                    .then(function(success) {
                                        var profilePhoto = success;
                                        $localstorage.set('profilePhoto', profilePhoto);
                                        $scope.profilePhotoReady = true;



                                        // Save fb token into local storage
                                        // We save it only when all the profile info are ready
                                        $cordovaFacebook.getAccessToken()
                                            .then(function (success) {

                                                $localstorage.set('profileInfoRetrieved', 'true');
                                            })

                                    }, function (error) {
                                        // error
                                    });

                            }, function (error) {
                                // error
                            });


                    }, function (error) {
                        // error
                    })
            }
        }
    })