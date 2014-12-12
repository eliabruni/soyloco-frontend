angular.module('soyloco.controllers', [])

.controller('LoginCtrl', function($scope, $ionicModal, $state) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });


  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
      facebookConnectPlugin.getAccessToken(function(result){
          $state.go('app.swipe')
      },function(){
          facebookConnectPlugin.login(["email"], function(response) {

              if (response.authResponse) {
                  facebookConnectPlugin.getAccessToken(function(result){
                      $state.go('app.swipe')
                  })
              } else {
                  facebookConnectPlugin.showDialog(["email"],function(response){
                  })
              }
          },function(response){
              $state.go('app.login')

          });
      })
  };
})

.controller('MeCtrl', function($scope,$ionicLoading) {
        $ionicLoading.show({
            template: 'Loading...'
        });
        $scope.fbProfile = {}
        facebookConnectPlugin.api('/me', undefined, function (result) {
            $scope.$apply(function(){
                $ionicLoading.hide();
                $scope.fbProfile = result;
            })
        }, function (response) {
            alert('Error->' + JSON.stringify(response))

        })

})

    .controller('CardsCtrl', function($scope, TDCardDelegate, $ionicSideMenuDelegate) {
        console.log('CARDS CTRL');
        var cardTypes = [
            { image: 'templates/max.jpg' },
            { image: 'templates/ben.png' },
            { image: 'templates/perry.jpg' },
        ];

        $ionicSideMenuDelegate.canDragContent(false);
        $scope.cards = Array.prototype.slice.call(cardTypes, 0);

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        };

        $scope.addCard = function() {
            var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));
        }

        $scope.cardSwipedLeft = function(index) {
            console.log('LEFT SWIPE');
            $scope.addCard();
        };
        $scope.cardSwipedRight = function(index) {
            console.log('RIGHT SWIPE');
            $scope.addCard();
        };
    })




    .controller('CardCtrl', function($scope, TDCardDelegate) {
        $scope.cardSwipedLeft = function(index) {
            console.log('LEFT SWIPE');
            $scope.addCard();
        };
        $scope.cardSwipedRight = function(index) {
            console.log('RIGHT SWIPE');
            $scope.addCard();
        };
    })


    .controller('EventsCtrl', function($scope, $ionicSideMenuDelegate) {
        // don't be scared by the image value, its just datauri

        $ionicSideMenuDelegate.canDragContent(true);


        $scope.items = [
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'}
        ];
    });


