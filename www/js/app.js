// Ionic Splash App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('splash',
    [
        'ionic',
        'ngCordova',

        'splash.signin.ctrl',
        'splash.tabAccount.ctrl',
        'splash.tabPlay.ctrl',
        'splash.tabEvents.ctrl',
        'splash.selectCategories.ctrl',
        'splash.eventDetail.ctrl',
        'splash.directives',
        'splash.storage',
        'splash.geo',
        'splash.crawling',
        'splash.users',
        'splash.events',
        'splash.profile',

        'ionic.contrib.ui.cards'
    ])

    .run(function($rootScope, $state, $ionicPlatform, $localstorage) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        if($localstorage.getObject('fbToken') != null) {
            $rootScope.appInitialized = true;
            $state.go('tab.play');

        }
        else if ($localstorage.getObject('fbToken') == null) {
            $rootScope.appInitialized = false;
            $state.go('signin');

        }

    })


    .config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider, $cordovaFacebookProvider) {

        // note that you can also chain conf
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.views.transition('none');
        $ionicConfigProvider.backButton.icon('ion-arrow-left-c');

        // This block is only for web debugging
        if (!window.cordova) {
            var appID = 738982816123885;
            var version = "v2.0"; // or leave blank and default is v2.0
            $cordovaFacebookProvider.setAppID(appID, version);
        }

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('signin', {
                url: '/signin',
                templateUrl: 'templates/signin.html',
                controller: 'SigninCtrl'
            })

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            .state('tab.play', {
                url: '/play',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-play.html',
                        controller: 'TabPlayCtrl'
                    }
                }
            })

            .state('tab.events', {
                url: '/events',
                views: {
                    'tab-events': {
                        templateUrl: 'templates/tab-events.html',
                        controller: 'TabEventsCtrl'
                    }
                }
            })
            .state('tab.eventDetail', {
                url: '/event/:eventId',
                views: {
                    'tab-events': {
                        templateUrl: 'templates/eventDetail.html',
                        controller: 'EventDetailCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'TabAccountCtrl'
                    }
                }
            })

            .state('tab.selectCategories', {
                url: '/selectCategories',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/selectCategories.html',
                        controller: 'SelectCategoriesCtrl'
                    }
                }
            })

        //// if none of the above states are matched, use this as the fallback
        //$urlRouterProvider.otherwise('/signin');

    })