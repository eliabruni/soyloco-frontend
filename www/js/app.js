// Ionic Splash App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
<<<<<<< HEAD
angular.module('splash',
    [
      'ionic',

      'splash.signin.ctrl',
      'splash.tabAccount.ctrl',
      'splash.tabPlay.ctrl',
      'splash.tabEvents.ctrl',
      'splash.selectCategories.ctrl',
      'splash.eventDetail.ctrl',

      'ionic.contrib.ui.cards',
      'ionic.contrib.ui.cards2',
      'splash.directives',
      'splash.storage',
      'splash.geo',
      'splash.crawling',
      'splash.users',
      'ngCordova',
      'splash.events',
      'splash.profile'
    ])

    .run(function($rootScope, $ionicPlatform, $ionicLoading, $profile) {
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
    })

=======
// 'soyloco.services' is found in services.js
// 'soyloco.controllers' is found in controllers.js


angular.module('soyloco', ['ionic', 'openfb', 'ngCordova', 'soyloco.controllers', 'soyloco.geo','soyloco.map',
    'soyloco.services','soyloco.directives', 'soyloco.crawling', 'ionic.contrib.ui.cards',
    'LocalStorageModule', 'google-maps'])

    .run(function($rootScope, $state, $ionicPlatform, $window, OpenFB,
                  localStorageService, Geo) {



        $ionicPlatform.ready(function() {

            OpenFB.init('738982816123885');
            Geo.start();
>>>>>>> nightly

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

<<<<<<< HEAD
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/signin');
=======
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
                    'menuContent': {
                        templateUrl: 'templates/tab-category.html',
                        controller: 'CategoryCtrl'
                    }
                }
            })

            .state('tab.profile', {
                url: '/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/tab-profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })

            .state('tab.play', {
                url: '/play',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/tab-play.html',
                        controller: 'PlayCtrl'
                    }
                }
            })

            .state('tab.invite', {
                url: '/invite',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/tab-invite.html',
                        controller: 'InviteCtrl'
                    }
                }
            })

            .state('tab.settings', {
                url: '/settings',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/tab-settings.html',
                        controller: 'SettingsCtrl'
                    }
                }
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/category');

    });
>>>>>>> nightly

    })