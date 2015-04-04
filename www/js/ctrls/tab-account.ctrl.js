angular.module('splash.tabAccount.ctrl', [])


    .controller('TabAccountCtrl', function($scope, $q, $state, $ionicModal, $ionicLoading,
                                           $ionicPopup, $cordovaFacebook, $cordovaFile,
                                           $cordovaGeolocation, $localstorage, $cordovaGoogleAnalytics, $profile) {

        // GA
        $scope.$on('$ionicView.beforeEnter', function() {
            $cordovaGoogleAnalytics.trackView('Profile');
        });

        $scope.showView = true;


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

        // set localStorage when function is called after a value is changed
        $scope.updateCity = function(city){

            $localstorage.setObject('cities', $scope.cities);
            $localstorage.setObject('myCity', city);
        };

        /***************
         * GENDER
         */
        var genders = $localstorage.getObject('genders');
        if (genders == null) {
            $scope.genders = [
                {id:0, type: "Male", checked: false },
                {id:1, type: "Female", checked: false }
            ];
            $localstorage.setObject('genders', $scope.genders);
        } else {
            $scope.genders = genders;
        }

        // set localStorage when function is called after a value is changed
        $scope.updateGender = function(gender){
            var genders = $localstorage.getObject('genders');
            genders[gender.id] = gender;
            $localstorage.setObject('genders', genders);
        };


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

        /***************
         *
         */

        $scope.contentMarginTop = (screenHeight * 0.2) + "px";
        $scope.contentPaddingTop = (screenHeight * 0.2) + "px";

        $scope.profileInfoTop = -(screenHeight * 0.1) + "px";

        $scope.imageWidth = (screenHeight * 0.2) + "px";
        $scope.imageHeight = (screenHeight * 0.2) + "px";
        $scope.imageBorderRadius = (screenHeight * 0.15) + "px";

        // CONSTANTS
        // todo: to be hardcoded into local storage
        var lineHeight = 20;
        var eventCategoriesBorderRadius = 8;
        var checkBoxHeight = screenHeight * 0.08;

        // VARIABLES
        $scope.genderSelectorMarginTop = (screenHeight * 0.04) + "px";
        $scope.genderSelectorWidth = (screenWidth * 0.9) + "px";

        $scope.genderTextPaddingLeft = (screenHeight * 0.01) + "px";
        $scope.genderTextPaddingBottom = (screenHeight * 0.005) + "px";

        $scope.genderCheckboxHeight = ($scope.checkBoxHeight * 3) + "px";
        $scope.genderCheckboxWidth = (screenWidth * 0.9) + "px";
        $scope.genderCheckboxBorderRadius = eventCategoriesBorderRadius + "px";

        $scope.lineHeight = lineHeight+ "px";

        $scope.checkBoxHeight = checkBoxHeight + "px";
        $scope.paddingTopCheckBoxText = (checkBoxHeight/2 - lineHeight/2) + "px";

        $scope.checkBoxBorderRadius = 4 * eventCategoriesBorderRadius + "px";


    });