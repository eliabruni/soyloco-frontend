angular.module('splash.crawler', [])

    .factory('$crawler', ['$localstorage', '$cordovaFacebook', function($localstorage, $cordovaFacebook) {


        var categories = [ "Concert+Venue", "Night+Club", "Pub" ];
        var limit = 100;

        function getPaginateURL(after, event_id) {
            //var BASE_URL = "https://graph.facebook.com/v1.0/";
            var LIMIT = "/attending?&fields=id,name,gender,picture.type(large)&limit=" + limit;
            var AFTER = "&after=" + after;
            //var ACCESS_TOKEN = "&access_token=" + access_token;

            //return BASE_URL + event_id + LIMIT + AFTER + ACCESS_TOKEN;
            return event_id + LIMIT + AFTER;

        }

        function getQueryURL(city, category) {
            //var BASE_URL = "https://graph.facebook.com/v1.0/search?q=";
            var BASE_URL = "search?q=";
            var REST_OF_URL = "&type=page&fields=id,name,location,likes,events.limit(3).since(now).until(+1 week){id,name,attending.limit(10){id,name,gender,picture.type(large)}}";
            //var ACCESS_TOKEN = "&access_token=" + access_token;

            //return BASE_URL + city + "+" + category + REST_OF_URL + ACCESS_TOKEN;
            return BASE_URL + city + "+" + category + REST_OF_URL;

        }

        function PeopleLazyIterator(city) {
            this.MIN_USERS = 50;
            this.city = city.toLowerCase();
            this.events = {};
            this.users = [];
            this.last_paginated = 0, paginated_n = 5;
            this.initializing = categories.length;
        }

        function PeopleLazyIterator(city) {
            this.MIN_USERS = 50;
            this.city = city.toLowerCase();
            this.events = {};
            this.users = [];
            this.last_paginated = 0, paginated_n = 5;
            this.initializing = categories.length;
        }

        PeopleLazyIterator.prototype = {
            constructor : PeopleLazyIterator,

            parseAttending : function(attending, event_id) {
                var find = function(container, element_id) {
                    for (var i = 0; i < container.length; i++) {
                        if (container[i].id == element_id) {
                            return container[i];
                        }
                    }

                    return null;
                };

                var event = this.events[event_id];
                var total = 0;
                for (var i = 0; i < attending.length; i++) {
                    var user = attending[i];
                    var u = find(this.users, user.id);
                    if (u == null) {
                        u = {
                            name : user.name,
                            id : user.id,
                            gender : user.gender,
                            photo : user.picture.data.url,
                            events : [ ]
                        };

                        //console.log("adding user " + u.name);
                        total++;
                        this.users.push(u);
                    }

                    if (find(u.events, event_id) == null) {
                        u.events.push(event_id);
                    }

                    event.attending.push(u);
                }

                return total;
            },

            parsePaginateResult : function(error, response, body, event) {
                if (!error && response.statusCode == 200) {
                    console.log("managing pagination for " + event.name);
                    var content = JSON.parse(body);
                    if (content['paging'] != undefined && content.paging['cursors'] != undefined) {
                        event.next = content.paging.cursors.after;
                    } else {
                        event.next = undefined;
                    }

                    var added = this.parseAttending(content.data, event.id);
                    console.log("Added " + added + " people");
                    event.crawling = false;
                }
            },

            parseQueryResult : function(error, response, body) {
                var checkCity = function(page, city) {
                    if (page['location'] != undefined && page.location['city'] != undefined) {
                        if (page.location.city.toLowerCase() == city) {
                            return true;
                        }
                    }

                    return false;
                };

                if (!error && response.statusCode == 200) {
                    var content = JSON.parse(body);
                    for (var i = 0; i < content.data.length; i++) {
                        var page = content.data[i];
                        if (!(checkCity(page, this.city) == true && page['events'] != undefined)) {
                            continue;
                        }

                        for (var j = 0; j < page.events.data.length; j++) {
                            var event = page.events.data[j];
                            if (event['attending'] == undefined) {
                                continue;
                            }

                            if (this.events[event.id] == undefined) {
                                var e = {
                                    page : {
                                        id : page.id,
                                        name : page.name,
                                        likes : page.likes
                                    },
                                    id : event.id,
                                    name : event.name,
                                    start_time : event.start_time,
                                    attending : [],
                                    next : event.attending.paging.cursors.after,
                                    crawling : false
                                };

                                //console.log("adding event " + e.name, + " " + event.id);
                                this.events[event.id] = e;
                                this.parseAttending(event.attending.data, event.id);
                            }
                        }
                    }

                    this.initializing--;
                }
            },

            next : function() {
                if (this.initializing > 0) {
                    throw "initializing";
                }

                if (this.users.length == 0) {
                    if (this.isCrawling() == false) {
                        throw "exhausted";
                    } else {
                        throw "crawling";
                    }
                } else if (this.users.length <= this.MIN_USERS) {
                    if (this.isCrawling() == false) {
                        this.paginateAll();
                    }
                }

                // pick a random user, remove it, and return it
                var user_idx = Math.floor(Math.random() * this.users.length);
                var user = this.users.splice(user_idx, 1).pop();

                return user;
            },

            init : function() {
                // XXX: might wanna delay each of them by a delta via setTimeout
                for (var i = 0; i < categories.length; i++) {
                    var url = getQueryURL(this.city, categories[i]);

                    // TODO: substitute with $cordovaFacebook.api ???
                    request(url, (this.parseQueryResult).bind(this));
                }
            },

            isReady : function() {
                return this.initializing == 0;
            },

            isCrawling : function() {
                for (var key in this.events) {
                    var event = this.events[key];
                    if (event.crawling == true) {
                        return true;
                    }
                }

                return false;
            },

            isExhausted : function() {
                for (var key in this.events) {
                    var event = this.events[key];
                    if (event.next != undefined) {
                        return false;
                    }
                }

                return true;
            },

            getEvents : function() {
                return this.events;
            },

            getUsers : function() {
                return this.users;
            },

            paginateEvent : function(event) {
                event.crawling = true;
                var url = getPaginateURL(event.next, event.id);


                // TODO: substitute with $cordovaFacebook.api(
                request.get(url, function(error, response, body) {
                    return (this.parsePaginateResult.bind(this))(error, response, body, event);
                }.bind(this));
                console.log("paginating " + event.name + " " + url);
            },

            paginateN : function() {
                var next_event = last_paginated;
                for (var i = 0; i < paginate_n; i++) {
                    next_event++;
                    if (next_event == this.events.length) {
                        next_event = 0;
                    }

                    var event = this.events[next_event];
                    if (event.crawling == false && event.next != undefined) {
                        this.paginateEvent(event);
                    }
                }

                last_paginated = next_event;
            },

            // XXX: might wanna delay each of them by a delta via setTimeout
            paginateAll : function() {
                for (var key in this.events) {
                    var event = this.events[key];
                    if (event.crawling == false && event.next != undefined) {
                        this.paginateEvent(event);
                    }
                }
            }
        }

        console.log("Welcome to Mavericks. Firing up the crawl!");
        console.log("Running the bootstrap queries, it may take a minute...");
        var it = new PeopleLazyIterator("Amsterdam");
        it.init();


        setTimeout(function() {
            if (!it.isReady()) {
                console.log("iterator is not ready, exiting...");
                return;
            }

            var events = it.getEvents();
            console.log(Object.keys(events).length + " events crawled:");
            for (var key in events) {
                var event = events[key];
                console.log(event.name + " => " + event.page.name + " with likes: " + event.page.likes);
            }

            var users = it.getUsers();
            console.log(users.length + " people crawled:");
            crawl(it);
        }, 60000);

        var total = 0;
        function crawl(it) {
            try {
                var person = it.next();
                console.log(person.name);
                total++;
                setTimeout(function() { crawl(it); }, 300);
            } catch (err) {
                if (err == "crawling") {
                    console.log("crawling, waiting 10 seconds");
                    return setTimeout(function() { crawl(it); }, 10000);
                } else if (err == "exhausted") {
                    console.log("exhausted " + total);
                    return;
                }
            }
        }




        facebookGeoLocation : function(latitude, longitude, radius, callback) {

                var getPlacesURL = function(latitude, longitude, radius) {
                    var BASE_URL = "search?q=*&type=place";
                    var CENTER = "&center=" + latitude + "," + longitude;
                    var DIST = "&distance=" + radius;
                    var FIELDS = "&fields=location";

                    return BASE_URL + CENTER + DIST + FIELDS;
                };

                var requestHandler = function(success, callback) {
                    var data = success.data;
                    var cities = {};
                    var total = 0;
                    for (var i = 0; i < data.length; i++) {
                        var location = data[i].location;
                        if (location['city'] != undefined) {
                            var cityName = location['city'].toLowerCase();
                            var counter = cities[cityName];
                            if (counter == undefined) {
                                cities[cityName] = 1;
                            } else {
                                cities[cityName] = counter + 1;
                            }

                            total++;
                        }
                    }

                    // normalizing to [0,1]
                    for (var city in cities) {
                        var counter = cities[city];
                        cities[city] = counter / total;
                    }

                    var sortable = [];
                    for (var city in cities)
                        sortable.push([city, cities[city]])
                    sortable.sort(function(a, b) {return - (a[1] - b[1])})

                    var sortedCities = [];
                    for (var idx in sortable) {
                        var city = {};
                        city['id'] = idx;
                        city['name'] =  sortable[idx][0];
                        city['p'] =  sortable[idx][1];
                        sortedCities[idx] = city;
                    }

                    return callback(sortedCities);
                }

                var compare = function(city1, city2)
                {
                    if (city1 < city2)
                        return -1;
                    if (city1 > city2)
                        return 1;
                    return 0;
                }


                $cordovaFacebook.api(getPlacesURL(latitude, longitude, radius), null).then(function (success) {
                    return requestHandler(success, callback);

                }, function (error) {

                })
            }
    }]);