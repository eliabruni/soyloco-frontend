angular.module('soyloco.services', [])


/**********************************************************
 *                  MENU UTILITY
 *
 * ********************************************************/
    .factory('MenuService', function() {
        var isEnabled = true;

        return {
            isEnabled:isEnabled
        }
    })

/**********************************************************
 *                  STORAGE UTILITY
 *
 * ********************************************************/
    .factory('StorageUtility', function(){

        // If data only got one-dimensional objects
        function getOneDimDifferences(oldObj, newObj) {
            var diff = {};

            for (var k in oldObj) {
                if (!(k in newObj))
                    diff[k] = undefined;  // property gone so explicitly set it undefined
                else if (oldObj[k] !== newObj[k])

                    diff[k] = newObj[k];  // property in both but has changed
            }

            for (k in newObj) {
                if (!(k in oldObj))

                    diff[k] = newObj[k]; // property is new
            }

            return diff;
        }

        // For nested objects
        function getMultipleDimDifferences(oldObj, newObj) {
            var diff = {};

            for (var k in oldObj) {
                if (!(k in newObj)) {
                    diff[k] = undefined;  // property gone so explicitly set it undefined
                }
                else if (!angular.equals(oldObj[k],newObj[k])) {
                    diff[k] = newObj[k];  // property in both but has changed
                }
            }

            for (k in newObj) {
                if (!(k in oldObj)) {
                    diff[k] = newObj[k]; // property is new
                }
            }

            return diff;
        }


        return {
            getOneDimDifferences: getOneDimDifferences,
            getMultipleDimDifferences: getMultipleDimDifferences
        }

    })


/**********************************************************
 *              FACEBOOK CRAWLER LAUNCHER
 *
 * ********************************************************/
    .factory('Crawler', function($window, OpenFB, FacebookCrawler, localStorageService) {

        var isInit = false;
        var testing = false;

        function init() {
            FacebookCrawler.startCrawling();

            /* if(localStorageService.get('longTermToken') == null) {
             alert('inside long term token retrieval');
             // Get short term access token
             var shortTermAccessToken = $window.sessionStorage['fbtoken'];
             var fbAppId = OpenFB.fbAppId;
             var appSecret = '40c575798636fc3332d90dc8b2d41aa5';
             var longTermToken = OpenFB.get('/oauth/access_token?grant_type=fb_exchange_token' + '&client_id=' + fbAppId + '&client_secret=' + appSecret + '&fb_exchange_token=' + fbAppId);

             localStorageService.add('longTermToken', longTermToken);
             alert(longTermToken)
             } else{
             var longTermToken = localStorageService.get('longTermToken');
             alert(longTermToken);
             var idx, token;
             for (idx in longTermToken) {
             var longToken = longTermToken[idx];
             alert(longToken);
             }
             }*/

            // TODO: Shouldn't we add other listeners for the crawling, such as device not ready, etc?
            document.addEventListener("online", onOnline, false);
            document.addEventListener("offline", onOffline, false);
            isInit = true;
        }

        function stop() {
            FacebookCrawler.stopCrawling();
        }

        function onOnline() {
            if (localStorageService.get('fbtoken') != null) {
                if (testing) {
                    alert('online');
                }

                FacebookCrawler.startCrawling();
            }
        }

        function onOffline() {
            if (testing) {
                alert('offline');
            }
            FacebookCrawler.stopCrawling();
        }

        function getInit() {
            return isInit;
        }

        function setInit(status) {
            isInit = status;
        }

        return {
            init: init,
            stop: stop,
            getInit: getInit,
            setInit: setInit
        }

    })




