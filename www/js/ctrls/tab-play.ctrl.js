angular.module('splash.tabPlay.ctrl', [])


    .controller('TabPlayCtrl', function($scope, $ionicSwipeCardDelegate) {
        var cardTypes = [{
            title: 'Swipe down to clear the card',
            image: 'img/pic.png'
        }, {
            title: 'Where is this?',
            image: 'img/pic.png'
        }, {
            title: 'What kind of grass is this?',
            image: 'img/pic2.png'
        }, {
            title: 'What beach is this?',
            image: 'img/pic3.png'
        }, {
            title: 'What kind of clouds are these?',
            image: 'img/pic4.png'
        }];

        $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

        $scope.cardSwiped = function(index) {
            $scope.addCard();
        };

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        };

        $scope.addCard = function() {
            var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            newCard.id = Math.random();
            $scope.cards.unshift(angular.extend({}, newCard));
        };


        /***************
         * CSS stuff
         */


        var  height = document.getElementsByTagName('ion-pane')[0].clientHeight;
        var width = document.getElementsByTagName('ion-pane')[0].clientWidth;
        var size = Math.min(height,width);


        /***************
         * CARD 1
         */

        $scope.height = 300 + "px";
        $scope.width = 300 + "px";

        // These two values need simply to be
        // -1/2 * (height or weight).
        $scope.marginTop = -150 + "px";
        $scope.marginLeft = -150 + "px";

        // Top needs to be
        //  -1/2 * (height or weight) + something
        $scope.top = 150 + "px";
        $scope.left = 50 + "%";


        /***************
         * CARD 2
         */

        $scope.height2 = 300 + "px";
        $scope.width2 = 300 + "px";


        $scope.marginTop2 =  10 + "px";
        $scope.marginLeft2 = -150 + "px";

        // Top needs to be
        //  1/2 * (height or weight) + something
        $scope.top2 = 150+150 + "px";
        $scope.left2 = 50 + "%";


    })

    .controller('CardCtrl', function($scope, $ionicSwipeCardDelegate) {
        $scope.goAway = function() {
            var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
            card.swipe();
        };
    });