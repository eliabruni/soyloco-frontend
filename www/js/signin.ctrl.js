angular.module('splash.signin.ctrl', [])


    .controller('SigninCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, $state, $cordovaFacebook) {

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

                            //success
                            $state.go('tab.play')

                        }, function (error) {
                            // error
                            $state.go('signin')
                        });
                });
        }
    })