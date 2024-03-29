angular.module('soyloco.controllers', [])

    .controller('TabsCtrl', function ($scope, $state, $ionicModal, OpenFB) {

        $scope.logout = function () {
            OpenFB.logout();
            $state.go('login');
        };

        $scope.revokePermissions = function () {
            OpenFB.revokePermissions().then(
                function () {
                    $state.go('login');
                },
                function () {
                    //alert('Revoke permissions failed');
                });
        };


        // This part for the invite/share modal on sidemenu
        $ionicModal.fromTemplateUrl('templates/tab-invite.html', function(modal) {
            $scope.modal = modal;
        }, {
            animation: 'slide-in-up',
            focusFirstInput: true
        });

        $scope.openModal = function() {
            $scope.modal.show()
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
        };


    })

/*************************************
 *          Login controller
 *
 * */
    .controller('LoginCtrl', function ($rootScope, $scope, $location, $state, $ionicSlideBoxDelegate,$timeout,
                                       $ionicLoading, OpenFB) {

        var numTaps = 0;

        $scope.facebookLogin = function () {

            // This is to avoid multiple tapping

            numTaps++;
            if (numTaps > 1) {
                return;
            }

            // Setup the loader
            $scope.show = $ionicLoading.show({
                template: '<i class="icon ion-loading-c facebook-login-loader"></i>',
                noBackdrop: 'true',
                duration: 5000
            });

            // TODO
            // This should deactivate button once pressed and hide back nav
            // NOT WORKING FOR NOW
            /*$ionicViewService.nextViewOptions({
             disableAnimate: true,
             disableBack: true
             });*/

            // Set a timeout to clear loader, however you would actually
            // call the $scope.loading.hide(); method whenever everything is ready or loaded.
            var timer = $timeout(function () {

                OpenFB.login('user_birthday,user_friends,user_events,user_photos,user_likes,friends_events').then(
                    function () {

                        $state.go('tab.category');

                    },

                    // TODO: Not capturing errors
                    function () {
                        // Reset numTaps to 0 so that the facebook login button can
                        // be tapped again
                        numTaps = 0;
                    });
                $ionicLoading.hide();
            }, 5000);

            // When the DOM element is removed from the page,
            // AngularJS will trigger the $destroy event on
            // the scope. This gives us a chance to cancel any
            // pending timer that we may have.
            $scope.$on(
                "$destroy",
                function(event) {
                    $timeout.cancel(timer);
                }
            );

        };

        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };

    })


