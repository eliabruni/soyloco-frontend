angular.module('soyloco.crawling', [])


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
    .factory('Crawler', function($window, $cordovaFacebook, FacebookCrawler, localStorageService) {

        var isInit = false;
        var testing = true;

        function init() {
            FacebookCrawler.startCrawling();

            // TODO: Shouldn't we add other listeners for the crawling, such as device not ready, etc?
            document.addEventListener("online", onOnline, false);
            document.addEventListener("offline", onOffline, false);
            isInit = true;
        }

        function stop() {
            FacebookCrawler.stopCrawling();
        }

        function onOnline() {

            if (testing) {
                alert('online, now check if also logged in...');
            }
            $cordovaFacebook.getLoginStatus().then(function (status) {
                if (testing) {
                    alert('online and logged in, we can restart crawling..');
                }
                FacebookCrawler.startCrawling();

            }, function (error) {
                $scope.status = error;
            })
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
    .factory('FacebookCrawler', function( $interval, localStorageService, $cordovaFacebook, StorageUtility) {

        var defaultCrawlingTime = 5000; // Crawl each 5 minutes
        var done;

        // If defined, crawling is active and vice versa.
        var stop;

        // TESTING
        var testing = true;
        var counter = 0;
        // TESTING

        function startCrawling () {

            // We first stop any possible previous instance of startCrawling().
            // Note that this is different from the done<5 check, since it's done
            // just when startCrawling is called but not at the ith interval instance.
            stopCrawling();

            stop = $interval(function() {

                // Don't start a new crawling if we are already crawling
                //if (done < 2) return;

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
                 *    Get user basic profile info: NO GO
                 * */
                getMe();



            }, defaultCrawlingTime);

            /***********************************************
             *               GRAPH API FUNCTIONS              *
             ***********************************************/

            var getMe = function () {
                $cordovaFacebook.api("me", null).then(function (success) {

                    var data = success;

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

                    checkIfDone('User profile info retrieved!');

                }, function (error) {
                    checkIfDone('Error in profile info!');
                })
            };


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