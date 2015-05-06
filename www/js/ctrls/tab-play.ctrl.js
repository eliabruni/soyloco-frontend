angular.module('splash.tabPlay.ctrl', [])


    .controller('TabPlayCtrl', function($localstorage, $scope, $timeout, $cordovaGoogleAnalytics, $ionicSwipeCardDelegate) {

        $scope.$on('$ionicView.beforeEnter', function() {
            $cordovaGoogleAnalytics.trackView('Play');
        });

        /***************
         * CARDS
         */

        //    /***************
        //     * MOKE DATA
        //     ***************/
        var cardTypes = [{
            name1: 'Emilia',
            name2: 'Emma',
            image1: 'url(img/emilia.jpg)',
            image2: 'url(img/emma.jpg)'

        },
            {
                name1: 'Frieda',
                name2: 'Olga',
                image1: 'url(img/frieda.jpg)',
                image2: 'url(img/olga.jpg)'

            },
            {
                name1: 'Emma',
                name2: 'Kristen',
                image1: 'url(img/emma.jpg)',
                image2: 'url(img/kristen.jpg)'
            },
            {
                name1: 'Frieda',
                name2: 'Emma',
                image1: 'url(img/frieda.jpg)',
                image2: 'url(img/emma.jpg)'
            },
            {
                name1: 'Olga',
                name2: 'Kristen',
                image1: 'url(img/olga.jpg)',
                image2: 'url(img/kristen.jpg)'

            }];


        /***************
         * LOGIC
         ***************/

        $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

        $scope.card = cardTypes[Math.floor(Math.random() * cardTypes.length)];


        $scope.cardDestroyed = function (index) {
            $scope.cards.splice(index, 1);
        };

        $scope.addCardUp = function () {
            $scope.buttonUpOpacity = 0.1;
            $timeout(function() {
                $scope.card = cardTypes[Math.floor(Math.random() * cardTypes.length)];
                $scope.buttonUpOpacity = 1;
            }, 250);
        };

        $scope.addCardBottom = function () {
            $scope.buttonBottomOpacity = 0.1;
            $timeout(function() {
                $scope.card = cardTypes[Math.floor(Math.random() * cardTypes.length)];
                $scope.buttonBottomOpacity = 1;
            }, 250);
        };


        /***************
         * CSS size stuff
         ***************/

        // Screen width and height are set at signin only once
        var screenWidth = $localstorage.getObject('screenWidth');
        var screenHeight = $localstorage.getObject('screenHeight');


        $scope.containerMargin = [(screenWidth * 0) + "px" + (screenWidth * 0) + "px " + (screenWidth * 0.0) + "px " + (screenWidth * 0) + "px "];
        $scope.containerPaddingBottom = (screenWidth * 0.0) + "px";

        $scope.scrollHeight = (screenWidth * 0.86) + "px";


        $scope.cardHeight = (screenWidth * 1) + "px";
        $scope.cardWidth = (screenWidth * 1) + "px";
        $scope.backgroundSize = (screenWidth * 1) + "px " + (screenWidth * 1) + "px";

        $scope.cardTextHeight = (screenWidth * 0.01) + "px";
        $scope.cardTextPaddingTop = (screenWidth * 0.5) + "px";
        $scope.cardTextFontSize = (screenWidth * 0.06) + "px";

        $scope.cardTextMarginTop = -(screenHeight * 0.117) + "px";

        $scope.cardTextMarginLeft = (screenHeight * 0.02) + "px";
        $scope.secondContainerMarginTop = -(screenWidth * 0) + "px";


    });