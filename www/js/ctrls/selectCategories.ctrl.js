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

        // CONTSTANTS
        // todo: put them into local storage
        var lineHeight = 20;
        var eventCategoriesBorderRadius = 8;
        var checkBoxHeight = screenHeight * 0.08;

        // VARIABLES
        $scope.eventCategoriesHeight = ($scope.checkBoxHeight * 3) + "px";
        $scope.eventCategoriesWidth = (screenWidth * 0.9) + "px";
        $scope.eventCategoriesMarginTop = (screenHeight * 0.04) + "px";
        $scope.eventCategoriesBorderRadius = eventCategoriesBorderRadius + "px";

        $scope.lineHeight = lineHeight+ "px";

        $scope.checkBoxHeight = checkBoxHeight + "px";
        $scope.paddingTopCheckBoxText = (checkBoxHeight/2 - lineHeight/2) + "px";

        $scope.checkBoxBorderRadius = 4 * eventCategoriesBorderRadius + "px";


    });