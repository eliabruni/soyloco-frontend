angular.module('soyloco.services', [])


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


                    // Get user basic profile info
                    OpenFB.get('/me').success(function (user) {
                        userFbAccount = user;
                        localStorageService.add('userFbAccount', userFbAccount);
                        checkIfDone('User profile info retrieved!');
                    });

                    // Get all user profile pictures
                    OpenFB.get('/me/albums').success(function (result) {
                        var albums = result.data;
                        var albumIndex;
                        for (albumIndex in albums) {
                            var album = albums[albumIndex];
                            if (album.type == 'profile') {
                                OpenFB.get('/' + album.id + '/photos').success(function (result) {
                                    userProfilePictures = result.data;
                                    localStorageService.add('userProfilePictures', userProfilePictures);
                                    checkIfDone('User photos retrieved!');
                                })

                            }
                        }
                    });

                    // Get user friends
                    OpenFB.get('/me/friends')
                        .success(function (result) {
                            var results = [];
                            userFriends = result.data;
                            localStorageService.add('userFriends', userFriends);
                            fetchFriendsEvents(userFriends, 0);
                        });

                    // Get user likes
                    OpenFB.get('/me/likes')
                        .success(function (result) {
                            userLikes = result.data;
                            localStorageService.add('userLikes', userLikes);
                            checkIfDone('User likes retrieved!');
                        });


                    // Get user events
                    OpenFB.get('/me/events')
                        .success(function (result) {
                            userEvents = result.data;
                            localStorageService.add('userEvents', userEvents);
                            checkIfDone('User events retrieved!');
                        });


                }, defaultCrawlingTime);



                /**********************************************
                *               HELPER FUNCTIONS
                **/


                // Get user friends' events
                var fetchFriendsEvents = function (userFriends, thisFriendIndex) {

                    if (thisFriendIndex < userFriends.length - 1) {

                        var friend = userFriends[thisFriendIndex];
                        var otherUserEvents;
                        OpenFB.get('/' + friend.id + '/events').success(function (result) {
                            otherUserEvents = result.data;
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

    });

