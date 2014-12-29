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

                    alert('here')

                    Object.keys(cities).sort(function(a, b) {return -(cities[a] - cities[b])});
                    //cities.sort(compare);


                    var maxP = 0;
                    var myPlace;
                    for (var city in cities) {
                        var p = cities[city];
                        alert('city: ' + city + ', p: ' + p)
                        if (p > maxP) {
                            maxP = p;
                            myPlace = city;
                        }
                    }

                    return callback(myPlace);
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
    });