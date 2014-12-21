// Ionic Soyloco App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('soyloco',
    [
        'ionic',
        'soyloco.controllers',
        'soyloco.directives',
        'soyloco.services',
        'soyloco.crawling',
        'soyloco.storage',
        'soyloco.utils',
        'ngCordova',
        'ionic.contrib.ui.tinderCards'
    ])

    .run(function($ionicPlatform, Users) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }


        });
    })

 /*   .config(['$compileProvider', function($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);
    }])*/

    .config(function($stateProvider, $urlRouterProvider, $cordovaFacebookProvider) {

        // This block is only for web debugging
        if (!window.cordova) {
            var appID = 738982816123885;
            var version = "v2.0"; // or leave blank and default is v2.0
            $cordovaFacebookProvider.setAppID(appID, version);
        }
        //

        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'LoginCtrl'
            })

            .state('app.login', {
                url: "/login",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/login.html",
                        controller: 'LoginCtrl'
                    }
                }
            })

            .state('app.swipe', {
                url: "/swipe",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/swipe.html",
                        controller: 'CardsCtrl'
                    }
                }
            })

            .state('app.events', {
                url: "/events",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/events.html",
                        controller: 'EventsCtrl'
                    }
                }
            })

            .state('app.settings', {
                url: "/settings",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/settings.html",
                        controller: 'SettingsCtrl'
                    }
                }
            })

            .state('app.test', {
                url: "/test",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/test.html",
                        controller: 'TestCtrl'
                    }
                }
            })


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/login');
    })