/*************************************
 *          Category controller
 *
 * */
    .controller('CategoryCtrl', function($rootScope, $scope, $stateParams, $ionicSlideBoxDelegate, $ionicNavBarDelegate,
                                         $timeout, $cordovaToast, Crawler, Categories, GMap, Geo) {

        $scope.showMap = false;

        var mapViews = [{title: 'All'}, {title: 'Who you like'}, {title: 'Who likes you'}, {title: 'Matches'}];

        // By default we set it to 'Who you like'
        $scope.viewName = mapViews[0].title;

        if (!$rootScope.deviceReady) {

            // Wait for device API libraries to load
            document.addEventListener("deviceready", onDeviceReady, false);

            // device APIs are available
            function onDeviceReady() {
                $rootScope.deviceReady = true;
                if (Geo.isPositionAvailable()) {
                    displayMap();
                } else {
                    // TODO: raw hack to get the toast, find better way
                    $timeout(function () {
                        if (!Geo.isPositionAvailable()) {
                            $cordovaToast.show('GPS location not available', 'long', 'bottom');s
                            obscureMap();
                        }
                    }, 5000);

                }
            }
            // TODO: this condition is possibly unnecessary
        }/* else if (Geo.isPositionAvailable()) {
         displayMap();
         }*/

        $scope.Geo = Geo;

        $scope.$watch('Geo.isPositionAvailable()', function(status) {
            if (status && $rootScope.deviceReady) {
                displayMap();
            } else if (!status && $rootScope.deviceReady) {
                $cordovaToast.show('GPS location not available', 'long', 'bottom');
                obscureMap();
            }
        });


        function obscureMap() {
            $scope.showMap = false;
        }

        function displayMap() {

            GMap.getMap().then(function (map) {

                $ionicNavBarDelegate.align('left');

                // This set the actual category
                Categories.setCategoryIdx(0);
                $scope.category = Categories.getActualCategory();

                // Crwaling starts here becuse it's the fallback route.
                // If fallback route is changed, remeber to move Crawler.init().
                if (!Crawler.getInit()) {
                    //Crawler.init();
                }

                // Need to assign Map to watch its values
                $scope.GMap = GMap;
                $scope.map = map;


// SLIDER LOGIC

                $scope.slideIndex = 0;

// Called each time the slide changes
                $scope.slideChanged = function (index) {
                    $scope.slideIndex = index;
                };

                $scope.goToAll = function () {

                    // Recenter map
                    if($scope.slideIndex != 0) {
                        $scope.recenterDefault();
                    }

                    if ($scope.slideIndex == 1) {
                        $ionicSlideBoxDelegate.previous();
                    }
                    else if ($scope.slideIndex == 2) {
                        $ionicSlideBoxDelegate.previous();
                        $ionicSlideBoxDelegate.previous();
                    }
                    else if ($scope.slideIndex == 3) {
                        $ionicSlideBoxDelegate.previous();
                        $ionicSlideBoxDelegate.previous();
                        $ionicSlideBoxDelegate.previous();
                    }
                    $scope.slideIndex == 0;
                    $scope.viewName = mapViews[0].title;


                };

                $scope.goToWhoYouLike = function () {

                    // Recenter map
                    if($scope.slideIndex != 1) {
                        $scope.recenterDefault();
                    }

                    if ($scope.slideIndex == 0) {
                        $ionicSlideBoxDelegate.next();
                    }
                    else if ($scope.slideIndex == 2) {
                        $ionicSlideBoxDelegate.previous();
                    }
                    else if ($scope.slideIndex == 3) {
                        $ionicSlideBoxDelegate.previous();
                        $ionicSlideBoxDelegate.previous();
                    }
                    $scope.slideIndex == 1;
                    $scope.viewName = mapViews[1].title;

                };

                $scope.goToWhoLikesYou = function () {

                    // Recenter map
                    if($scope.slideIndex != 2) {
                        $scope.recenterDefault();
                    }

                    if ($scope.slideIndex == 0) {
                        $ionicSlideBoxDelegate.next();
                        $ionicSlideBoxDelegate.next();

                    }
                    else if ($scope.slideIndex == 1) {
                        $ionicSlideBoxDelegate.next();

                    }
                    else if ($scope.slideIndex == 3) {
                        $ionicSlideBoxDelegate.previous();
                    }
                    $scope.slideIndex == 2;
                    $scope.viewName = mapViews[2].title;

                };

                // Called each time the slide changes
                $scope.goToMatches = function () {

                    // Recenter map
                    if($scope.slideIndex != 3) {
                        $scope.recenterDefault();
                    }

                    if ($scope.slideIndex == 0) {
                        $ionicSlideBoxDelegate.next();
                        $ionicSlideBoxDelegate.next();
                        $ionicSlideBoxDelegate.next();

                    }
                    else if ($scope.slideIndex == 1) {
                        $ionicSlideBoxDelegate.next();
                        $ionicSlideBoxDelegate.next();
                    }
                    else if ($scope.slideIndex == 2) {
                        $ionicSlideBoxDelegate.next();
                    }
                    $scope.slideIndex == 3;
                    $scope.viewName = mapViews[3].title;


                };

                $timeout(function () {
                    $ionicSlideBoxDelegate.enableSlide(false);
                    $scope.goToWhoYouLike();
                }, 10);

                // Put the given place on top of the category list
                $scope.puOnTop = function(place) {

                    if ($scope.slideIndex == 0) {
                        $scope.category.myPlaces.splice($scope.category.myPlaces.indexOf(place), 1);
                        $scope.category.myPlaces.splice(0,0,place);
                        $scope.$apply();
                    }

                    if ($scope.slideIndex == 1) {
                        $scope.category.otherPlaces.splice($scope.category.otherPlaces.indexOf(place), 1);
                        $scope.category.otherPlaces.splice(0,0,place);
                        $scope.$apply();
                    }

                    else if ($scope.slideIndex == 2) {
                        $scope.category.myPlaces.splice($scope.category.myPlaces.indexOf(place), 1);
                        $scope.category.myPlaces.splice(0,0,place);
                        $scope.$apply();
                    }

                    else if ($scope.slideIndex == 3) {
                        $scope.category.otherPlaces.splice($scope.category.otherPlaces.indexOf(place), 1);
                        $scope.category.otherPlaces.splice(0,0,place);
                        $scope.$apply();
                    }
                }


                $scope.recenterDefault = function() {
                    $scope.map.center = GMap.getCenter();
                    $scope.map.zoom = GMap.getDefaultZoom();
                }

                // FUNCTIONS FOR MARKERS CLICKING
                var onMarkerClicked = function (marker) {

                    $scope.puOnTop(marker.place);
                    $scope.$apply();
                };

                _.each($scope.map.markersAll, function (marker) {
                    marker.onClicked = function () {
                        onMarkerClicked(marker);

                        //change marker (extract a function here)

                    };
                });

                _.each($scope.map.markersWhoYouLike, function (marker) {
                    marker.onClicked = function () {
                        onMarkerClicked(marker);

                        //change marker (extract a function here)

                    };
                });

                _.each($scope.map.markersWhoLikesYou, function (marker) {
                    marker.onClicked = function () {
                        onMarkerClicked(marker);
                    };
                });

                _.each($scope.map.markersMatches, function (marker) {
                    marker.onClicked = function () {
                        onMarkerClicked(marker);
                    };
                });


                if (GMap.getViewToReload()) {
                    location.reload();
                    GMap.setViewToReload(false);
                }

                if (!GMap.getViewToReload()) {
                    $scope.showMap = true;
                    $scope.loadingIndicator.hide()
                }
            })
        }
    })


    .controller('ProfileCtrl', function($scope, $q, OpenFB, GMap) {




        var method2 = function() {

            var places;

            var getAttendees = function(events){

                var promises = events.map(function(event) {

                    var deferred  = $q.defer();

                    OpenFB.get('/'+event.id+'/attending')
                        .success(function (data, status, headers, config) {
                            deferred.resolve(data['data']);
                        })
                        .error(function(error){
                            deferred.reject();
                        });

                    return deferred.promise;
                });

                return $q.all(promises);
            };


            var getEvents = function(places){

                //test
                var eventCounter = 0;
                var eventWitAttendeesCounter = 0;
                //test

                var promises = places.map(function(place) {

                    var deferred  = $q.defer();


                    OpenFB.get('/'+place.id+'/events')
                        .success(function (data, status, headers, config) {

                            var events = data['data'];

                            //test
                            if(events.length > 0) {
                                eventCounter++;
                                $scope.eventCounter = eventCounter;
                            }
                            //test

                            var eventPlusAttendees = [];
                            getAttendees(events).then(function(attendees) {

                                //test
                                if(events.length > 0 && attendees.length > 0) {
                                    var round = 0;

                                    for (idx in attendees) {
                                        alert(attendees[idx])
                                    }

                                    //test

                                    for (var eventIdx in events) {
                                        var event =  events[eventIdx];
                                        var eventAttendees = attendees[eventIdx];

                                        if (eventAttendees.length > 0 && round < 1) {
                                            eventWitAttendeesCounter++;
                                            $scope.eventWitAttendeesCounter = eventWitAttendeesCounter;
                                            //eventPlusAttendees.push({ 'event':event,'attendees':eventAttendees});
                                            round++;

                                        }

                                        eventPlusAttendees.push({ 'event':event,'attendees':eventAttendees});
                                    }
                                } else {
                                    eventPlusAttendees.push({});

                                }
                            })

                            deferred.resolve(eventPlusAttendees);
                        })
                        .error(function(error){
                            deferred.reject();
                        });

                    return deferred.promise;
                });

                return $q.all(promises);
            };

            // Call the $http method
            OpenFB.get('/search?q=*&type=place&center='+center.latitude+','+center.longitude+'&distance=1000')

                .success(function (data, status, headers, config) {
                    places = data['data'];
                    var placeWithEventsCount = 0;
                    getEvents(places).then(function(allEvents) {
                        for (var placeIdx in places) {
                            var round = 0;
                            $scope.placeIdx = placeIdx;

                            var placeEvents = allEvents[placeIdx];

                            for (var tmpIdx in placeEvents) {

                                var placeEvent = placeEvents[tmpIdx];


                                for (var tmpIdx2 in placeEvent) {

                                }


                            }




                        }
                        $scope.placeWithEventsCount = placeWithEventsCount;
                    })
                })

                .error(function (data, status, headers, config){
                    alert('error in searching')
                });
        }




        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////




        //var center = GMap.getCenter();
        var center = {latitude:40.67, longitude:-73.94};

        var method3 = function() {

            var places;

            var getAttendees = function(events){

                var promises = events.map(function(event) {

                    var deferred  = $q.defer();

                    OpenFB.get('/'+event.id+'/attending')
                        .success(function (data, status, headers, config) {
                            deferred.resolve(data['data']);
                        })
                        .error(function(error){
                            deferred.reject();
                        });

                    return deferred.promise;
                });

                return $q.all(promises);
            };


            var getEvents = function(places){

                //test
                var eventCounter = 0;
                var eventWitAttendeesCounter = 0;
                //test

                var promises = places.map(function(place) {

                    var deferred  = $q.defer();


                    OpenFB.get('/'+place.id+'/events?since=now&until=2014-07-17 ')
                        .success(function (data, status, headers, config) {

                            var events = data['data'];
                            deferred.resolve(events);
                        })
                        .error(function(error){
                            deferred.reject();
                        });

                    return deferred.promise;
                });

                return $q.all(promises);
            };


            var getQueryPlaces = function(queries){

                var promises = queries.map(function(query) {

                    var deferred  = $q.defer();

                    OpenFB.get('/search?q='+query+'&type=place&center='+center.latitude+','+center.longitude+'&distance=15000'+'&limit=5000')
                        .success(function (data, status, headers, config) {

                            places = data['data'];
                            deferred.resolve(places);
                        })
                        .error(function(error){
                            deferred.reject();
                        });

                    return deferred.promise;
                });

                return $q.all(promises);
            };

            var getUniquePlaces = function(places){
                var u = {}, a = [];
                for(var i = 0, l = places.length; i < l; ++i){
                    if(u.hasOwnProperty(places[i].id)) {
                        continue;
                    }
                    a.push(places[i]);
                    u[places[i].id] = 1;
                }
                return a;
            }

            var placeWithEventsCount = 0;
            var queries = ['bar','pub','club','theatre', 'restaurant',
                'show','performance','spectacle','exhibition','party','nightclub','coffee',
                'local','tavern','beer house', 'wine bar', 'nightlife', 'cinema', 'theatre',
                'entertainment', 'play', 'concert', 'music'];

            getQueryPlaces(queries).then(function(queryPlaces) {

                var places = [];
                for (var queryIdx in queries) {
                    var tmpPlaces = queryPlaces[queryIdx];

                    if (queryIdx == 0) {
                        places = tmpPlaces;
                    } else {
                        places = places.concat(tmpPlaces)
                        // Remove duplicate places
                        places = getUniquePlaces(places);
                    }
                }

                alert(places.length)

                getEvents(places).then(function(events) {
                    for (var placeIdx in places) {

                        $scope.placeIdx = placeIdx;

                        var placeEvents = events[placeIdx];

                        if (placeEvents.length > 0) {

                           /* for (var tmpIdx1 in placeEvents) {
                                var placeEvent = placeEvents[tmpIdx1];
                                for (var tmpIdx2 in placeEvent) {
                                    alert(tmpIdx2)
                                    alert(placeEvent[tmpIdx2])
                                }
                            }*/

                            placeWithEventsCount++;
                            $scope.placeWithEventsCount = placeWithEventsCount;

                           /* var event = placeEvents[0];
                            alert(event.name)
                            alert(event.id)*/

                        }
                    }
                })
            })



        }



        method3();
    })

