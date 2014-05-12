angular.module('soyloco.controllers', ['ionic.contrib.ui.cards'])

    .controller('AppCtrl', function ($scope, $state, OpenFB, MenuService, Categories) {

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
                    //alert('Revoke permissions failed');
                });
        };


        $scope.setCategoryIdx = function(categoryIdx) {
            Categories.setCategoryIdx(categoryIdx);
        }



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

                OpenFB.login('user_birthday,user_friends,user_events,user_photos,user_likes,friends_events').then(
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
                    //alert(data.error.message);
                });
        };

    })

    .controller('ProfileCtrl', function ($scope, MenuService) {
        MenuService.enableRightMenu(false);


    })

/*************************************
 *
 *          Category controller
 *
 * */
    .controller('CategoryCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, $ionicLoading,
                                         Categories, Geo, MenuService) {

        MenuService.enableRightMenu(true);

        Categories.setCategoryIdx(0);

        // Get the category ID into scope
        $scope.$watch(function () {
                return Categories.actualCategoryIdx;
            },

            function() {
                $scope.category = Categories.getActualCategory();
            }, true);



        // MAP LOGIC

        // Fake coords to make browser working
        var lat = 33.22;
        var long = 35.33;

        if (Geo.getPosition() != null) {
            var position = Geo.getPosition();
            lat = position.lat;
            long = position.long;
        }

        $scope.center = {
            latitude: lat,
            longitude: long
        };

        $scope.selfMarker = {
            icon: 'img/maps/self_marker.png',
            latitude:lat,
            longitude:long,
            fit:true
        };


        $scope.$watch('Geo.getPosition()', function(newPosition) {
            $scope.$apply(function () {
                $scope.selfMarker.latitude = newPosition.lat;
                $scope.selfMarker.longitude = newPosition.long;
            });
        });

        $scope.map = {
            zoom: 14,
            draggable: true,
            options: {
                streetViewControl: false,
                panControl: false,
                mapTypeId: "roadmap",
                disableDefaultUI: true
            },
            markers : [
                {
                    icon: 'img/maps/blue_marker.png',
                    "latitude":$scope.selfMarker.latitude+0.001,
                    "longitude":$scope.selfMarker.longitude+0.003,
                    fit:true

                },
                {
                    icon: 'img/maps/blue_marker.png',
                    "latitude":$scope.selfMarker.latitude+0.002,
                    "longitude":$scope.selfMarker.longitude+0.001,
                    fit:true

                }
            ]
        };



        // SLIDER LOGIC

        $scope.slideIndex = 0;

        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };

        $scope.goToWhoYouLike = function() {

            if ($scope.slideIndex == 1) {
                $ionicSlideBoxDelegate.previous();
            }
            else if ($scope.slideIndex == 2) {
                $ionicSlideBoxDelegate.previous();
                $ionicSlideBoxDelegate.previous();
            }
            $scope.slideIndex == 0;
        };

        $scope.goToWhoLikesYou = function() {

            if ($scope.slideIndex == 0) {
                $ionicSlideBoxDelegate.next();
            }
            else if ($scope.slideIndex == 2) {
                $ionicSlideBoxDelegate.previous();
            }
            $scope.slideIndex == 1;

        };

        // Called each time the slide changes
        $scope.goToBothLike = function() {

            if ($scope.slideIndex == 0) {
                $ionicSlideBoxDelegate.next();
                $ionicSlideBoxDelegate.next();
            }
            else if ($scope.slideIndex == 1) {
                $ionicSlideBoxDelegate.next();
            }
            $scope.slideIndex == 2;

        };




    })


/*************************************
 *
 *          Play controller
 *
 * */
    .controller('PlayCtrl', function($scope, $timeout, $ionicSlideBoxDelegate,
                                     $ionicSwipeCardDelegate, Crawler, MenuService, Users) {


        // Need to reactivate the side menu just here because it's the fallback route;
        MenuService.enableLeftMenu(true);
        MenuService.enableRightMenu(false);


        // Crwaling starts here becuse it's the fallback route.
        // If fallback route is changed, remeber to move Crawler.init().
        if (!Crawler.getInit()) {
            //Crawler.init();
        }


        // TODO: change the nonsense timeout. The problem is that without is doesn't work.
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
        }, 0);

        //TODO: This is just a plcaeholder for a call to the server
        $timeout(function () {
            $ionicSlideBoxDelegate.next();
            //$ionicSlideBoxDelegate.enableSlide(false);

        }, 10000);


        var users = Users.all();

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

    .controller('SettingsCtrl', function($scope, $state, OpenFB, Crawler, MenuService) {
        MenuService.enableRightMenu(false);

        $scope.logout = function () {
            OpenFB.logout();
            Crawler.stop();
            Crawler.setInit(false);
            $state.go('app.login');
        };
    });