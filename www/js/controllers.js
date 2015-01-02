angular.module('splash.controllers', [])

    .controller('CardCtrl', function($scope, $ionicSwipeCardDelegate) {
        $scope.goAway = function() {
            var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
            card.swipe();
        };
    })


    .controller('SelectCategoriesCtrl', function($scope, $localstorage) {

        var categories = $localstorage.getObject('categories');
        if (categories == null) {
            $scope.categories = [
                {id:0, name: "Clubs", checked: true },
                {id:1, name: "Parties", checked: true },
                {id:2, name: "Bars", checked: true }
            ];
            $localstorage.setObject('categories', $scope.categories);
        } else {
            $scope.categories = categories;
        }

        // set localStorage when function is called after a value is changed
        $scope.updateStorage = function(category){
            var categories = $localstorage.getObject('categories');
            categories[category.id] = category;
            $localstorage.setObject('categories', categories);
        };

    })


    .controller('ChatsCtrl', function($scope, Chats) {
        $scope.chats = Chats.all();
        $scope.remove = function(chat) {
            Chats.remove(chat);
        }
    })

    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('EventsCtrl', function($scope, Events) {
        $scope.events = Events.all();
    })

    .controller('EventDetailCtrl', function($scope, $stateParams, Events) {
        $scope.event = Events.get($stateParams.eventId);
    })