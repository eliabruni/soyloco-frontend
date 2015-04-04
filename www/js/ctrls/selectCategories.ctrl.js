angular.module('splash.selectCategories.ctrl', [])

    .controller('SelectCategoriesCtrl', function($scope, $localstorage, $cordovaGoogleAnalytics) {

        // GA
        $scope.$on('$ionicView.beforeEnter', function() {
            $cordovaGoogleAnalytics.trackView('SelectCategories');
        });

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


        /***************
         * CSS stuff
         ***************/

        // Screen width and height are set at signin only once
        var screenWidth = $localstorage.getObject('screenWidth');
        var screenHeight = $localstorage.getObject('screenHeight');


        // CONSTANTS
        // todo: to be hardcoded into local storage
        var buttonBoxWidth = (screenWidth * 0.9);
        var buttonBoxMarginTop = (screenHeight * 0.04);
        var buttonHeight = (screenHeight * 0.08);
        var buttonBorderRadius = 8;
        var intraButtonPaddingTop = 5;
        var adHocInternalBorderRadius = 4 * buttonBorderRadius;
        var lineHeight = 20;


        // VARIABLES

        //GENERAL
        $scope.buttonBoxWidth = buttonBoxWidth + "px";
        $scope.buttonBoxMarginTop = buttonBoxMarginTop + "px";
        $scope.buttonHeight = buttonHeight + "px";
        $scope.buttonBorderRadius = buttonBorderRadius + "px";
        $scope.intraButtonPaddingTop = intraButtonPaddingTop + "px";
        $scope.adHocInternalBorderRadius = adHocInternalBorderRadius + "px";
        $scope.lineHeight = lineHeight+ "px";



        // VARIABLES
        $scope.eventCategoriesHeight = (buttonHeight * 3) + "px";
        $scope.eventCategoriesWidth = (screenWidth * 0.9) + "px";
        $scope.paddingTopCheckBoxText = (buttonHeight/2 - lineHeight/2) + "px";


    });