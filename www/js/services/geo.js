angular.module('splash.geo', [])

    .factory('$geo', ['$localstorage', '$cordovaFacebook', function($localstorage, $cordovaFacebook) {
        return {

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
                        city['value'] =  sortable[idx][0];
                        city['p'] =  sortable[idx][1];
                        if (idx == 0) {
                            city['selected'] = true;
                        } else {
                            city['selected'] = false;
                        }
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
        }
    }]);