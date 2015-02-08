angular.module('splash.tabEvents.ctrl', [])

    .controller('TabEventsCtrl', function($scope, $localstorage, $ionicSlideBoxDelegate, Events) {

        $scope.events = Events.all();


        $scope.doRefresh = function() {
            setTimeout(function() {

                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            }, 3000);
        };


        $scope.deactivateSlide = function(slie) {
            $ionicSlideBoxDelegate.enableSlide(false);
        };

        $scope.goToToday = function() {
            alert('here 1')
            $ionicSlideBoxDelegate.to(1)
        }

        $scope.goToTomorrow = function() {
            alert('here 2')

            $ionicSlideBoxDelegate.to(2)
        }

        $scope.goToWeekend = function() {
            alert('here 3')

            $ionicSlideBoxDelegate.to(3)
        }

        /***************
        * CSS stuff
        ***************/

        // Screen width and height are set at signin only once
        var screenWidth = $localstorage.getObject('screenWidth');

        /***************
        * CARDS
        */

        $scope.containerMargin = [(screenWidth * 0.04) + "px auto " + (screenWidth * 0.04) + "px auto"];
        $scope.containerPaddingBottom = (screenWidth * 0.03) + "px";

        $scope.cardHeight = (screenWidth * 0.75) + "px";
        $scope.cardWidth = (screenWidth * 0.96) + "px";

        $scope.descPaddingTop = (screenWidth * 0.03) + "px";
        $scope.descPaddingLeft = (screenWidth * 0.02) + "px";
        $scope.descpPaddingTop = (screenWidth * 0.01) + "px";

        $scope.contentHeight = (screenWidth * 0.2) + "px";
        $scope.contentPaddingTop = (screenWidth * 0.05) + "px";

        $scope.descH3FontSize = (screenWidth * 0.05) + "px";
        $scope.descMarginBottom = (screenWidth * 0.004) + "px";


    });