/*************************************
 *          Play controller
 *
 * */
    .controller('PlayCtrl', function($rootScope, $scope, $timeout, $ionicSlideBoxDelegate,
                                     $ionicSwipeCardDelegate, $ionicSideMenuDelegate, Users) {


        var users;
        $ionicSideMenuDelegate.canDragContent(false);

        $rootScope.accepted = 0;
        $rootScope.rejected = 0;

        users = Users.all();
        $scope.cards = Array.prototype.slice.call(users, 0, 0);

        $scope.cardSwiped = function(index) {
            $scope.addCard(index);

        };

        $scope.cardDestroyed = function(index) {
            if (this.swipeCard.positive === true) {
                $scope.$root.accepted++;
            } else {
                $scope.$root.rejected++;
            }
            $scope.cards.splice(index, 1);
        };

        $scope.addCard = function(index) {
            var newCard = users[index];
            newCard.id = index;
            $scope.cards.push(angular.extend({}, newCard));
        }

        $scope.accept = function () {
            var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
            $rootScope.accepted++;
            card.swipe(true);
        }
        $scope.reject = function() {
            var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
            $rootScope.rejected++;
            card.swipe();
        };

        // Start with first card
        // TODO: put this into directive?
        var init = function () {
            $scope.addCard(0);
            $scope.addCard(1);
            $scope.addCard(2);
        };
        // and fire it after definition
        init();




        /*  // TODO: change the nonsense timeout. The problem is that without it, it doesn't work.
         $timeout(function () {
         $ionicSlideBoxDelegate.enableSlide(false);
         }, 0);

         //TODO: This is just a plcaeholder for a call to the server
         var timer = $timeout(function () {
         $ionicSlideBoxDelegate.next();
         //$ionicSlideBoxDelegate.enableSlide(false);

         }, 2000);

         // When the DOM element is removed from the page,
         // AngularJS will trigger the $destroy event on
         // the scope. This gives us a chance to cancel any
         // pending timer that we may have.
         $scope.$on(
         "$destroy",
         function(event) {
         $timeout.cancel(timer);
         }
         );


         var users = Users.all();


         $scope.nextUser = function(nextUserId) {

         $scope.userId = nextUserId;

         var photos = users[nextUserId-1].photos;
         $scope.cards = Array.prototype.slice.call(photos, 0, 0);
         $scope.userName = users[nextUserId-1].name;

         var photoIdx, photo;
         for (photoIdx in photos) {
         photo = photos[photoIdx];
         $scope.addUserCard(photo);
         }

         // Add first card again
         $scope.addUserCard(photos[0]);
         };


         $scope.addUserCard = function(userCard) {
         $scope.cards.push(angular.extend({}, userCard));
         };

         $scope.cardSwiped = function(index, userId) {

         $scope.userId = userId;

         // Index goes in decreasing order,
         // We need to update at one before last, i.e. index == 1
         if (index == 1) {
         $scope.nextUser(userId);
         }

         };

         $scope.cardDestroyed = function(index) {
         $scope.cards.splice(index, 1);
         };

         $scope.goAway = function(userId) {

         // This is just for infinite user loop
         if(userId == 3) {
         $scope.nextUser(1);
         } else {
         $scope.nextUser(userId + 1);
         }
         };

         // Start with first card
         // TODO: put this into directive?
         var init = function () {
         $scope.nextUser(1);
         };
         // and fire it after definition
         init();*/


    })

