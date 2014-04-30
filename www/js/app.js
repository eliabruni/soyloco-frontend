angular.module('soyloco', ['ionic', 'openfb', 'soyloco.controllers',
    'soyloco.services','soyloco.directives', 'ionic.contrib.ui.cards',
    'LocalStorageModule', 'google-maps'])

    .run(function ($rootScope, $state, $ionicPlatform, $window, OpenFB, localStorageService) {

        OpenFB.init('738982816123885');

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name !== "app.login" && toState.name !== "app.logout" &&
                (localStorageService.get('fbtoken') === null) ) {
                $state.go('app.login');
                event.preventDefault();
            }
        });

        $rootScope.$on('OAuthException', function() {
            $state.go('app.login');
        });


    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: "AppCtrl"
            })

            .state('app.login', {
                url: "/login",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login.html",
                        controller: "LoginCtrl"
                    }
                }
            })

            .state('app.logout', {
                url: "/logout",
                views: {
                    'menuContent': {
                        templateUrl: "templates/logout.html",
                        controller: "LogoutCtrl"
                    }
                }
            })

            .state('app.profile', {
                url: "/profile",
                views: {
                    'menuContent': {
                        templateUrl: "templates/profile.html",
                        controller: "ProfileCtrl"
                    }
                }
            })

            .state('app.categories', {
                url: "/categories",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/categories.html",
                        controller: 'CategoriesCtrl'
                    }
                }
            })

            .state('app.category', {
                url: "/categories/:categoryId",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/category.html",
                        controller: 'CategoryCtrl'
                    }
                }
            })

            .state('app.play', {
                url: "/play",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/play.html",
                        controller: 'PlayCtrl'
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
            });

        // fallback route
        $urlRouterProvider.otherwise('/app/play');

    });

