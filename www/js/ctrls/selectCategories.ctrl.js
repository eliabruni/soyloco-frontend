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

    });