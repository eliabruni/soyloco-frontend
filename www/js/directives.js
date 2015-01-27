angular.module('splash.directives', [])

    .directive('noScroll', function($document) {

        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {

                $document.bind('touchmove', function(e) {
                    e.preventDefault();
                });
                /*$document.on('touchmove', function(e) {
                    e.preventDefault();
                });*/
            }
        }
    })

<<<<<<< HEAD
    .directive('scroll', function($document) {
=======

    .directive('scroll', function($document) {

        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {

                $document.unbind('touchmove');

            }
        }
    })


    .directive('headerShrink', function($document) {
        var shrink = function(header, content, amt, max) {
            amt = Math.min(500, amt);

            ionic.requestAnimationFrame(function() {
                header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, +' + amt + 'px, 0)';

            });
        };
>>>>>>> nightly

        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {

                $document.unbind('touchmove');

            }
        }
    })