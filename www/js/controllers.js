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

    .controller('LoginCtrl', function ($scope, $location, $state, $ionicSlideBoxDelegate,$timeout,
                                       $ionicLoading, OpenFB) {

        var numTaps = 0;

        $scope.facebookLogin = function () {

            // This is to avoid multiple tapping

            numTaps++;
            if (numTaps > 1) {
                return;
            }

            // Setup the loader
            $scope.show = $ionicLoading.show({
                template: '<i class="icon ion-loading-c facebook-login-loader"></i>',
                noBackdrop: 'true',
                duration: 5000
            });

            // TODO
            // This should deactivate button once pressed and hide back nav
            // NOT WORKING FOR NOW
            /*$ionicViewService.nextViewOptions({
             disableAnimate: true,
             disableBack: true
             });*/

            // Set a timeout to clear loader, however you would actually
            // call the $scope.loading.hide(); method whenever everything is ready or loaded.
            $timeout(function () {

                OpenFB.login('user_birthday,user_events,user_photos,user_likes,friends_events').then(
                    function () {
                        $state.go('app.play');
                    },

                    // TODO: Not capturing errors
                    function () {
                        // Reset numTaps to 0 so that the facebook login button can
                        // be tapped again
                        numTaps = 0;
                    });
                $ionicLoading.hide();
            }, 5000);





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
            $scope.longTermToken = localStorageService.get('longTermToken');
        });


    })

    .controller('CategoriesCtrl', function($scope, Categories) {
        $scope.categories = Categories.all();

    })

/*************************************
 *
 *          Category controller
 *
 * */
    .controller('CategoryCtrl', function($scope, $stateParams, Categories) {

        // Get the category ID into scope
        $scope.category = Categories.get($stateParams.categoryId);

        $scope.map = {
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 12,
            draggable: false,
            options: {
                streetViewControl: false,
                panControl: false,
                mapTypeId: "roadmap",
                disableDefaultUI: true
            }
        };


    })


/*************************************
 *
 *          Play controller
 *
 * */
    .controller('PlayCtrl', function($scope, $ionicSwipeCardDelegate, Crawler) {

        // Crwaling starts here becuse it's the fallback route.
        // If fallback route is changed, remeber to move Crawler.init().
        //Crawler.init();

        var cardTypes = [
            { title: 'Emma', image: 'img/emma.png' },
            { title: 'Emilia', image: 'img/emilia.png' },
            { title: 'Jennifer', image: 'img/jennifer.png' }
        ];

        $scope.nextUser = function() {
            $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);
            $scope.addCard();
            $scope.addCard();
            $scope.addCard();
            $scope.addCard();
        }


        $scope.cardSwiped = function(index) {
            if (index == 0) {
                $scope.nextUser();
            }
            //$scope.addCard();
            //$scope.addCard();

        };

        $scope.cardDestroyed = function(index) {
            //$scope.cards.splice(index, 1);
        };

        $scope.addCard = function() {
            var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));
        };


        $scope.goAway = function() {
            var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
            card.swipe();
            $scope.nextUser();
        };

    })

    .controller('SettingsCtrl', function($scope, $state, OpenFB) {
        $scope.logout = function () {
            OpenFB.logout();
            $state.go('app.login');
        };
    });