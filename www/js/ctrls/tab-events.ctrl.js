angular.module('splash.tabEvents.ctrl', [])

    .controller('TabEventsCtrl', function($scope, Events) {
        $scope.events = Events.all();


        $scope.doRefresh = function() {
            setTimeout(function() {

                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            }, 3000);
        };
    });