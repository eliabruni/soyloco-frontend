angular.module('splash.controllers', [])


    .controller('SignInCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, $state, $cordovaFacebook) {

        $ionicSideMenuDelegate.canDragContent(false);

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/sign-in.html', {
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


    .controller('PlayCtrl', function($scope, $ionicSwipeCardDelegate) {
        var cardTypes = [{
            title: 'Swipe down to clear the card',
            image: 'img/pic.png'
        }, {
            title: 'Where is this?',
            image: 'img/pic.png'
        }, {
            title: 'What kind of grass is this?',
            image: 'img/pic2.png'
        }, {
            title: 'What beach is this?',
            image: 'img/pic3.png'
        }, {
            title: 'What kind of clouds are these?',
            image: 'img/pic4.png'
        }];

        $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

        $scope.cardSwiped = function(index) {
            $scope.addCard();
        };

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        };

        $scope.addCard = function() {
            var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));
        };


    })

    .controller('CardCtrl', function($scope, $ionicSwipeCardDelegate) {
        $scope.goAway = function() {
            var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
            card.swipe();
        };
    })

    .controller('AccountCtrl', function($scope, $state, $ionicModal, $ionicLoading, $ionicPopup, $cordovaFacebook, $cordovaFile, $cordovaGeolocation, $localstorage, Geo) {

        $scope.showView = true;

        if ($localstorage.get('myPlace') == null) {
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
                            $ionicLoading.hide();
                            $scope.showView = true;
                            $localstorage.set('myPlace', cities[0]);
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
        }

    })


    .controller('SelectEvetTypesCtrl', function($scope) {
        $scope.devList = [
            { text: "Clubs", checked: true },
            { text: "Parties", checked: false },
            { text: "Bars", checked: false }
        ];

    })


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