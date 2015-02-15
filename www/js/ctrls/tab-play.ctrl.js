angular.module('splash.tabPlay.ctrl', [])


    .controller('TabPlayCtrl', function($rootScope, $localstorage, $scope, $ionicSwipeCardDelegate) {

        /***************
         * CSS stuff
         ***************/

        // We get screen size only at fb login time
        if (!$rootScope.appInitialized) {
            var newScreenHeight = document.getElementsByTagName('ion-pane')[0].clientHeight;
            var newScreenWidth = document.getElementsByTagName('ion-pane')[0].clientWidth;

            $localstorage.setObject('screenHeight', newScreenHeight);
            $localstorage.setObject('screenWidth', newScreenWidth);
        }

        //var screenHeight = $localstorage.getObject('screenHeight');

        //var size = (screenHeight * 0.85) / 2;

        ///***************
        // * CARD 1
        // */
        //
        //$scope.height = size + "px";
        //$scope.width = size + "px";
        //
        //// These two values need simply to be
        //// -1/2 * (height or weight).
        //$scope.marginTop = -(size * 0.5) + "px";
        //$scope.marginLeft = -(size * 0.5) + "px";
        //
        //// Top needs to be
        ////  -1/2 * (height or weight) + something
        //$scope.top = (size * 0.5 + size * 0.0) + "px";
        //$scope.left = 50 + "%";
        //
        //
        ///***************
        // * CARD 2
        // */
        //
        //$scope.height2 = (size) + "px";
        //$scope.width2 = (size) + "px";
        //
        //
        //$scope.marginTop2 = (size * 0.0) + "px";
        //$scope.marginLeft2 = -(size * 0.5) + "px";
        //
        //// Top needs to be
        ////  1/2 * (height or weight) + something
        //$scope.top2 = (size) + "px";
        //$scope.left2 = 50 + "%";

        //$scope.padding = '50px 0px'
        //$scope.cardWidth = '600px'
        // Screen width and height are set at signin only once
        var screenWidth = $localstorage.getObject('screenWidth');



        /***************
         * CSS stuff
         ***************/

        // Screen width and height are set at signin only once
        var screenWidth = $localstorage.getObject('screenWidth');

        /***************
         * CARDS
         */

        $scope.containerMargin = [(-screenWidth * 0.005) + "px auto " + (screenWidth * 0.01) + "px auto"];
        $scope.containerPaddingBottom = (screenWidth * 0.00) + "px";

        $scope.cardHeight = (screenWidth * 0.77) + "px";
        $scope.cardWidth = (screenWidth * 0.77) + "px";
        $scope.backgroundSize = (screenWidth * 0.77) + "px " + (screenWidth * 0.77) + "px";



        $scope.cardTextHeight = (screenWidth * 0.01) + "px";
        $scope.cardTextPaddingTop = (screenWidth * 0.5) + "px";
        $scope.cardTextFontSize = (screenWidth * 0.06) + "px";




        /***************
         * CARDS
         */


        //    /***************
        //     * MOKE DATA
        //     ***************/
        var cardTypes = [{
            title: 'Swipe down to clear the card',
            image1: 'url(http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic4.png)',
            image2: 'url(http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic.png)'

        },
            {
                title: 'Where is this?',
                image1: 'url(http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic.png)',
                image2: 'url(http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic2.png)'

            },
            {
                title: 'What kind of grass is this?',
                image1: 'url(http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic4.png)',
                image2: 'url(http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic2.png)'
            },
            {
                title: 'What beach is this?',
                image1: 'url(http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic.png)',
                image2: 'url(http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic3.png)'
            },
            {
                title: 'What kind of clouds are these?',
                image1: 'url(http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic3.png)',
                image2: 'url(http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic2.png)'

            }];


        /***************
         * LOGIC
         ***************/

        $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

        $scope.card = cardTypes[Math.floor(Math.random() * cardTypes.length)];


        $scope.cardSwiped = function (index) {
            $scope.addCard();
        };

        $scope.cardDestroyed = function (index) {
            $scope.cards.splice(index, 1);
        };

        $scope.addCard = function () {
            $scope.card = cardTypes[Math.floor(Math.random() * cardTypes.length)];

        }

    })


//    /***************
//     * MOKE DATA
//     ***************/
//
//    var cardTypes = [{
//        title: 'Swipe down to clear the card',
//        image: 'img/pic.png'
//    }, {
//        title: 'Where is this?',
//        image: 'img/pic.png'
//    }, {
//        title: 'What kind of grass is this?',
//        image: 'img/pic2.png'
//    }, {
//        title: 'What beach is this?',
//        image: 'img/pic3.png'
//    }, {
//        title: 'What kind of clouds are these?',
//        image: 'img/pic4.png'
//    }];
//
//
//    /***************
//     * LOGIC
//     ***************/
//
//    var lastIndex = 0;
//    $scope.cards = Array.prototype.slice.call(cardTypes, 0);
//
//    $scope.cardSwiped = function(index) {
//        $scope.addCard();
//    };
//
//    $scope.cardDestroyed = function(index) {
//        $scope.cards.splice(index, 1);
//    };
//
//    $scope.addCard = function() {
//        var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
//        newCard.id = Math.random();
//        $scope.cards.unshift(angular.extend({}, newCard));
//    };
//
//
//})
//
//.controller('CardCtrl', function($scope, $timeout, $ionicSwipeCardDelegate) {
//    $scope.goAway = function(index) {
//        $timeout(function () {
//            $scope.cards.splice(index, 1);
//            $scope.addCard();
//        }, 0);
//    }
//
//    //$scope.goAway = function() {
//    //    var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
//    //    card.swipe();
//    //};
//});