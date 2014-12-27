angular.module('splash.geo', [])

    .factory('Geo', function($localstorage, $cordovaFacebook) {
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

                    var maxP = 0;
                    var yourCity;
                    for (var city in cities) {
                        var p = cities[city];
                        if (p > maxP) {
                            maxP = p;
                            yourCity = city;
                        }
                    }

                    return callback(yourCity);
                };

                $cordovaFacebook.api(getPlacesURL(latitude, longitude, radius), null).then(function (success) {
                    return requestHandler(success, callback);

                }, function (error) {

                })
            }
        }
    });