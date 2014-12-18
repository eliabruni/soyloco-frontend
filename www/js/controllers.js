angular.module('soyloco.controllers', [])

    .controller('LoginCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal, $state, $cordovaFacebook) {

        $ionicSideMenuDelegate.canDragContent(false);

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        })

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {

            $cordovaFacebook.getAccessToken()
                .then(function (success) {

                    // success
                    $state.go('app.swipe')
                }, function (error) {

                    // error
                    $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                        .then(function(success) {

                            //success
                            $state.go('app.swipe')

                        }, function (error) {
                            // error
                            $state.go('app.login')
                        });
                });
        }
    })

    .controller('TestCtrl', function($scope, $ionicLoading, $cordovaFacebook, $cordovaFile) {

        // TODO: generalize file system management as explained here: http://forum.ionicframework.com/t/how-to-write-data-to-a-file-using-ngcordova/10943/7

        $cordovaFacebook.api("me/picture?redirect=0&height=400&type=normal&width=400", ["public_profile"])
            .then(function (success) {
                var photo = success.data;
                var fileTransferDir = cordova.file.externalDataDirectory;

                var hostPath = photo.url;
                var clientPath = fileTransferDir + 'test.jpg';
                var fileTransferOptions = {};

                $cordovaFile.downloadFile(hostPath, clientPath, true, fileTransferOptions).then (function(result) {
                    // Success!
                    alert('image saved')
                    $scope.downloadedPhoto = clientPath;
                }, function(err) {
                    // Error
                    alert(err)
                }, function (progress) {
                    // constant progress updates
                });

            }, function (error) {
                alert('error')

                console.log(error);
            });

    })


    .controller('CardsCtrl', function($scope, TDCardDelegate, $ionicSideMenuDelegate, Users, Crawler) {


        // TODO:
        // 1) Recover left/right logic values which need to be assigned the the swiped cards;

        // Crwaling starts here becuse it's the fallback route.
        // If fallback route is changed, remeber to move Crawler.init().
        if (!Crawler.getInit()) {
            //Crawler.init();
        }


        $ionicSideMenuDelegate.canDragContent(false);

        console.log('CARDS CTRL');

        var initCardTypes = Users.initUsers();
        var cardTypes = Users.users();


        $scope.cards = Array.prototype.slice.call(initCardTypes, 0);

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
            $scope.addCard();
        };

        $scope.addCard = function() {

            // TODO: need a counter for destroyed images connected to service
            var idx = Users.nextCardIdx();
            var newCard = cardTypes[idx];
            newCard.id = Math.random();
            $scope.cards.unshift(angular.extend({}, newCard));
        }

        $scope.cardSwipedLeft = function(index) {
            console.log('LEFT SWIPE');
        };
        $scope.cardSwipedRight = function(index) {
            console.log('RIGHT SWIPE');
        };

    })


    .controller('EventsCtrl', function($scope) {

        $scope.items = [
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'},
            {id: 1, name: 'Workshop photography', date: 'DIC 14', image: 'img/workshop_photography.jpg'}
        ];
    })

    .controller('SettingsCtrl', function($scope, $state, $cordovaFacebook, Crawler) {

        $scope.doLogout = function() {

            $cordovaFacebook.logout()
                .then(function(success) {
                    // success
                    Crawler.stop();
                    Crawler.setInit(false);
                    $state.go('app.login')
                }, function (error) {
                    // error
                });
        }

    });