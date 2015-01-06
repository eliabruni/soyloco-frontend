angular.module('splash.tabEvents.ctrl', [])

    .controller('TabEventsCtrl', function($scope, Events) {
        $scope.events = Events.all();
    });