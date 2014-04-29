angular.module('soyloco.services', [])



/**********************************************************
 *
 *
 *              ONLINE STATUS MONITORING SERVICE
 *
 *
 * ********************************************************/


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
 *
 *              FACEBOOK CRAWLING API SERVICE
 *
 *
 * ********************************************************/

     .factory('FacebookCrawler', function( $interval, localStorageService, OpenFB) {

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
                     *    Get user basic profile info: GO!
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


                            // Get new etag
                            var userEtag = headers(['etag']);
                            localStorageService.add('userEtag', userEtag);

                            checkIfDone('User profile info retrieved!');

                        })

                        .error(function (data, status, headers, config){

                            if (status === 304) {
                                alert('304 in user basic info!');
                                checkIfDone('304');
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
                                    if (album.type == 'profile') {
                                        profileAlbumId = album.id;

                                    }
                                }
                            }

                            // Retrieve etag for this api call. If it's the first time, it will be null
                            var userProfileAlbumEtag = localStorageService.get('userProfileAlbumEtag');

                            // Prepare the headers to be passed to the $http method
                            var userProfileAlbumHeaders = {'if-none-match': userProfileAlbumEtag};

                            OpenFB.getWithHeaders('/' + profileAlbumId + '/photos', {}, userProfileAlbumHeaders)

                                .success(function (data, status, headers, config) {

                                    // Get new etag
                                    var userProfileAlbumEtag = headers(['etag']);

                                    localStorageService.add('userProfileAlbumEtag', userProfileAlbumEtag);

                                    var userProfilePictures = data;
                                    localStorageService.add('userProfilePictures', userProfilePictures);
                                    checkIfDone('User photos retrieved!');

                                })

                                .error(function (data, status, headers, config){

                                    if (status === 304) {
                                        alert('304 in user album pix!');
                                        checkIfDone('304');
                                    }

                                })


                        });


                    /*************************************
                     *    Get user friends' events
                     *
                     *    It works.
                     *    Facebook seems to give different etags every time here.
                     * */


                        // Call the $http method. We don't use Etag here because friends list
                        // might be unchanged, while a particular friend's event list could!
                    OpenFB.get('/me/friends')

                        .success(function (result) {
                            var results = [];
                            userFriends = result.data;
                            localStorageService.add('userFriends', userFriends);
                            fetchFriendsEvents(userFriends, 0);
                        })

                        .error(function (data, status, headers, config){

                            if (status === 304) {
                                alert('304 in user friends!');
                            }

                        });


                    /*************************************
                     *    Get user likes: GO!
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
                                checkIfDone('304');
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

                            var outIndex, events, eventIndex, event, profileAlbumId;
                            for (outIndex in data) {
                                events = data[outIndex];

                                // Deal with saving
                                //localStorageService.add('userEvents', userEvents);
                                for (eventIndex in events) {
                                    event = events[eventIndex];
                                }
                            }

                            // Get new etag
                            var userEventsEtag = headers(['etag']);
                            localStorageService.add('userEventsEtag', userEventsEtag);

                            checkIfDone('User events retrieved!');
                        })

                        .error(function (data, status, headers, config){

                            if (status === 304) {
                                alert('304 in user events!');
                                checkIfDone('304');
                            }

                        });


                }, defaultCrawlingTime);




                /***********************************************
                 *               HELPER FUNCTIONS              *
                 ***********************************************/


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

                                var outIndex, otherUserEvents, eventIndex, event, profileAlbumId;
                                for (outIndex in data) {
                                    otherUserEvents = data[outIndex];

                                    // Deal with saving
                                    //localStorageService.add('userEvents', userEvents);
                                    for (eventIndex in otherUserEvents) {
                                        event = otherUserEvents[eventIndex];
                                    }
                                }
                                thisFriendIndex++;
                                fetchFriendsEvents(userFriends, thisFriendIndex);
                            })

                            .error(function (data, status, headers, config){

                                // Here is important that we keep the call to fetchFriendsEvents
                                // also from within the error catch, since having one user events
                                // not changed doesn't mean that for the other users must be the same.
                                if (status === 304) {
                                    thisFriendIndex++;
                                    fetchFriendsEvents(userFriends, thisFriendIndex);
                                    alert('304 in user friends events!');
                                }

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
 * ********************************************************/

     .factory('TestEtags', function( $interval, localStorageService, OpenFB) {


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

                }, defaultCrawlingTime);

            }

        }


    });

