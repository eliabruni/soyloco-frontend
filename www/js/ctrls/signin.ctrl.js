angular.module('splash.signin.ctrl', [])


    .controller('SigninCtrl', function($rootScope, $scope, $timeout, $ionicSideMenuDelegate, $ionicHistory, $state, $ionicModal, $cordovaFacebook,
                                       $ionicLoading, $profile, $localstorage, $cordovaGoogleAnalytics, $cordovaToast) {

        // GA
        $scope.$on('$ionicView.beforeEnter', function() {
            $cordovaGoogleAnalytics.trackView('Signin');
        });

        //// Clear all history
        //$ionicHistory.clearHistory();
        //// Clear all cache (except current view)
        //$ionicHistory.clearCache();

        $ionicSideMenuDelegate.canDragContent(false)


        // We get screen size only at fb login time
        if (!$rootScope.appInitialized) {

            var newScreenHeight = document.getElementsByTagName('ion-view')[0].clientHeight;
            var newScreenWidth = document.getElementsByTagName('ion-view')[0].clientWidth;

            $localstorage.setObject('screenHeight', newScreenHeight);
            $localstorage.setObject('screenWidth', newScreenWidth);
        }

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/signin.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {

            $cordovaFacebook.getAccessToken()
                .then(function (success) {

                    if($localstorage.get('profileInfoRetrieved') == 'true') {

                        // Save fb token into local storage
                        //$localstorage.setObject('fbToken', success);
                        $state.go('app.play');

                    } else {
                        retrieveProfileInfo();
                    }

                }, function (error) {

                    // error
                    $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                        .then(function(success) {

                            $scope.doLogin();
                            //retrieveProfileInfo();

                        }, function (error) {
                            // error
                            $state.go('signin');
                        });
                });
        };

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
                    noBackdrop: true,
                    template: '<p class="item-icon-left">Loading Splash...<ion-spinner icon="lines"/></p>'
                });

                $profile.getCities(5)
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
                                                $ionicLoading.hide();
                                                $state.go('app.play');

                                            })

                                    }, function (error) {
                                        getErrorMessage();
                                    });

                            }, function (error) {
                                getErrorMessage();
                            });

                    }, function (error) {
                        getErrorMessage();
                    })
            }
        }


        var getErrorMessage = function( ) {
            $ionicLoading.hide();
            $cordovaToast.showLongBottom('Check that Internet and GPS are on.').then(function(success) {
                // success
            }, function (error) {
                // error
            });
        };


        /***************
         * CSS stuff
         ***************/

        // Screen width and height are set at signin only once
        var screenWidth = $localstorage.getObject('screenWidth');
        var screenHeight = $localstorage.getObject('screenHeight');

        /***************
         *
         */

        //CONTAINER
        $scope.fbButtonHeight = (screenHeight * 0.083) + "px";
        $scope.fbButtonWidth = (screenWidth * 0.9) + "px";
        $scope.fbButtonLineHeight = (screenHeight * 0.083) + "px";
        $scope.fbButtonFontSize = (screenHeight * 0.03) + "px";
        $scope.fbButtonBorderRadius = 8 + "px";

    });