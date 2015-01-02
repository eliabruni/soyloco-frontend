// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('splash',
    [
      'ionic',


      'splash.signin.ctrl',
      'splash.tabAccount.ctrl',
      'splash.tabPlay.ctrl',

      'splash.controllers',
      'ionic.contrib.ui.cards',
      'ionic.contrib.ui.cards2',
      'splash.services',
      'splash.directives',
      'splash.storage',
      'splash.geo',
      'splash.crawling',
      'splash.users',
      'ngCordova',
      'splash.events'
    ])

    .run(function($ionicPlatform) {
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


    .config(function($stateProvider, $urlRouterProvider, $cordovaFacebookProvider) {

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
          .state('tab.chats', {
            url: '/chats',
            views: {
              'tab-chats': {
                templateUrl: 'templates/tab-chats.html',
                controller: 'ChatsCtrl'
              }
            }
          })
          .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
              'tab-chats': {
                templateUrl: 'templates/chat-detail.html',
                controller: 'ChatDetailCtrl'
              }
            }
          })

          .state('tab.events', {
            url: '/events',
            views: {
              'tab-events': {
                templateUrl: 'templates/tab-events.html',
                controller: 'EventsCtrl'
              }
            }
          })
          .state('tab.event-detail', {
            url: '/event/:eventId',
            views: {
              'tab-events': {
                templateUrl: 'templates/event-detail.html',
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

          .state('tab.select-categories', {
            url: '/select-categories',
            views: {
              'tab-account': {
                templateUrl: 'templates/select-categories.html',
                controller: 'SelectCategoriesCtrl'
              }
            }
          })

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/signin');

    })