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

    .directive('backImg', function($localstorage){
        return function(scope, element, attrs){
            var url = attrs.backImg;
            var content = element.find('a');
            content.css({
                'background': 'url(' + url +')',
                'height' : ($localstorage.getObject('screenWidth') * 0.9) + "px",
                'width' : ($localstorage.getObject('screenWidth') * 0.96) + "px",
                '-webkit-border-radius': '4px',
                '-moz-border-radius': '4px',
                '-ms-border-radius': '4px',
                '-o-border-radius': '4px',
                'border-radius': '4px'
            });
        };
    });