/**********************************************************
 *              FACEBOOK CRAWLING API SERVICE
 *
 * ********************************************************/
    .factory('FacebookCrawler', function( $interval, OpenFB, localStorageService, StorageUtility) {

        var defaultCrawlingTime = 5000; // Crawl each 5 minutes
        var done;

        // If defined, crawling is active and vice versa.
        var stop;

        // TESTING
        var testing = false;
        var counter = 0;
        // TESTING

        function startCrawling () {

            // We first stop any possible previous instance of startCrawling().
            // Note that this is different from the done<5 check, since it's done
            // just when startCrawling is called but not at the ith interval instance.
            stopCrawling();

            stop = $interval(function() {

                // Don't start a new crawling if we are already crawling
                if (done < 5) return;

                done = 0;

                //counter++;
                //localStorageService.add('counter', counter);

                // TESTING
                if(testing) {
                    counter++;
                    alert('Start crawling iteration number ' + counter);
                    localStorageService.add('counter', counter);
                }
                // TESTING


                /*************************************
                 *    Get user basic profile info: GO
                 * */

                // Retrieve etag for this api call. If it's the first time, it will be null
                var userEtag = localStorageService.get('userEtag');

                // Prepare the headers to be passed to the $http method
                var userHeaders = {'if-none-match': userEtag};

                // Call the $http method
                OpenFB.getWithHeaders('/me', userHeaders)

                    // Note that we have to take care os the sucess case only. If the ETag
                    // hasn't modified, an error is raised and a status===304 is returned.
                    .success(function (data, status, headers, config) {

                        var userFbInfo = {
                            // This user ID
                            id: data['id'],
                            // The user's first name
                            firstName: data['first_name'],
                            // This person's birthday in the format MM/DD/YYYY.
                            birthday : data['birthday'],
                            // The gender pronoun selected by this person.
                            // This is omitted if that pronoun is a custom value.
                            gender: data['gender']
                        };

                        if(localStorageService.get('userFbInfo') == null) {
                            localStorageService.add('userFbInfo', userFbInfo);
                        } else {

                            var diff = StorageUtility.getOneDimDifferences(localStorageService.get('userFbInfo'), userFbInfo);
                            if (!isEmpty(diff)) {
                                localStorageService.add('userFbInfo', userFbInfo);

                                // TODO: Send diff to server
                            }
                        }

                        // Get new etag
                        var userEtag = headers(['etag']);
                        localStorageService.add('userEtag', userEtag);

                        checkIfDone('User profile info retrieved!');

                    })

                    .error(function (data, status, headers, config){

                        if (status === 304) {
                            checkIfDone('304 in user basic info!');
                        }

                    });


                /*************************************
                 *    Get user profile pictures
                 *
                 *    It works, we store the image object vector (still to be parsed).
                 *    Facebook seems to give different etags every time here.
                 *
                 * */


                    // Call the $http method
                OpenFB.get('/me/albums')

                    // Note that we have to take care os the sucess case only. If the ETag
                    // hasn't modified, an error is raised and a status===304 is returned.
                    .success(function (data, status, headers, config) {

                        var outIndex, albums, albumIndex, album, profileAlbumId;
                        for (outIndex in data) {
                            albums = data[outIndex];
                            for (albumIndex in albums) {
                                album = albums[albumIndex];
                                if (album['type'] == 'profile') {
                                    profileAlbumId = album['id'];
                                }
                            }
                        }

                        // Retrieve etag for this api call. If it's the first time, it will be null
                        var userProfileAlbumEtag = localStorageService.get('userProfileAlbumEtag');

                        // Prepare the headers to be passed to the $http method
                        var userProfileAlbumHeaders = {'if-none-match': userProfileAlbumEtag};


                        OpenFB.getWithHeaders('/' + profileAlbumId + '/photos', userProfileAlbumHeaders)

                            .success(function (data, status, headers, config) {

                                var photos = data['data'];

                                // TODO: Preallocation?	Be careful, it might cause bugs
                                // Photos array
                                var userProfilePhotos = [];

                                var photoIdx, photo;
                                for (photoIdx in photos) {
                                    photo = photos[photoIdx];
                                    // Store ith photo into photoArray
                                    userProfilePhotos.push({
                                        // The photo ID
                                        id: photo['id'],
                                        // Link to the image source of the photo
                                        source: photo['source']
                                    });
                                }

                                // Note that we have to stringify and parse userProfilePhotos
                                if (localStorageService.get('userProfilePhotos') == null) {
                                    localStorageService.add('userProfilePhotos', userProfilePhotos);

                                } else {
                                    var diff = StorageUtility.getMultipleDimDifferences(localStorageService.get('userProfilePhotos'), userProfilePhotos);
                                    if (!isEmpty(diff)) {
                                        localStorageService.add('userProfilePhotos', userProfilePhotos);

                                        // TODO: Send diff to server
                                    }

                                }

                                // Get new etag
                                var userProfileAlbumEtag = headers(['etag']);
                                localStorageService.add('userProfileAlbumEtag', userProfileAlbumEtag);

                                checkIfDone('User photos retrieved!');

                            })

                            .error(function (data, status, headers, config){
                                if (status === 304) {
                                    checkIfDone('304 in user album pix!');
                                }
                            })

                    });



                /*************************************
                 *    Get user friends:
                 * */

                // Retrieve etag for this api call. If it's the first time, it will be null
                var userFriendsEtag = localStorageService.get('userFriendsEtag');

                // Prepare the headers to be passed to the $http method
                var userFriendsHeaders = {'if-none-match': userFriendsEtag};

                // Call the $http method
                OpenFB.getWithHeaders('/me/friends', userFriendsHeaders)

                    // Note that we have to take care os the sucess case only. If the ETag
                    // hasn't modified, an error is raised and a status===304 is returned.
                    .success(function (data, status, headers, config) {

                        var friends = data['data'];

                        // TODO: Preallocation?	Be careful, it might cause bugs
                        // Friends array
                        var userFriends = [];

                        var friendIdx, friend;
                        for (friendIdx in friends) {
                            friend = friends[friendIdx];
                            // Two only accessible fileds: 'id' and 'name'

                            // Store ith friend into friends array
                            userFriends.push({
                                // The friend ID
                                id: friend['id'],
                                // The person's  name
                                firstName: friend['name']
                            });
                        }

                        // Note that we have to stringify and parse userProfilePhotos
                        if(localStorageService.get('userFriends') == null) {
                            localStorageService.add('userFriends', userFriends);

                        } else {
                            var diff = StorageUtility.getMultipleDimDifferences(localStorageService.get('userFriends'), userFriends);
                            if (!isEmpty(diff)) {
                                localStorageService.add('userFriends', userFriends);

                                // TODO: Send diff to server
                            }
                        }

                        // Get new etag
                        var userFriendsEtag = headers(['etag']);
                        localStorageService.add('userFriendsEtag', userFriendsEtag);

                        checkIfDone('User friends retrieved!');
                    })

                    .error(function (data, status, headers, config){
                        if (status === 304) {
                            checkIfDone('304 in user friends!');
                        }

                    });


                /*************************************
                 *    Get user likes:
                 * */

                // Retrieve etag for this api call. If it's the first time, it will be null
                var userLikesEtag = localStorageService.get('userLikesEtag');

                // Prepare the headers to be passed to the $http method
                var userLikesHeaders = {'if-none-match': userLikesEtag};

                // Call the $http method
                OpenFB.getWithHeaders('/me/likes', userLikesHeaders)

                    // Note that we have to take care os the sucess case only. If the ETag
                    // hasn't modified, an error is raised and a status===304 is returned.
                    .success(function (data, status, headers, config) {

                        var likes = data['data'];

                        // TODO: Preallocation?	Be careful, it might cause bugs
                        // Friends array
                        var userLikes = [];

                        var likeIdx, like;
                        for (likeIdx in likes) {
                            like = likes[likeIdx];

                            // Two only accessible fileds: 'id' and 'name'
                            // Store ith friend into friends array
                            userLikes.push({
                                // The friend ID
                                id: like['id']
                            });
                        }

                        // Note that we have to stringify and parse userProfilePhotos
                        if(localStorageService.get('userLikes') == null) {
                            localStorageService.add('userLikes', userLikes);

                        } else {
                            var diff = StorageUtility.getMultipleDimDifferences(localStorageService.get('userLikes'), userLikes);
                            if (!isEmpty(diff)) {
                                localStorageService.add('userLikes', userLikes);

                                // TODO: Send diff to server
                            }

                        }

                        // Get new etag
                        var userLikesEtag = headers(['etag']);
                        localStorageService.add('userLikesEtag', userLikesEtag);

                        checkIfDone('User likes retrieved!');
                    })

                    .error(function (data, status, headers, config){

                        if (status === 304) {
                            checkIfDone('304 in user likes!');
                        }

                    });


                /*************************************
                 *    Get user events
                 *
                 *    It works.
                 *    Facebook seems to give different etags every time here.
                 * */

                // Retrieve etag for this api call. If it's the first time, it will be null
                var userEventsEtag = localStorageService.get('userEventsEtag');

                // Prepare the headers to be passed to the $http method
                var userEventsHeaders = {'if-none-match': userEventsEtag};

                // Call the $http method
                OpenFB.getWithHeaders('/me/events', userEventsHeaders)

                    // Note that we have to take care os the sucess case only. If the ETag
                    // hasn't modified, an error is raised and a status===304 is returned.
                    .success(function (data, status, headers, config) {

                        var events = data['data'];

                        // TODO: Preallocation?	Be careful, it might cause bugs
                        // Friends array
                        var userEvents = [];

                        var eventIdx, event;
                        for (eventIdx in events) {
                            event = events[eventIdx];

                            // Store ith friend into friends array
                            userEvents.push({
                                // The friend ID
                                id: event['id'],
                                name: event['name'],
                                startTime : event['start_time'],
                                endTime : event['end_time'],
                                location: event['location']
                            });
                        }

                        // Note that we have to stringify and parse userProfilePhotos
                        if(localStorageService.get('userEvents') == null) {
                            localStorageService.add('userEvents', userEvents);

                        } else {
                            var diff = StorageUtility.getMultipleDimDifferences(localStorageService.get('userEvents'), userEvents);
                            if (!isEmpty(diff)) {
                                localStorageService.add('userEvents', userEvents);

                                // TODO: Send diff to server
                            }
                        }

                        // Get new etag
                        var userEventsEtag = headers(['etag']);
                        localStorageService.add('userEventsEtag', userEventsEtag);

                        checkIfDone('User events retrieved!');
                    })

                    .error(function (data, status, headers, config){

                        if (status === 304) {
                            checkIfDone('304 in user events!');
                        }

                    });

            }, defaultCrawlingTime);


            /***********************************************
             *               HELPER FUNCTIONS              *
             ***********************************************/

                // Crawling jobs counter
            function checkIfDone(functionThatCalled) {
                if(testing) {
                    alert(functionThatCalled);
                }
                done++;
            }

            // Check if an object is empty
            function isEmpty(obj) {
                for(var prop in obj) {
                    if(obj.hasOwnProperty(prop))
                        return false;
                }

                return true;
            }

        }

        /*************************************
         *
         *   This function stops the crawling
         *
         * */
        function stopCrawling() {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
                done = 5;
                if(testing) {
                    alert('Crawling stopped!')
                }
            }
        };

        return {
            startCrawling: startCrawling,
            stopCrawling: stopCrawling
        }

    })


    .factory('LocationService', function($q) {

        var latLong = null;

        var getLatLong = function(refresh) {

            var deferred = $q.defer();

            if( latLong === null || refresh ) {

                console.log('Getting lat long');
                navigator.geolocation.getCurrentPosition(function(pos) {
                    console.log('Position=')
                    console.log(pos);
                    latLong =  { 'lat' : pos.coords.latitude, 'long' : pos.coords.longitude }
                    deferred.resolve(latLong);

                }, function(error) {
                    console.log('Got error!');
                    console.log(error);
                    latLong = null

                    deferred.reject('Failed to Get Lat Long')

                });

            }  else {
                deferred.resolve(latLong);
            }

            return deferred.promise;

        };

        return {

            getLatLong : getLatLong

        }
    })

