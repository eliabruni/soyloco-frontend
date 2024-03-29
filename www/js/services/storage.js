angular.module('splash.storage', [])

    .factory('$localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key) {
                return $window.localStorage[key] || null;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || null);
            },
            clear : function() {
                window.localStorage.clear();
            }
        }
    }]);