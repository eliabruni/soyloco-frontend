angular.module('splash.tabEvents.ctrl', [])

    .controller('TabEventsCtrl', function($scope, $timeout, $localstorage, $ionicSlideBoxDelegate,
                                          Events, $cordovaGoogleAnalytics) {

        // GA
        $scope.$on('$ionicView.beforeEnter', function() {
            $cordovaGoogleAnalytics.trackView('Events');
        });

        $scope.events = Events.all();

        $scope.doRefresh = function() {
            setTimeout(function() {

                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            }, 3000);
        };


        $scope.deactivateSlide = function() {
            $ionicSlideBoxDelegate.enableSlide(false);
        };



// SLIDER LOGIC

        $scope.slideIndex = 0;

// Called each time the slide changes
        $scope.slideChanged = function (index) {
            $scope.slideIndex = index;
        };

        $scope.goToToday = function () {

            if ($scope.slideIndex == 1) {
                $ionicSlideBoxDelegate.previous();
            }
            else if ($scope.slideIndex == 2) {
                $ionicSlideBoxDelegate.previous();
                $ionicSlideBoxDelegate.previous();
            }

            $scope.slideIndex == 0;

        };

        $scope.goToTomorrow = function () {

            if ($scope.slideIndex == 0) {
                $ionicSlideBoxDelegate.next();
            }
            else if ($scope.slideIndex == 2) {
                $ionicSlideBoxDelegate.previous();
            }

            $scope.slideIndex == 1;

        };

        $scope.goToWeekend = function () {

            if ($scope.slideIndex == 0) {
                $ionicSlideBoxDelegate.next();
                $ionicSlideBoxDelegate.next();

            }
            else if ($scope.slideIndex == 1) {
                $ionicSlideBoxDelegate.next();

            }

            $scope.slideIndex == 2;

        };


        /***************
        * CSS stuff
        ***************/

        // Screen width and height are set at signin only once
        var screenWidth = $localstorage.getObject('screenWidth');

        /***************
        * CARDS
        */

        $scope.containerMargin = [-(screenWidth * 0.001) + "px auto " + (screenWidth * 0.04) + "px auto"];
        $scope.containerPaddingBottom = (screenWidth * 0.02) + "px";

        $scope.containerHeight = (screenWidth * 1.05) + "px";
        $scope.containerWidth = (screenWidth * 1) + "px";

        $scope.cardHeight = (screenWidth * 1.1) + "px";
        $scope.cardWidth = (screenWidth * 1) + "px";
        $scope.backgroundSize = (screenWidth * 1) + "px " + (screenWidth * 0.95) + "px";



        $scope.cardTextHeight = (screenWidth * 0.01) + "px";
        $scope.cardTextPaddingTop = (screenWidth * 0.4) + "px";
        $scope.cardTextFontSize = (screenWidth * 0.06) + "px";


    });