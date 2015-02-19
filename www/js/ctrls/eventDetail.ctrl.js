angular.module('splash.eventDetail.ctrl', [])
    
    .controller('EventDetailCtrl', function($scope, $stateParams, Events, $cordovaGoogleAnalytics) {

        // GA
        $scope.$on('$ionicView.beforeEnter', function() {
            $cordovaGoogleAnalytics.trackView('EventDetail');
        });

        $scope.event = Events.get($stateParams.eventId);
    });