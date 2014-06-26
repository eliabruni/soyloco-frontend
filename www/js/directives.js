angular.module('soyloco.directives', [])

    .directive('noScroll', function($document) {

        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {

                $document.on('touchmove', function(e) {
                    e.preventDefault();
                });
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

        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {
                var starty = $scope.$eval($attr.headerShrink) || 0;
                var shrinkAmt;

                var header = $document[0].body.querySelector('.map');
                var headerHeight = header.offsetHeight;

                $element.bind('scroll', function(e) {
                    if(e.detail.scrollTop > starty) {
                        // Start shrinking
                        shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - e.detail.scrollTop);
                        shrink(header, $element[0], shrinkAmt, headerHeight);
                    } else {
                        shrink(header, $element[0], 0, headerHeight);
                    }
                });
            }
        }
    })

