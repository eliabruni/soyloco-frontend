angular.module('splash.tabEvents.ctrl', [])

    .controller('TabEventsCtrl', function($scope, $localstorage, Events) {

        $scope.events = Events.all();


        $scope.doRefresh = function() {
            setTimeout(function() {

                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            }, 3000);
        };


        /***************
        * CSS stuff
        ***************/

        // Screen width and height are set at signin only once
        var screenWidth = $localstorage.getObject('screenWidth');

        /***************
        * CARDS
        */

        $scope.containerMargin = [(screenWidth * 0.04) + "px auto " + (screenWidth * 0.04) + "px auto"];
        $scope.containerPaddingBottom = (screenWidth * 0.06) + "px";

        $scope.cardHeight = (screenWidth * 0.9) + "px";
        $scope.cardWidth = (screenWidth * 0.96) + "px";

        $scope.descPaddingTop = (screenWidth * 0.72) + "px";
        $scope.descPaddingLeft = (screenWidth * 0.025) + "px";
        $scope.descpPaddingTop = (screenWidth * 0.04) + "px";

        $scope.contentHeight = (screenWidth * 0.1) + "px";

        $scope.descH3FontSize = (screenWidth * 0.07) + "px";
        $scope.descMarginBottom = (screenWidth * 0.004) + "px";


    });