angular.module('soyloco.services', [])

    .factory('Users', function($localstorage)
    {
        //DEBUG
        var init = false;
        //DEBUG
        var tmpSwipeChecked = false;

        function setUser(fbid, user)
        {
            var users = {};
            if ($localstorage.getObject('users') != null) {
                users = $localstorage.getObject('users');
            }

            if (users[fbid] == null) {
                //alert('adding new user fbid: ' + fbid)
                users[fbid] = user;
                $localstorage.setObject('users', users);

                setUserToSwipe(fbid);
                //addFbid(fbid);
            }
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

        /*        function addFbid(fbid)
         {
         var fbids = [];
         if ($localstorage.getObject('fbids') != null) {
         fbids = $localstorage.getObject('fbids');
         }
         fbids.push(fbid);
         $localstorage.setObject('fbids', fbids);

         setUserToSwipe(fbid);
         }*/

        function setUserToSwipe(fbid)
        {
            var usersToSwipe = [];
            if ($localstorage.getObject('usersToSwipe') != null) {
                usersToSwipe = $localstorage.getObject('usersToSwipe');
            }
            var index = usersToSwipe.indexOf(fbid);
            if (index == -1) {
                usersToSwipe.push(fbid);
                $localstorage.setObject('usersToSwipe', usersToSwipe);
            }
        }

        function getUserToSwipe()
        {
            if ($localstorage.getObject('usersToSwipe') != null) {
                var usersToSwipe = $localstorage.getObject('usersToSwipe');
                var randomIdx = Math.floor(Math.random() * usersToSwipe.length);
                var fbid = usersToSwipe[randomIdx];
                usersToSwipe.splice(randomIdx, 1);
                $localstorage.setObject('usersToSwipe', usersToSwipe);

                //addSwipedUser(fbid);
                addTmpNotSwipedUser(fbid);
                return getUser(fbid);
            }

            else {
                return null;
            }
        }

        /*        function addSwipedUser(fbid)
         {
         var swipedUsers = [];
         if ($localstorage.getObject('swipedUsers') != null) {
         swipedUsers = $localstorage.getObject('swipedUsers');
         }
         swipedUsers.push(fbid);
         }

         function removeSwipedUser(fbid)
         {
         if ($localstorage.getObject('swipedUsers') != null) {
         var swipedUsers = $localstorage.getObject('swipedUsers');
         var index = swipedUsers.indexOf(fbid);
         if (index > -1) {
         swipedUsers.splice(index, 1);
         $localstorage.setObject('swipedUsers', swipedUsers);
         }
         }
         }*/

        function addTmpNotSwipedUser(fbid)
        {
            var tmpNotSwipedUsers = [];
            if ($localstorage.getObject('tmpNotSwipedUsers') != null) {
                tmpNotSwipedUsers = $localstorage.getObject('tmpNotSwipedUsers');
            }
            var index = tmpNotSwipedUsers.indexOf(fbid);
            if (index == -1) {
                tmpNotSwipedUsers.push(fbid);
                $localstorage.setObject('tmpNotSwipedUsers', tmpNotSwipedUsers);
                //alert('adding tmp not swiped fbid: ' + fbid)
            }

        }

        function removeTmpNotSwipedUser(fbid)
        {
            if ($localstorage.getObject('tmpNotSwipedUsers') != null) {
                var tmpNotSwipedUsers = $localstorage.getObject('tmpNotSwipedUsers');
                var index = tmpNotSwipedUsers.indexOf(fbid);
                if (index > -1) {
                    //alert('removing tmp not swiped fbid: ' + fbid)
                    tmpNotSwipedUsers.splice(index, 1);
                    $localstorage.setObject('tmpNotSwipedUsers', tmpNotSwipedUsers);
                }
            }
        }

        function tmpSwipeCheck()
        {
            if ($localstorage.getObject('tmpNotSwipedUsers') != null) {
                var tmpNotSwipedUsers = $localstorage.getObject('tmpNotSwipedUsers');

                for (var idx in tmpNotSwipedUsers)
                {
                    var fbid = tmpNotSwipedUsers[idx];
                    setUserToSwipe(fbid);
                    //removeSwipedUser(fbid);
                }
            }
            tmpSwipeChecked = true;
        }

        function getTmpSwipeChecked()
        {
            return tmpSwipeChecked;
        }

        //DEBUG
        function mokeInit()
        {
            //$localstorage.clear();
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
        //DEBUG

        return {
            //DEBUG
            getInit : getInit,
            mokeInit : mokeInit,
            //DEBUG
            tmpSwipeCheck: tmpSwipeCheck,
            getTmpSwipeChecked : getTmpSwipeChecked,
            getUserToSwipe : getUserToSwipe,
            removeTmpNotSwipedUser : removeTmpNotSwipedUser,
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










