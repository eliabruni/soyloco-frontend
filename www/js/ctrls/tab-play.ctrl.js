angular.module('splash.tabPlay.ctrl', [])


    .controller('TabPlayCtrl', function($rootScope, $scope, $ionicSwipeCardDelegate) {


        /***************
         * CSS stuff
         ***************/


            //var  height = document.getElementsByTagName('ion-pane')[0].clientHeight;
            //var width = document.getElementsByTagName('ion-pane')[0].clientWidth;
        $rootScope.height = document.getElementsByTagName('ion-pane')[0].clientHeight;
        $rootScope.width = document.getElementsByTagName('ion-pane')[0].clientWidth;
        //$rootScope.tabsHeight = document.getElementsByTagName('ion-tabs')[0].clientHeight;

        //alert($rootScope.height)
        //  alert($rootScope.tabsHeight)

        var size = ($rootScope.height * 0.85) / 2;


        /***************
         * CARD 1
         */

        $scope.height = size + "px";
        $scope.width = size + "px";

        // These two values need simply to be
        // -1/2 * (height or weight).
        $scope.marginTop = -(size * 0.5) + "px";
        $scope.marginLeft = -(size * 0.5) + "px";

        // Top needs to be
        //  -1/2 * (height or weight) + something
        $scope.top = (size * 0.5 + size * 0.0) + "px";
        $scope.left = 50 + "%";


        /***************
         * CARD 2
         */

        $scope.height2 = (size) + "px";
        $scope.width2 = (size) + "px";


        $scope.marginTop2 =  (size * 0.0) + "px";
        $scope.marginLeft2 = -(size * 0.5) + "px";

        // Top needs to be
        //  1/2 * (height or weight) + something
        $scope.top2 = (size) + "px";
        $scope.left2 = 50 + "%";


        /***************
         * MOKE DATA
         ***************/

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


        /***************
         * LOGIC
         ***************/

        var lastIndex = 0;
        $scope.cards = Array.prototype.slice.call(cardTypes, 0);

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


    })

    .controller('CardCtrl', function($scope, $timeout, $ionicSwipeCardDelegate) {
        $scope.goAway = function(index) {
            $timeout(function () {
                $scope.cards.splice(index, 1);
                $scope.addCard();
            }, 0);
        }

        //$scope.goAway = function() {
        //    var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
        //    card.swipe();
        //};
    });