angular.module('splash.tabs.ctrl', [])


    .controller('TabsCtrl', function($rootScope, $scope, $q, $state, $ionicModal, $ionicLoading,
                                           $ionicPopup, $cordovaFacebook, $cordovaFile,
                                           $cordovaGeolocation, $localstorage, $cordovaGoogleAnalytics, $profile) {

        // GA
        $scope.$on('$ionicView.beforeEnter', function() {
            $cordovaGoogleAnalytics.trackView('Tabs');
        });

        $scope.showView = true;

        // We get screen size only at fb login time
        if (!$rootScope.appInitialized) {
            var newScreenHeight = document.getElementsByTagName('ion-pane')[0].clientHeight;
            var newScreenWidth = document.getElementsByTagName('ion-pane')[0].clientWidth;

            $localstorage.setObject('screenHeight', newScreenHeight);
            $localstorage.setObject('screenWidth', newScreenWidth);
        }



        /***************
         * GENERAL PROFILE INFO
         */
        if ($localstorage.get('profilePhoto') == null ||  $localstorage.getObject('basicInfo') == null || $localstorage.getObject('myCity') == null) {

            alert('Profile info problems, need to deal with this case')

        } else {
            $scope.cities = $localstorage.getObject('cities');
            $scope.myCity = $localstorage.getObject('myCity');
            $scope.basicInfo = $localstorage.getObject('basicInfo');
            $scope.profilePhoto = $localstorage.get('profilePhoto');
        }



        /***************
         * LOGOUT
         */
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

        //PROFILE INFO
        $scope.profileItemHeight = (screenHeight * 0.38) + "px";
        $scope.profileItemPaddingTop = (screenHeight * 0.06) + "px";
        $scope.profileNameMarginTop = (screenHeight * 0.015) + "px";
        $scope.profileViewMarginTop = (screenHeight * 0.005) + "px";


        $scope.imageWidth = (screenHeight * 0.19) + "px";
        $scope.imageHeight = (screenHeight * 0.19) + "px";
        $scope.imageBorderRadius = (screenHeight * 0.15) + "px";

    });