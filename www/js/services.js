angular.module('soyloco.services', [])



/**********************************************************
 *
 *              ONLINE STATUS MONITORING SERVICE
 *
 *
 * */


    .factory('Crawler', function(OpenFB) {

        document.addEventListener("online", onOnline, false);
        document.addEventListener("offline", onOffline, false);

        function onOnline() {
            alert('online');
            if (OpenFB.getLoginStatus()) {
                alert('online');
                //FacebookCrawler.startCrawling();
            }
        }

        function onOffline() {
            alert('offline');
        }

    })




/**********************************************************
 *
 *              FACEBOOK CRAWLING API SERVICE
 *
 *
 * */
    .factory('FacebookCrawler', function( $interval, localStorageService, OpenFB) {

        // TODO: find a way to get the headers.
        // This should be the right way, but can see or parse
        // data with alert
        //results.headers = result.headers();
        //alert(results.headers["ETag"]);

        // TODO: check id the function below reads headers retrieved as above

        /*        var extractETag = function(headers) {
         var etag, header, headerIndex;
         for(headerIndex in headers) {
         header = headers[headerIndex];
         if(header.name === 'ETag') {
         etag = header.value;
         }
         }
         return etag;
         };*/


        var defaultCrawlingTime = 2000; // Crawl each 5 minutes

        var userFbAccount;
        var userProfilePictures;
        var userFriends;
        var userLikes;
        var userEvents;
        var done = 5;

        // TESTING
        var testing = true;
        var counter = 0;
        // TESTING


        return {

            startCrawling: function() {

                $interval(function() {

                    // Don't start a new fight if we are already crawling
                    if ( done<5 ) return;

                    done = 0;


                    // TESTING
                    if(testing) {
                        counter++;
                        alert('Start crawling iteration number ' + counter);
                        localStorageService.add('counter', counter);
                    }
                    // TESTING



                    /*************************************
                     *    Get user basic profile info
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

                            // Get data
                            userFbAccount = data;
                            localStorageService.add('userFbAccount', userFbAccount);
                            checkIfDone('User profile info retrieved!');

                            // Get new etag
                            var userEtag = headers(['etag']);
                            localStorageService.add('userEtag', userEtag);

                        })

                        .error(function (data, status, headers, config){

                            if (status === 304) {
                                alert('304 in user basic info!');
                            }

                        });


                    /*************************************
                     *    Get user profile pictures
                     * */


                    // Call the $http method
                    OpenFB.get('/me/albums')

                        // Note that we have to take care os the sucess case only. If the ETag
                        // hasn't modified, an error is raised and a status===304 is returned.
                        .success(function (data, status, headers, config) {

                            var albums = data;
                            for (var key in albums) {
                                alert(key);
                            }
                            var albumIndex, album;
                            for (albumIndex in albums) {
                                album = albums[albumIndex];
                                if (album['type'] == 'profile') {
                                    alert('inside profile iteration!');



                                    // Retrieve etag for this api call. If it's the first time, it will be null
                                    var userProfileAlbumEtag = localStorageService.get('userProfileAlbumEtag');

                                    // Prepare the headers to be passed to the $http method
                                    var userProfileAlbumHeaders = {'if-none-match': userProfileAlbumEtag};

                                     alert(userProfileAlbumEtag);
                                    OpenFB.getWithHeaders('/' + album.id + '/photos', {}, userProfileAlbumHeaders)

                                        .success(function (data, status, headers, config) {

                                            // Get new etag
                                            var userProfileAlbumEtag = headers(['etag']);

                                            alert(userProfileAlbumEtag);
                                            localStorageService.add('userProfileAlbumEtag', userProfileAlbumEtag);

                                            userProfilePictures = data;
                                            localStorageService.add('userProfilePictures', userProfilePictures);
                                            checkIfDone('User photos retrieved!');


                                        })

                                        .error(function (data, status, headers, config){

                                            if (status === 304) {
                                                alert('304 in user album pix!');
                                            }

                                        })

                                }
                            }

                        });


                    /*************************************
                     *    Get user profile pictures
                     * */


                        // Call the $http method. We don't use Etag here because friends list
                        // might be unchanged, while a particular friend's event list could!
                    OpenFB.get('/me/friends')

                        .success(function (result) {
                            var results = [];
                            userFriends = result.data;
                            localStorageService.add('userFriends', userFriends);
                            fetchFriendsEvents(userFriends, 0);
                        });


                    /*************************************
                     *    Get user likes
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

                            // Get new etag
                            var userLikesEtag = headers(['etag']);
                            localStorageService.add('userLikesEtag', userLikesEtag);

                            userLikes = data;
                            localStorageService.add('userLikes', userLikes);
                            checkIfDone('User likes retrieved!');
                        })

                        .error(function (data, status, headers, config){

                            if (status === 304) {
                                alert('304 in user likes!');
                            }

                        })


                    /*************************************
                     *    Get user events
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

                            // Get new etag
                            var userEventsEtag = headers(['etag']);
                            localStorageService.add('userEventsEtag', userEventsEtag);

                            userEvents = data;
                            localStorageService.add('userEvents', userEvents);
                            checkIfDone('User events retrieved!');
                        });

                }, defaultCrawlingTime);




                 /***********************************************
                  ***********************************************
                  *
                  *               HELPER FUNCTIONS
                  **/



                /*************************************
                 *    Get user friends' events
                 * */
                var fetchFriendsEvents = function (userFriends, thisFriendIndex) {

                    if (thisFriendIndex < userFriends.length - 1) {

                        // Retrieve etag for this api call. If it's the first time, it will be null
                        var userFriendsEventsEtag = localStorageService.get('userFriendsEventsEtag');

                        // Prepare the headers to be passed to the $http method
                        var userFriendsEventsHeaders = {'if-none-match': userFriendsEventsEtag};

                        var friend = userFriends[thisFriendIndex];
                        var otherUserEvents;
                        OpenFB.get('/' + friend.id + '/events', userFriendsEventsHeaders)

                            // Note that we have to take care os the sucess case only. If the ETag
                            // hasn't modified, an error is raised and a status===304 is returned.
                            .success(function (data, status, headers, config) {

                                // Get new etag
                                var userFriendsEventsEtag = headers(['etag']);
                                localStorageService.add('userFriendsEventsEtag', userFriendsEventsEtag);

                                otherUserEvents = data;
                                localStorageService.add(friend.id + '/events', otherUserEvents);
                                thisFriendIndex++;
                                fetchFriendsEvents(userFriends, thisFriendIndex);
                            });

                    } else {
                        checkIfDone('User friends and friends events retrieved!')
                    }
                };

                // Crawling jobs counter
                function checkIfDone(functionThatCalled) {
                    if(testing) {
                        alert(functionThatCalled);
                    }
                    done++;
                }

            }

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

    })


/**********************************************************
 *
 *              THIS IS JUST FOR TESTING ETAGS
 *
 *
 * */
    .factory('TestEtags', function( $interval, localStorageService, OpenFB) {

        // TODO: find a way to get the headers.
        // This should be the right way, but can see or parse
        // data with alert
        //results.headers = result.headers();
        //alert(results.headers["ETag"]);

        // TODO: check id the function below reads headers retrieved as above

        /*        var extractETag = function(headers) {
         var etag, header, headerIndex;
         for(headerIndex in headers) {
         header = headers[headerIndex];
         if(header.name === 'ETag') {
         etag = header.value;
         }
         }
         return etag;
         };*/


        var defaultCrawlingTime = 2000; // Crawl each 5 minutes
        var userEvents;
        var done = 1;

        // TESTING
        var testing = false;
        // TESTING


        return {

            testEtags: function() {

                $interval(function() {

                    // Don't start a new fight if we are already crawling
                    if ( done<1 ) return;

                    done = 0;


                    // Get user events

                    // Need to see if it is successfful
                    OpenFB.get('/me')
                        .success(function (data, status, headers, config) {
                            var etag = headers(['etag']);
                            var headers = {
                                'if-none-match': etag};
                            OpenFB.getWithHeaders('/me', headers)
                                .success(function (data, status, headers, config) {
                                    localStorageService.add('dataToTestWithEtags', data);
                                    localStorageService.add('status', status);


                                })
                                .error(function(data, status, headers, config) {
                                    if (status === 304 ){
                                        alert('304 DETECTED!');
                                    }
                                    localStorageService.add('status', status);
                                })



                        })



                }, defaultCrawlingTime);


                // Crawling jobs counter
                function checkIfDone(functionThatCalled) {
                    if(testing) {
                        alert(functionThatCalled);
                    }
                    done++;
                }

            }

        }


    })