/*************************************
 *          Invite controller
 *
 * */
    .controller('InviteCtrl', function($scope, $cordovaSocialSharing) {


        alert('invite conrtolr')

        var message = "Chekcout Soyloco... it helps you finding facebook events with people who are " +
            "interested in you! www.soyloco.com/app";

        var image = "";

        $scope.testFunc = function() {
            alert('button pressed')
        }

        $scope.shareViaTwitter = function() {

            $scope.modal.hide();

            $cordovaSocialSharing.shareViaTwitter(message, image, link).then(function (result) {
                // Success!
                alert('sharing via twitter')
            }, function (err) {
                alert('error sharing via twitter')

                // An error occurred. Show a message to the user
            });
        }


        /*       $cordovaSocialSharing.shareViaWhatsApp(message, image, link).then(function(result) {
         // Success!
         }, function(err) {
         // An error occured. Show a message to the user
         });


         $cordovaSocialSharing.shareViaFacebook(message, image, link).then(function(result) {
         // Success!
         }, function(err) {
         // An error occured. Show a message to the user
         });

         // access multiple numbers in a string like: '0612345678,0687654321'
         $cordovaSocialSharing.shareViaSMS(message, number).then(function(result) {
         // Success!
         }, function(err) {
         // An error occured. Show a message to the user
         });

         // TO, CC, BCC must be an array, Files
























         can be either null, string or array
         $cordovaSocialSharing.shareViaEmail(message, subject, toArr, bccArr, file).then(
         function(result) {
         // Success!
         }, function(err) {
         // An error occured. Show a message to the user
         });*/

    })


/*************************************
 *          Logout controller
 *
 * */
    .controller('SettingsCtrl', function($scope, $state, OpenFB, Crawler) {

        $scope.logout = function () {
            OpenFB.logout();
            Crawler.stop();
            Crawler.setInit(false);
            $state.go('login');
        };
    });
