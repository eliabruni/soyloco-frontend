// Soyloco App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'soyloco' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'soyloco.services' is found in services.js
// 'soyloco.controllers' is found in controllers.js


angular.module('soyloco', ['ionic', 'openfb', 'soyloco.controllers', 'soyloco.geo','soyloco.map',
    'soyloco.services','soyloco.directives', 'soyloco.crawling', 'ionic.contrib.ui.cards',
    'LocalStorageModule', 'google-maps'])

    .run(function($rootScope, $state, $ionicPlatform, $window, OpenFB,
                  localStorageService, Geo) {



        $ionicPlatform.ready(function() {

            OpenFB.init('738982816123885');
            Geo.start();

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

/*
           $rootScope.$on('$stateChangeStart', function(event, toState) {
                if (toState.name !== "login" && toState.name !== "logout" &&
                    (localStorageService.get('fbtoken') === null) ) {
                    $state.go('login');
                    event.preventDefault();
                }
            });
*/

            $rootScope.$on('OAuthException', function() {
                $state.go('login');
            });

        });
    })

    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            })

            .state('logout', {
                url: "/logout",
                templateUrl: "templates/logout.html",
                controller: 'LogoutCtrl'
            })

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html",
                controller: "TabsCtrl"
            })

            // Each tab has its own nav history stack:

            .state('tab.category', {
                url: '/category',
                views: {
                    'tab-category': {
                        templateUrl: 'templates/tab-category.html',
                        controller: 'CategoryCtrl'
                    }
                }
            })

            .state('tab.profile', {
                url: '/profile',
                views: {
                    'tab-profile': {
                        templateUrl: 'templates/tab-profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })

            .state('tab.play', {
                url: '/play',
                views: {
                    'tab-play': {
                        templateUrl: 'templates/tab-play.html',
                        controller: 'PlayCtrl'
                    }
                }
            })

            .state('tab.invite', {
                url: '/invite',
                views: {
                    'tab-invite': {
                        templateUrl: 'templates/tab-invite.html',
                        controller: 'InviteCtrl'
                    }
                }
            })

            .state('tab.settings', {
                url: '/settings',
                views: {
                    'tab-settings': {
                        templateUrl: 'templates/tab-settings.html',
                        controller: 'SettingsCtrl'
                    }
                }
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/category');

    });

