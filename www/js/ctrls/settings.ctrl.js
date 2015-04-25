angular.module('splash.settings.ctrl', [])


    .controller('SettingsCtrl', function($scope, $q, $state, $timeout, $ionicModal, $ionicLoading,$ionicHistory,
                                           $ionicPopup, $cordovaFacebook, $cordovaFile, $cordovaToast,
                                           $cordovaGeolocation, $localstorage, $cordovaGoogleAnalytics, $profile) {

        // GA
        $scope.$on('$ionicView.beforeEnter', function () {
            $cordovaGoogleAnalytics.trackView('Profile');
        });

        var updateCity = true;

        // All the actions to be taken when leaving the view
        // via menu, for $state.go('signin') we need to repeat the actions
        $scope.$on('$ionicView.beforeLeave', function(){
            // This to stop the city refresh spinner in case
            // it is running
            $scope.show = {
                icon: false
            };

            updateCity = false;
        });

        /***************
         * GENERAL PROFILE INFO
         */
        if ($localstorage.get('profilePhoto') == null || $localstorage.getObject('basicInfo') == null || $localstorage.getObject('myCity') == null) {

            alert('Profile info problems, need to deal with this case')

        } else {
            $scope.cities = $localstorage.getObject('cities');
            $scope.myCity = $localstorage.getObject('myCity');
            $scope.basicInfo = $localstorage.getObject('basicInfo');
            $scope.profilePhoto = $localstorage.get('profilePhoto');
        }

        /***************
         * CITY SELECTOR
         */

        $ionicModal.fromTemplateUrl('templates/cityModal.html', function (modal) {
            $scope.cityModalCtrl = modal;
        }, {
            scope: $scope
            //animation: 'slide-in-up',
            //focusFirstInput: true
        });

        $scope.rangeDisable = false;

        $scope.modalData = {msg: {value: $scope.cities[0].value}};

        $scope.data = {
            clientSide: $scope.cities[0].value
        };

        $scope.openModal = function () {
            $scope.cityModalCtrl.show();
        };

        $scope.cancelCityChange = function() {
            $scope.range = $localstorage.getObject('cityRange');
            $scope.cities = $localstorage.getObject('cities');
            $scope.myCity = $localstorage.getObject('myCity');
            $scope.data = {
                clientSide: $scope.myCity
            };
            $scope.modalData = {msg: {value: $scope.myCity}};
            $scope.clientSideList = $scope.cities;
            rangeInit = true;
            $scope.cityModalCtrl.hide();

        };

        $scope.hideModal = function () {
            $scope.cityModalCtrl.hide();
        };

        $scope.clientSideList = $scope.cities;

        $scope.doSomething = function (item) {
            $scope.modalData.msg = item;
            $localstorage.setObject('cityRange', $scope.range);
            $localstorage.setObject('myCity', $scope.modalData.msg.value);
            $localstorage.setObject('cities', $scope.cities);
            $scope.cityModalCtrl.hide();
        };

        $scope.show = {
            icon: false
        };

        $scope.recheckCities = function() {

            updateCity = true;

            $scope.show = {
                icon: true
            };

            $scope.rangeDisable = true;


            $profile.getCities($scope.range.km)
                .then(function (success) {

                    // This is a check to possibly abort the city recheck
                    // when view is abandoned before request is finished
                    // and modal is opened
                    if (updateCity) {

                        var cities = success;

                        $scope.cityModalCtrl.show();

                        $scope.myCity = cities[0];

                        $scope.cities = cities;
                        //$scope.cityInfoReady = true;
                        $scope.modalData = {msg: {value: cities[0].value}};
                        $scope.data = {
                            clientSide: cities[0].value
                        };
                        $scope.clientSideList = cities;


                        $scope.show = {
                            icon: false
                        };

                        $scope.rangeDisable = false;

                    }

                },
                function (error) {
                    $scope.show = {
                        icon: false
                    };
                    $scope.rangeDisable = false;
                    $cordovaToast.showLongBottom('Check that Internet and GPS are on.').then(function(success) {
                        // success
                    }, function (error) {
                        // error
                    });
                });

        };


        if ($localstorage.getObject('cityRange') == null) {
            $scope.range = { 'km' : '5' };
            $localstorage.setObject('cityRange', $scope.range);
        } else {
            $scope.range = $localstorage.getObject('cityRange');
            $scope.cities = $localstorage.getObject('cities');
            $scope.myCity = $localstorage.getObject('myCity');
            $scope.data = {
                clientSide: $scope.myCity
            };
            $scope.modalData = {msg: {value: $scope.myCity}};
            $scope.clientSideList = $scope.cities;
        }

        // Watch the range changes
        var rangeInit = true;
        var timeoutId = null;
        $scope.$watch('range.km', function() {

            if (rangeInit) {
                rangeInit = false;
                return;
            }

            if (timeoutId !== null) {
                return;
            }

            timeoutId = $timeout(function () {

                $scope.recheckCities();

                $timeout.cancel(timeoutId);
                timeoutId = null;

                // Now load data from server
            }, 3000);
        })

        //
        //});

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

                // This to stop the city refresh spinner in case
                // it is running
                $scope.show = {
                    icon: false
                };
                updateCity = false;

                // Clear all history
                $ionicHistory.clearHistory();
                // Clear all cache (except current view)
                $ionicHistory.clearCache();

                $state.go('signin');

            }, function (error) {
                // error
            })
        };


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
        var buttonBoxMarginTop = (screenHeight * 0.06);
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
        $scope.itemFontSize = (screenWidth * 0.042) + "px";
        $scope.categoryDividerFontSize = (screenWidth * 0.045) + "px";



        //CONTAINER
        $scope.contentMarginTop = -(screenHeight * 0.03) + "px";
        $scope.contentPaddingTop = (screenHeight * 0) + "px";


        //PROFILE INFO
        $scope.profileInfoTop = -(screenHeight * 0.1) + "px";
        $scope.profileNameMarginTop = (screenHeight * 0.01) + "px";

        $scope.imageWidth = (screenHeight * 0.19) + "px";
        $scope.imageHeight = (screenHeight * 0.19) + "px";
        $scope.imageBorderRadius = (screenHeight * 0.15) + "px";

        // SELECT CITY
        $scope.cityModalButtonWidth = (buttonBoxWidth - buttonHeight) + "px";
        $scope.cityModalRefreshButtonSize = (screenHeight * 0.07) + "px";
        $scope.cityModalMarginTop = -(screenHeight * 0.072) + "px";
        $scope.cityModalMarginLeft = (screenWidth * 0.784)  + "px";
        $scope.spinnerButtonHeight = (screenHeight * 0.0745) + "px";
        $scope.spinnerButtonWidth = (screenHeight * 0.08) + "px";


        $scope.textRangeWidth = (screenWidth * 0.3)  + "px";
        $scope.textRangeMarginLeft = (screenWidth * 0.007)  + "px";



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
        $scope.logoutButtonMarginTop = (screenHeight * 0.13) + "px";

    });