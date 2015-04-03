angular.module('splash.tabAccount.ctrl', [])


    .controller('TabAccountCtrl', function($scope, $q, $state, $ionicModal, $ionicLoading,
                                           $ionicPopup, $cordovaFacebook, $cordovaFile,
                                           $cordovaGeolocation, $localstorage, $cordovaGoogleAnalytics, $profile) {

        // GA
        $scope.$on('$ionicView.beforeEnter', function() {
            $cordovaGoogleAnalytics.trackView('Profile');
        });

        $scope.showView = true;

        if ($localstorage.get('profilePhoto') == null ||  $localstorage.getObject('basicInfo') == null || $localstorage.getObject('myCity') == null) {

            alert('Profile info problems, need to deal with this case')

        } else {
            $scope.cities = $localstorage.getObject('cities');
            $scope.myCity = $localstorage.getObject('myCity');
            $scope.basicInfo = $localstorage.getObject('basicInfo');
            $scope.profilePhoto = $localstorage.get('profilePhoto');
        }

        // set localStorage when function is called after a value is changed
        $scope.updateStorage = function(city){

            $localstorage.setObject('cities', $scope.cities);
            $localstorage.setObject('myCity', city);
        };

        $scope.logout = function() {
            $cordovaFacebook.logout().then(function (success) {
                $localstorage.set('profileInfoRetrieved', 'false');
                $state.go('signin');
            }, function (error) {
                // error
            })
        }

        /***************
         * CSS stuff
         ***************/

        // Screen width and height are set at signin only once
        var screenWidth = $localstorage.getObject('screenWidth');
        var screenHeight = $localstorage.getObject('screenHeight');

        /***************
         * CARDS
         */

        $scope.contentMarginTop = (screenHeight * 0.2) + "px";
        $scope.contentPaddingTop = (screenHeight * 0.2) + "px";

        $scope.profileInfoTop = -(screenHeight * 0.1) + "px";

        $scope.imageWidth = (screenHeight * 0.2) + "px";
        $scope.imageHeight = (screenHeight * 0.2) + "px";
        $scope.imageBorderRadius = (screenHeight * 0.15) + "px";

    });