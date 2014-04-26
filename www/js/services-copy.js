angular.module('soyloco.services', [])


    .factory('FacebookCrawler', function($interval, localStorageService, OpenFB) {

        // TODO: find a way to get the headers.
        // This should be the right way, but can see or parse
        // data with alert
        //results.headers = result.headers();
        //alert(results.headers["ETag"]);

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


        var fetchFriendsEvents = function (userFriends, friendsIndex) {

            var inCounter = 1;
            if (friendsIndex < userFriends.length) {


                var friend = userFriends[friendsIndex];
                var otherUserEvents;
                OpenFB.get('/' + friend.id + '/events').success(function (result) {
                    otherUserEvents = result.data;
                    localStorageService.add(friend.id + '/events', otherUserEvents);
                    friendsIndex++;
                    fetchFriendsEvents(userFriends, friendsIndex);
                    alert(friend.id);
                });
            } else {
                alert('Finished friends events crawling number: ' + inCounter);
                inCounter++;
            }

        };

        var defaultCrawlingTime = 2000; // Crawl each 5 minutes

        var userFbAccount;
        var userFriends;
        var userLikes;
        var userEvents;
        var counter = 0;

        return {


            startCrawling: function() {

                var stop;
                // Don't start a new fight if we are already crawling
                if ( angular.isDefined(stop) ) return;
                stop = $interval(function() {


                    counter++;
                    alert('start global crawling number: ' + counter);
                    localStorageService.add('counter', counter);

                    OpenFB.get('/me').success(function (user) {
                        userFbAccount = user;
                        localStorageService.add('userFbAccount', userFbAccount);
                    }).success(OpenFB.get('/me/friends')
                        .success(function (result) {
                            var results = [];
                            userFriends = result.data;
                            localStorageService.add('userFriends', userFriends);
                            fetchFriendsEvents(userFriends, 0);
                        })).success()



                    OpenFB.get('/me/friends')
                        .success(function (result) {
                            var results = [];
                            userFriends = result.data;
                            localStorageService.add('userFriends', userFriends);
                            fetchFriendsEvents(userFriends, 0);
                        });

                    OpenFB.get('/me/likes')
                        .success(function (result) {
                            userLikes = result.data;
                            localStorageService.add('userLikes', userLikes);
                        });


                    OpenFB.get('/me/events')
                        .success(function (result) {
                            userEvents = result.data;
                            localStorageService.add('userEvents', userEvents);

                        });



                }, defaultCrawlingTime);

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

