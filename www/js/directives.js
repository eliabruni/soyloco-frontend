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

    .directive('backImg', function($rootScope){
        return function(scope, element, attrs){
            var url = attrs.backImg;
            var content = element.find('a');
            content.css({
                'background': 'url(' + url +')',
                'height' : ($rootScope.width * 0.9) + "px",
                'width' : ($rootScope.width * 0.96) + "px",
                '-webkit-border-radius': '4px',
                '-moz-border-radius': '4px',
                '-ms-border-radius': '4px',
                '-o-border-radius': '4px',
                'border-radius': '4px'
            });
        };
    });
