angular.module('starter.controllers', [])


    .controller('SignInCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, $state, $cordovaFacebook) {

      $ionicSideMenuDelegate.canDragContent(false);

      // Form data for the login modal
      $scope.loginData = {};

      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      })

      // Perform the login action when the user submits the login form
      $scope.doLogin = function() {

        $cordovaFacebook.getAccessToken()
            .then(function (success) {

              // success
              $state.go('tab.dash')
            }, function (error) {

              // error
              $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                  .then(function(success) {

                    //success
                    $state.go('tab.dash')

                  }, function (error) {
                    // error
                    $state.go('signin')
                  });
            });
      }
    })


 /*   .controller('SignInCtrl', function($scope, $state) {

      $scope.signIn = function(user) {
        console.log('Sign-In', user);
        $state.go('tab.dash');
      };

    })*/

    .controller('DashCtrl', function($scope) {})

    .controller('ChatsCtrl', function($scope, Chats) {
      $scope.chats = Chats.all();
      $scope.remove = function(chat) {
        Chats.remove(chat);
      }
    })

    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
      $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('EventsCtrl', function($scope, Events) {
      $scope.events = Events.all();
    })

    .controller('EventDetailCtrl', function($scope, $stateParams, Events) {
      $scope.event = Events.get($stateParams.eventId);
    })

    .controller('AccountCtrl', function($scope) {
      $scope.settings = {
        enableFriends: true
      };
    });
