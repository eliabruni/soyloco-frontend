angular.module('splash.eventDetail.ctrl', [])
    
    .controller('EventDetailCtrl', function($scope, $stateParams, Events) {
        $scope.event = Events.get($stateParams.eventId);
    });