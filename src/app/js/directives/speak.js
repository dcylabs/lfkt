angular.module('app').directive('speak', function (SpeechSynthesisService) {
    return {
        restrict: 'A',
        scope: {
        	'speak': '@'
        },
        link: function (scope, element, attrs) {
        	element.attr('onclick', 'speak("'+scope.speak+'")'); 
        }
    };
});