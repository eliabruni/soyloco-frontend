angular.module('splash.events', [])

    .factory('Events', function($localstorage)
    {

        //DEBUG
        var init = false;
        //DEBUG

        function setEvent(id, event)
        {
            var events = {};
            if ($localstorage.getObject('events') != null) {
                events = $localstorage.getObject('events');
            }

            if (events[id] == null) {
                events[id] = event;
                $localstorage.setObject('events', events);
            }
        }

        function getEvent(id)
        {
            if ($localstorage.getObject('events') != null) {
                var events = $localstorage.getObject('events');
                return events[id];
            } else {
                return null;
            }
        }

        function computeScore(events)
        {
            var idx;
            for (idx in events) {
                var event = events[idx];
                event['score'] = (event.posSwipes + event.negSwipes)  * (event.posSwipes / event.negSwipes);
            }
            return events;
        }

        function compare(event1, event2)
        {
            if (event1.score < event2.score)
                return -1;
            if (event1.score > event2.score)
                return 1;
            return 0;
        }

        var events =
            [
                {
                    id: 0,
                    name:'dancing event',
                    image: 'img/event1.jpg',
                    date : 'DIC 25',
                    users: ['313'],
                    posSwipes : 0,
                    negSwipes : 0

                },
                {
                    id: 1,
                    name:'disco event',
                    image: 'img/event2.jpg',
                    date : 'DIC 25',
                    users: ['313', '314'],
                    posSwipes : 0,
                    negSwipes : 0
                },
                {
                    id: 2,
                    name:'electro event',
                    image: 'img/event3.jpg',
                    date : 'DIC 25',
                    users: ['313', '314', '315'],
                    posSwipes : 0,
                    negSwipes : 0
                },
                {
                    id: 3,
                    name:'dancing event',
                    image: 'img/event1.jpg',
                    date : 'DIC 25',
                    users: ['313'],
                    posSwipes : 0,
                    negSwipes : 0

                },
                {
                    id: 4,
                    name:'disco event',
                    image: 'img/event2.jpg',
                    date : 'DIC 25',
                    users: ['313', '314'],
                    posSwipes : 0,
                    negSwipes : 0
                },
                {
                    id: 5,
                    name:'electro event',
                    image: 'img/event3.jpg',
                    date : 'DIC 25',
                    users: ['313', '314', '315'],
                    posSwipes : 0,
                    negSwipes : 0
                },
                {
                    id: 6,
                    name:'dancing event',
                    image: 'img/event1.jpg',
                    date : 'DIC 25',
                    users: ['313'],
                    posSwipes : 0,
                    negSwipes : 0

                },
                {
                    id: 7,
                    name:'disco event',
                    image: 'img/event2.jpg',
                    date : 'DIC 25',
                    users: ['313', '314'],
                    posSwipes : 0,
                    negSwipes : 0
                },
                {
                    id: 8,
                    name:'electro event',
                    image: 'img/event3.jpg',
                    date : 'DIC 25',
                    users: ['313', '314', '315'],
                    posSwipes : 0,
                    negSwipes : 0
                }
            ];



        /*        //DEBUG
         function mokeInit(){



         setEvent(event1.id, event1);
         setEvent(event2.id, event2);
         setEvent(event3.id, event3);

         init = true;
         }

         function getInit()
         {
         return init;
         }
         //DEBUG*/

        return {
            all: function() {
                return events;
            },
            get: function(eventId) {
                // Simple index lookup
                return events[eventId];
            }
        }

    })













