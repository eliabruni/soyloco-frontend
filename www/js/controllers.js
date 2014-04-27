angular.module('soyloco.controllers', ['ionic.contrib.ui.cards'])

    .controller('AppCtrl', function ($scope, $state, OpenFB) {

        $scope.logout = function () {
            OpenFB.logout();
            $state.go('app.login');
        };

        $scope.revokePermissions = function () {
            OpenFB.revokePermissions().then(
                function () {
                    $state.go('app.login');
                },
                function () {
                    alert('Revoke permissions failed');
                });
        };

    })

    .controller('LoginCtrl', function ($scope, $location, $state, $ionicSlideBoxDelegate, OpenFB, FacebookCrawler) {

        $scope.facebookLogin = function () {

            OpenFB.login('user_birthday,user_events,user_photos,user_likes,friends_events').then(
                function () {
                    FacebookCrawler.startCrawling();
                    $location.path('/app/play');
                },
                function () {
                    alert('OpenFB login failed');
                });
        };

        $scope.next = function() {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function() {
            $ionicSlideBoxDelegate.previous();
        };

        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };

    })

    .controller('ShareCtrl', function ($scope, OpenFB) {

        $scope.item = {};

        $scope.share = function () {
            OpenFB.post('/me/feed', $scope.item)
                .success(function () {
                    $scope.status = "This item has been shared on OpenFB";
                })
                .error(function(data) {
                    alert(data.error.message);
                });
        };

    })

    .controller('ProfileCtrl', function ($scope, OpenFB, localStorageService) {
        OpenFB.get('/me').success(function (user) {
            $scope.user = user;
            $scope.counter = localStorageService.get('counter');
        });


    })

    .controller('CategoriesCtrl', function($scope, Categories) {
        $scope.categories = Categories.all();

    })

    .controller('CategoryCtrl', function($scope, $stateParams, Categories) {
        $scope.category = Categories.get($stateParams.categoryId);
    })

    .controller('PlayCtrl', function($scope, $ionicSwipeCardDelegate) {
        var cardTypes = [
            { title: 'Emma', image: 'img/emma.png' },
            { title: 'Emilia', image: 'img/emilia.png' },
            { title: 'Jennifer', image: 'img/jennifer.png' }
        ];

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

        $scope.goAway = function() {
            var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
            card.swipe();
        };

    })

    .controller('SettingsCtrl', function($scope, $state, OpenFB) {
        $scope.logout = function () {
            OpenFB.logout();
            $state.go('app.login');
        };
    });