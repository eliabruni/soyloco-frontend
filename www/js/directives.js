angular.module('splash.directives', [])

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

    .directive('scroll', function($document) {

        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {

                $document.unbind('touchmove');

            }
        }
    })