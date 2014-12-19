angular.module('soyloco.services', [])

    .factory('Users', function($localstorage)
    {

        var init = false;
        function setUser(fbid, user)
        {
            var users = {};
            if ($localstorage.getObject('users') != null) {
                users = $localstorage.getObject('users');
            }
            users[fbid] = user;
            $localstorage.setObject('users', users);

            addFbid(fbid);
        }

        function getUser(fbid)
        {
            if ($localstorage.getObject('users') != null) {
                var users = $localstorage.getObject('users');
                return users[fbid];
            } else {
                return null;
            }
        }

        function addFbid(fbid)
        {
            var fbids = [];
            if ($localstorage.getObject('fbids') != null) {
                fbids = $localstorage.getObject('fbids');
            }
            fbids.push(fbid);
            $localstorage.setObject('fbids', fbids);

            setUserToSwipe(fbid);

        }

        function setUserToSwipe(fbid)
        {
            var usersToSwipe = [];
            if ($localstorage.getObject('usersToSwipe') != null) {
                usersToSwipe = $localstorage.getObject('usersToSwipe');
            }
            usersToSwipe.push(fbid);
            $localstorage.setObject('usersToSwipe', usersToSwipe);
        }

        function getUserToSwipe()
        {
            alert('adding!')
            if ($localstorage.getObject('usersToSwipe') != null) {
                var usersToSwipe = $localstorage.getObject('usersToSwipe');
                var randomIdx = Math.floor(Math.random() * usersToSwipe.length);
                var fbid = usersToSwipe[randomIdx];

                // TODO: the problem with calling here addSwipedUser(fbid) is
                // that we remove a user to swipe before being sure it was swiped
                // need to create a tmp array to store not yet swiped users which
                // has to be checked at every app init, if a user is found, put
                // it back via setUserToSwipe(fbid)
                addSwipedUser(fbid);
                return getUser(fbid);
            }

            else {
                return null;
            }
        }

        function removeUserToSwipe(fbid)
        {
            if ($localstorage.getObject('usersToSwipe') != null) {
                var usersToSwipe = $localstorage.getObject('usersToSwipe');
                var index = usersToSwipe.indexOf(fbid);
                if (index > -1) {
                    alert('removing!')
                    usersToSwipe.splice(index, 1);
                    $localstorage.setObject('usersToSwipe', usersToSwipe);
                }
            }
        }

        function addSwipedUser(fbid)
        {
            var swipedUsers = [];
            if ($localstorage.getObject('swipedUsers') != null) {
                swipedUsers = $localstorage.getObject('swipedUsers');
            }
            swipedUsers.push(fbid);

            removeUserToSwipe(fbid);
        }

        function mokeInit()
        {

            $localstorage.clear();
            var user1 = {
                fbid:'313',
                name:'kristen',
                gender: 'woman',
                image: 'img/kristen.jpg',
                swipe: '-1',
                events: [1, 2, 3]
            };

            var user2 = {
                fbid:'314',
                name:'frieda',
                gender: 'woman',
                image: 'img/frieda.jpg',
                swipe: '-1',
                events: [1, 2, 3]
            };

            var user3 = {
                fbid:'315',
                name:'olga',
                gender: 'woman',
                image: 'img/olga.jpg',
                swipe: '-1',
                events: [1, 2, 3]
            };

            setUser(user1.fbid, user1);
            setUser(user2.fbid, user2);
            setUser(user3.fbid, user3);

            init = true;

        }

        function getInit()

        {
            return init;
        }

        var initUsers = [
            {
                fbid:'310',
                name:'emilia',
                gender: 'woman',
                image: 'img/emilia.jpg',
                swipe: '-1',
                events: [1, 2, 3]
            },
            {
                fbid:'311',
                name:'emma',
                gender: 'woman',
                image: 'img/emma.jpg',
                swipe: '-1',
                events: [1, 2, 3]
            },
            {
                fbid:'312',
                name:'jennifer',
                gender: 'woman',
                image: 'img/jennifer.jpg',
                swipe: '-1',
                events: [1, 2, 3]
            }
        ];

        return {
            getInit : getInit,
            mokeInit : mokeInit,
            getUserToSwipe : getUserToSwipe,
            setSwipedUser : setSwipedUser,
            initUsers: function () {
                return initUsers;
            }
        }

    })





// Call this function *after* the page is completely loaded!
function resize_images(maxht, maxwt, minht, minwt) {
    var imgs = document.getElementsByTagName('img');

    var resize_image = function(img, newht, newwt) {
        img.height = newht;
        img.width  = newwt;
    };

    for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        if (img.height > maxht || img.width > maxwt) {
            // Use Ratios to constraint proportions.
            var old_ratio = img.height / img.width;
            var min_ratio = minht / minwt;
            // If it can scale perfectly.
            if (old_ratio === min_ratio) {
                resize_image(img, minht, minwt);
            }
            else {
                var newdim = [img.height, img.width];
                newdim[0] = minht;  // Sort out the height first
                // ratio = ht / wt => wt = ht / ratio.
                newdim[1] = newdim[0] / old_ratio;
                // Do we still have to sort out the width?
                if (newdim[1] > maxwt) {
                    newdim[1] = minwt;
                    newdim[0] = newdim[1] * old_ratio;
                }
                resize_image(img, newdim[0], newdim[1]);
            }
        }
    }
}










