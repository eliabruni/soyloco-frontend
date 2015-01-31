angular.module('splash.tabEvents.ctrl', [])

    .controller('TabEventsCtrl', function($rootScope, $scope, Events) {

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


        /***************
         * CARDS
         */

        $scope.containerMargin = [($rootScope.width * 0.04) + "px auto " + ($rootScope.width * 0.04) + "px auto"];
        $scope.containerPaddingBottom = ($rootScope.width * 0.06) + "px";

        $scope.cardHeight = ($rootScope.width * 0.9) + "px";
        $scope.cardWidth = ($rootScope.width * 0.96) + "px";

        $scope.descPaddingTop = ($rootScope.width * 0.72) + "px";
        $scope.descPaddingLeft = ($rootScope.width * 0.025) + "px";
        $scope.descpPaddingTop = ($rootScope.width * 0.04) + "px";

        $scope.contentHeight = ($rootScope.width * 0.1) + "px";

        $scope.descH3FontSize = ($rootScope.width * 0.07) + "px";
        $scope.descMarginBottom = ($rootScope.width * 0.004) + "px";

    });