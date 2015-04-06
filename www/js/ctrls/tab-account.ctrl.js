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


        //CONTAINER
        $scope.contentMarginTop = (screenHeight * 0.2) + "px";
        $scope.contentPaddingTop = (screenHeight * 0.2) + "px";


        //PROFILE INFO
        $scope.profileInfoTop = -(screenHeight * 0.1) + "px";
        $scope.profileNameMarginTop = (screenHeight * 0.01) + "px";

        $scope.imageWidth = (screenHeight * 0.19) + "px";
        $scope.imageHeight = (screenHeight * 0.19) + "px";
        $scope.imageBorderRadius = (screenHeight * 0.15) + "px";


        //GENDER BOX
        $scope.genderSelectorMarginTop = (screenHeight * 0.04) + "px";
        $scope.genderSelectorWidth = (screenWidth * 0.9) + "px";

        $scope.genderTextPaddingLeft = (screenHeight * 0.01) + "px";
        $scope.genderTextPaddingBottom = (screenHeight * 0.005) + "px";

        $scope.genderCheckboxHeight = (buttonHeight * 2) + "px";
        $scope.genderCheckboxWidth = (screenWidth * 0.9) + "px";

        $scope.checkBoxHeight = buttonHeight + "px";
        $scope.paddingTopCheckBoxText = (buttonHeight/2 - lineHeight/2) + "px";


        //LOGOUT BUTTON
        $scope.logoutButtonMarginTop = (screenHeight * 0.04) + "px";



    });