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

        $scope.cardHeight = $rootScope.width + "px";
        $scope.cardWidth = $rootScope.width + "px";
        $scope.descPaddingTop = ($rootScope.width * 0.79) + "px";
        $scope.descPaddingLeft = ($rootScope.width * 0.025) + "px";
        $scope.descpPaddingTop = ($rootScope.width * 0.04) + "px";

    });