/**
 * A simple example service that returns some categories.
 */
    .factory('Categories', function() {
        // Might use a resource here that returns a JSON array

        // Some fake categories
        var categories = [
            { name: 'Food', icon: 'ion-fork', thumb: "img/food.jpg",
                myPlaces: [{name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 0},
                    {name: 'Walthers', address: 'Piazza Walther', image: 'img/walthers.jpg', id: 1 },
                    {name: 'Walthers', address: 'Piazza Walther', image: 'img/walthers.jpg', id: 2 },
                    {name: 'Walthers', address: 'Piazza Walther', image: 'img/walthers.jpg', id: 3 },
                    {name: 'Walthers', address: 'Piazza Walther', image: 'img/walthers.jpg', id: 4 },
                    {name: 'Walthers', address: 'Piazza Walther', image: 'img/walthers.jpg', id: 5 },
                    {name: 'Walthers', address: 'Piazza Walther', image: 'img/walthers.jpg', id: 6 },
                    {name: 'Walthers', address: 'Piazza Walther', image: 'img/walthers.jpg', id: 7 },
                    {name: 'Walthers', address: 'Piazza Walther', image: 'img/walthers.jpg', id: 8 },
                    {name: 'Walthers', address: 'Piazza Walther', image: 'img/walthers.jpg', id: 9 }


                ],
                otherPlaces: [{name: 'Walthers', address: 'Piazza Walther', image: 'img/walthers.jpg', id: 0 },
                    {name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 2},
                    {name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 3},
                    {name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 4},
                    {name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 5},
                    {name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 6},
                    {name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 7},
                    {name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 8},
                    {name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 9},
                    {name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 10},
                    {name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 12},
                    {name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 13},
                    {name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 14},
                    {name: 'Nadamas', address: 'Piazza Erbe', image: 'img/nadamas.jpg', id: 15}
                ],
                id: 0 },
            { name: 'Coffee', icon: 'ion-coffee', thumb: "img/coffee.jpg", id: 1 },
            { name: 'Outdoors', icon: 'ion-camera', thumb: "img/outdoors.jpg", id: 2 },
            { name: 'Nightlife', icon: 'ion-ios7-star', thumb: "img/nightlife.jpg", id: 3 },
            { name: 'Shopping', icon: 'ion-ios7-cart', thumb: "img/shopping.jpg", id: 4 },
            { name: 'Entertainment', icon: 'ion-ios7-wineglass', thumb: "img/entertainment.jpg", id: 5 }
        ];

        return {
            all: function () {
                return categories;
            },
            get: function (categoryId) {
                // Simple index lookup
                return categories[categoryId];
            }

        }

    });