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

    .controller('TestCtrl', function($scope, $ionicLoading, $cordovaFacebook, $http, localStorageService, $base64) {

        if(localStorageService.get('fbProfilePicture') != null) {

            $scope.fbProfilePicture = localStorageService.get('fbProfilePicture');
            //$scope.fbProfilePicture = $scope.image = "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

        } else {


            $cordovaFacebook.api("me/picture?redirect=0&height=400&type=normal&width=400", ["public_profile"])
                .then(function (success) {
                    $scope.foto = success.data;

                    // Simple GET request example :
                    $http.get("http://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg").
                        success(function(data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available
                            //success is the image binary,encoding it to base64 and bound to it
                            alert('before base 64')

                            alert(data)
                            var fbProfilePicture = fileToBase64(data);
                            //var fbProfilePicture =  $base64.encode('test');
                            alert('after base 64')

                            $scope.fbProfilePicture =fbProfilePicture;
                            alert(fbProfilePicture);
                            localStorageService.put('fbProfilePicture', fbProfilePicture);


                            // TODO: IMPORTANT: since the line below works, and this is base64 binary format into a string, try to stringify profile pix, with and without base 64.
                            //localStorageService.set('fbProfilePicture', "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==");
                        }).
                        error(function(data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        });

                   /* //the response hold the url of the profile picutre..trying to download it
                    $http.get(foto.url).success(function(imageSuccess)
                    {

                        //success is the image binary,encoding it to base64 and bound to it
                        var fbProfilePicture = imageSuccess;
                        $scope.fbProfilePicture = fbProfilePicture;
                        localStorageService.add('fbProfilePicture', fbProfilePicture);

                    })*/


                }, function (error) {
                    alert('error')

                    console.log(error);
                });



       }

        var base64Encode = function(/*str*/s)
//--------------------------------------
        {
            var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

            var n = s.length,
                a = [], z = 0, c = 0,
                b, b0, b1, b2;

            while( c < n )
            {
                b0 = s.charCodeAt(c++);
                b1 = s.charCodeAt(c++);
                b2 = s.charCodeAt(c++);

                var b = (b0 << 16) + ((b1 || 0) << 8) + (b2 || 0);

                a[z++] = ALPHA.charAt((b & (63 << 18)) >> 18);
                a[z++] = ALPHA.charAt((b & (63 << 12)) >> 12);
                a[z++] = ALPHA.charAt(isNaN(b1) ? 64 : ((b & (63 << 6)) >> 6));
                a[z++] = ALPHA.charAt(isNaN(b2) ? 64 : (b & 63));
            }

            s = a.join('');
            a.length = 0;
            a = null;
            return s;
        };

        var fileToBase64 = function(/*File|str*/f)
//--------------------------------------
        {
            var s = null;

            if( f && (f = new File(f)) && (f.encoding='BINARY') && f.open('r') )
            {
                s = f.read();
                f.close();
            }

            return s && base64Encode(s);
        };

// Client code
// ---




    })


    .controller('CardsCtrl', function($scope, TDCardDelegate, $ionicSideMenuDelegate, Users, Crawler) {

        // Crwaling starts here becuse it's the fallback route.
        // If fallback route is changed, remeber to move Crawler.init().
        if (!Crawler.getInit()) {
            //Crawler.init();
        }


        $ionicSideMenuDelegate.canDragContent(false);

        console.log('CARDS CTRL');

        var cardTypes = Users.all();

        $scope.cards = Array.prototype.slice.call(cardTypes, 0);

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        };

        $scope.addCard = function() {
            var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));
        }

        $scope.cardSwipedLeft = function(index) {
            console.log('LEFT SWIPE');
            $scope.addCard();
        };
        $scope.cardSwipedRight = function(index) {
            console.log('RIGHT SWIPE');
            $scope.addCard();
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