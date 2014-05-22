angular.module('soyloco.controllers', [])

    .controller('TabsCtrl', function ($scope, $state, OpenFB) {

        $scope.logout = function () {
            OpenFB.logout();
            $state.go('login');
        };

        $scope.revokePermissions = function () {
            OpenFB.revokePermissions().then(
                function () {
                    $state.go('login');
                },
                function () {
                    //alert('Revoke permissions failed');
                });
        };

    })

/*************************************
 *          Login controller
 *
 * */
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
            var timer = $timeout(function () {

                OpenFB.login('user_birthday,user_friends,user_events,user_photos,user_likes,friends_events').then(
                    function () {

                        $state.go('tab.category');
                    },

                    // TODO: Not capturing errors
                    function () {
                        // Reset numTaps to 0 so that the facebook login button can
                        // be tapped again
                        numTaps = 0;
                    });
                $ionicLoading.hide();
            }, 5000);

            // When the DOM element is removed from the page,
            // AngularJS will trigger the $destroy event on
            // the scope. This gives us a chance to cancel any
            // pending timer that we may have.
            $scope.$on(
                "$destroy",
                function(event) {
                    $timeout.cancel(timer);
                }
            );

        };

        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };

    })



/*************************************
 *          Category controller
 *
 * */
    .controller('CategoryCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, $ionicNavBarDelegate,
                                         $ionicLoading, Crawler, Categories, Geo) {

        $ionicNavBarDelegate.align('left');

        // This set the actual category
        Categories.setCategoryIdx(0);
        $scope.category = Categories.getActualCategory();

        // Crwaling starts here becuse it's the fallback route.
        // If fallback route is changed, remeber to move Crawler.init().
        if (!Crawler.getInit()) {
            //Crawler.init();
        }

        $scope.map = Geo.getMap();

        $scope.$watch('Geo.getPosition()', function(newPosition) {
            $scope.$apply(function () {
                $scope.map.selfMarker.latitude = newPosition.lat;
                $scope.map.selfMarker.longitude = newPosition.long;
            });
        });


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


    .controller('ProfileCtrl', function($scope) {
    })

/*************************************
 *          Play controller
 *
 * */
    .controller('PlayCtrl', function($scope, $timeout, $ionicSlideBoxDelegate,
                                     $ionicSwipeCardDelegate, Users) {

        // TODO: change the nonsense timeout. The problem is that without it, it doesn't work.
        $timeout(function () {
            $ionicSlideBoxDelegate.enableSlide(false);
        }, 0);

        //TODO: This is just a plcaeholder for a call to the server
        var timer = $timeout(function () {
            $ionicSlideBoxDelegate.next();
            //$ionicSlideBoxDelegate.enableSlide(false);

        }, 2000);

        // When the DOM element is removed from the page,
        // AngularJS will trigger the $destroy event on
        // the scope. This gives us a chance to cancel any
        // pending timer that we may have.
        $scope.$on(
            "$destroy",
            function(event) {
                $timeout.cancel(timer);
            }
        );


        var users = Users.all();


        $scope.nextUser = function(nextUserId) {

            $scope.userId = nextUserId;

            var photos = users[nextUserId-1].photos;
            $scope.cards = Array.prototype.slice.call(photos, 0, 0);
            $scope.userName = users[nextUserId-1].name;

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

            $scope.userId = userId;

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

        // Start with first card
        // TODO: put this into directive?
        var init = function () {
            $scope.nextUser(1);
        };
        // and fire it after definition
        init();


    })

/*************************************
 *          Invite controller
 *
 * */
    .controller('InviteCtrl', function($scope) {
    })

/*************************************
 *          Logout controller
 *
 * */
    .controller('SettingsCtrl', function($scope, $state, OpenFB, Crawler) {

        $scope.logout = function () {
            OpenFB.logout();
            Crawler.stop();
            Crawler.setInit(false);
            $state.go('login');
        };
    });
