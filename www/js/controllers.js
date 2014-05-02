angular.module('soyloco.controllers', ['ionic.contrib.ui.cards'])

    .controller('AppCtrl', function ($scope, $state, OpenFB, MenuService) {

        $scope.MenuService = MenuService;

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
                                       $ionicLoading, OpenFB, MenuService) {

        MenuService.isEnabled = false;

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
    .controller('PlayCtrl', function($scope, $ionicSwipeCardDelegate, Crawler, MenuService) {


        // Need to reactivate the side menu just here because it's the fallback route;
        MenuService.isEnabled = true;


        // Crwaling starts here becuse it's the fallback route.
        // If fallback route is changed, remeber to move Crawler.init().
        //Crawler.init();

        var users = [
            {id:1, name:'emilia', photos:[{id: 1, userId: 1, image: 'img/emilia.jpg'},
                {id: 2,userId: 1, image: 'img/emilia.jpg'},
                {id: 3,userId: 1, image: 'img/emilia.jpg'}]},

            {id:2, name:'emma', photos:[{id: 1,userId: 2, image: 'img/emma.jpg'},
                {id: 2,userId: 2, image: 'img/emma.jpg'},
                {id: 3,userId: 2, image: 'img/emma.jpg'}]},
            {id:3, name:'jennifer', photos:[{id: 1, userId: 3, image: 'img/jennifer.jpg'},
                {id: 2, userId: 3,image: 'img/jennifer.jpg'},
                {id: 3, userId: 3,image: 'img/jennifer.jpg'}]}
        ];

        $scope.nextUser = function(nextUserId) {

            var photos = users[nextUserId-1].photos;
            $scope.cards = Array.prototype.slice.call(photos, 0, 0);

            var photoIdx, photo;
            for (photoIdx in photos) {
                photo = photos[photoIdx];
                $scope.addUserCard(photo);
            }

            // Add first card again
            $scope.addUserCard(photos[0]);
        };

        $scope.addUserCard = function(userCard) {
            $scope.cards.push(angular.extend({}, userCard));
        };

        $scope.cardSwiped = function(index, userId) {

            // Index goes in decreasing order,
            // We need to update at one before last, i.e. index == 1
            if (index == 1) {
                $scope.nextUser(userId);
            }

        };

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        };

        $scope.goAway = function(userId) {

            // This is just for infinite user loop
            if(userId == 3) {
                $scope.nextUser(1);
            } else {
                $scope.nextUser(userId + 1);
            }
        };


    })

    .controller('SettingsCtrl', function($scope, $state, OpenFB) {
        $scope.logout = function () {
            OpenFB.logout();
            $state.go('app.login');
        };
    });