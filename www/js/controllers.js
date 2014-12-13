angular.module('soyloco.controllers', [])

    .controller('LoginCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, $state, $cordovaFacebook) {

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


                    $state.go('app.swipe')
                }, function (error) {
                    // error
                    $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                        .then(function(success) {
                            //success

                            $cordovaFacebook.api("me/picture?redirect=false&type=large", ["public_profile"])
                                .then(function (success) {
                                    alert('success')
                                    $scope.foto = success.data;

                                    

                                    alert(success.data.url)
                                    // console.log(success.data);
                                }, function (error) {
                                    alert('error')

                                    console.log(error);
                                });

                            $state.go('app.swipe')

                        }, function (error) {
                            // error
                            $state.go('app.login')
                        });
                });
        }
    })

    .controller('MenuCtrll', function($scope,$ionicLoading, $cordovaFacebook) {

        $scope.getMe = function () {
            $scope.me = ["refreshing..."];
            $cordovaFacebook.api("me", null).then(function (success) {
                $scope.me = success;
            }, function (error) {
                $scope.error = error;
            })
        };

    })

    .controller('MenuCtrl', ['$scope', '$cordovaFacebook', function ($scope, $cordovaFacebook) {
        $cordovaFacebook.api("me/picture?width=400&height=400&redirect=false", ["public_profile"])
            .then(function (success) {
                $scope.foto = success.data;
                // console.log(success.data);
            }, function (error) {
                console.log(error);
            });

        $cordovaFacebook.api("me", ["public_profile"])
            .then(function(success) {
                $scope.me = success;
                // console.log(success);
            }, function (error) {
                console.log(error);
            });
    }])

    .controller('CardsCtrl', function($scope, TDCardDelegate, $ionicSideMenuDelegate, Users) {

        $ionicSideMenuDelegate.canDragContent(false);

        console.log('CARDS CTRL');

        var cardTypes = Users.all();

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

    .controller('EventsCtrl', function($scope) {

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
    })

    .controller('SettingsCtrl', function($scope, $state, $cordovaFacebook) {

        $scope.doLogout = function() {

            $cordovaFacebook.logout()
                .then(function(success) {
                    // success
                    $state.go('app.login')
                }, function (error) {
                    // error
                });
        }

    });