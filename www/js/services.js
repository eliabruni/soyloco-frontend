angular.module('soyloco.services', [])

    .factory('Users', function() {

        var cardIdxCounter = 0;
        function nextCardIdx() {
            return cardIdxCounter++;
        };

        var initUsers = [
            {
                idx:1,
                fbId:123,
                name:'emilia',
                gender: 'woman',
                image: 'img/emilia.jpg',
                events: [1, 2, 3]
            },
            {
                idx:2,
                fbId:213,
                name:'emma',
                gender: 'woman',
                image: 'img/emma.jpg',
                events: [1, 2, 3]
            },
            {
                idx:3,
                fbId:312,
                name:'jennifer',
                gender: 'woman',
                image: 'img/jennifer.jpg',
                events: [1, 2, 3]
            }
        ];

        var users = [
            {
                idx:4,
                fbId:313,
                name:'kristen',
                gender: 'woman',
                image: 'img/kristen.jpg',
                events: [1, 2, 3]
            },
            {
                idx:5,
                fbId:314,
                name:'frieda',
                gender: 'woman',
                image: 'img/frieda.jpg',
                events: [1, 2, 3]
            },
            {
                idx:6,
                fbId:315,
                name:'olga',
                gender: 'woman',
                image: 'img/olga.jpg',
                events: [1, 2, 3]
            }
        ];

        return {
            nextCardIdx : nextCardIdx,
            initUsers: function () {
                return initUsers;
            },
            users: function () {
                return users;
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










