angular.module("app").controller('StatisticsController', function($element, $scope, $rootScope, $timeout, StatisticsStorageService, SpeechSynthesisService, $templateCache, $compile) { 
    
 	$scope.lang = null;
   	$scope.translation = null;	

	$scope.statistics = null; 
	$scope.statisticsDisplay = false;

	$scope.speak = SpeechSynthesisService.speak; 

	// Methods // 


	var processStatistics = function(stats){
		var keys = []; 
		var words = [];

		var goodKeys = 0;
		var badKeys = 0; 
		var goodWords = 0;
		var badWords = 0;

		_.each(stats.keys, function(item, key){
			var mistyped = []; 
			_.each(item.mistyped, function(_item, _key){
				mistyped.push({key: _key, counter: _item});
			});
			item.mistyped = mistyped; 
			keys.push(_.extend({
				key: key
			}, item)); 
		});		

		_.each(stats.words, function(item, word){
			var mistyped = []; 
			_.each(item.mistyped, function(_item, _key){
				mistyped.push({word: _key, counter: _item});
			});
			item.mistyped = mistyped; 			
			words.push(_.extend({
				word: word
			}, item)); 
		});		

		_.each(keys, function(item, key){
			goodKeys += item.goods;
			keys[key].bads = 0; 
			_.each(item.mistyped, function(mistyped){
				keys[key].bads += mistyped.counter; 
				badKeys += mistyped.counter;
			});
			keys[key].total = keys[key].bads + keys[key].goods;
			keys[key].rate = keys[key].goods / keys[key].total;
		});
		_.each(words, function(item, key){
			goodWords += item.goods;
			words[key].bads = 0; 
			_.each(item.mistyped, function(mistyped){
				words[key].bads += mistyped.counter; 
				badWords += mistyped.counter;
			});
			words[key].total = words[key].bads + words[key].goods;
			words[key].rate = words[key].goods / words[key].total;
		});

		statistics = {
			"goodKeys" 		: goodKeys,
			"badKeys"  		: badKeys, 
			"totalKeys"		: goodKeys + badKeys,

			"goodWords"		: goodWords,
			"badWords" 		: badWords,
			"totalWords"	: goodWords + badWords,

			"keys"			: keys,
			"words"			: words,
		};

		if(statistics.totalKeys > 0 || statistics.totalWords > 0){
			$scope.statistics = statistics;
			StatisticsStorageService.setData(statistics);
			$timeout(function(){
				$scope.statisticsDisplay = true;
				showStatisticsPopup(); 
			},100);


		}
		
	};

   	var setLang = function(lang){
  		$scope.lang = lang;
	};

   	var setTranslation = function(translation){
      	$scope.translation = translation;
   	};

	var showStatisticsPopup = function(){
		var html = $element[0].querySelector('.statisticsPopup').innerHTML; 
		swal({
			html: html,
			width: '700px'
		});
	};

	$scope.showStatisticsPopup = showStatisticsPopup; 

   // Event Listeners //

	$rootScope.$on('langChanged', function(event, data){
		setLang(data.lang);  
	});

	$rootScope.$on('translationChanged', function(event, data){
		setTranslation(data.translation);  
	});

    $rootScope.$on('hideStatistics', function(event, data){
    	$scope.statisticsDisplay = false;
      
    });	

    $rootScope.$on('statisticsUpdated', function(event, data){
      	processStatistics(data.statistics);
    	//processStatistics({"keys":{"r":{"mistyped":{},"goods":7},"i":{"mistyped":{"g":1,"i":2},"goods":10},"l":{"mistyped":{"n":1,"a":2},"goods":4},"e":{"mistyped":{"n":1,"t":1},"goods":16},"n":{"mistyped":{"c":1,"a":1,"t":2,"n":1,"m":1},"goods":8},"m":{"mistyped":{"o":2},"goods":5},"t":{"mistyped":{"u":2},"goods":15},"u":{"mistyped":{"t":1},"goods":2},"s":{"mistyped":{"s":1},"goods":7},"o":{"mistyped":{"o":2},"goods":15},"g":{"mistyped":{"e":1},"goods":6},"a":{"mistyped":{"r":2,"a":1},"goods":18},"x":{"mistyped":{"i":1},"goods":0},"c":{"mistyped":{"y":1,"v":1},"goods":3},"q":{"mistyped":{},"goods":1},"f":{"mistyped":{},"goods":2},"h":{"mistyped":{"c":2},"goods":3},"undefined":{"mistyped":{"h":1},"goods":0},"w":{"mistyped":{},"goods":1},"p":{"mistyped":{"e":1},"goods":3},"v":{"mistyped":{"c":2},"goods":0},"d":{"mistyped":{},"goods":2}},"words":{"rail":{"mistyped":{},"goods":1},"keen":{"mistyped":{},"goods":1},"impetus":{"mistyped":{"impeuts":1},"goods":0},"congeal":{"mistyped":{},"goods":1},"omniscient":{"mistyped":{},"goods":1},"exigency":{"mistyped":{"eigency":1},"goods":0},"stock":{"mistyped":{"stoc":1},"goods":0},"cant":{"mistyped":{},"goods":1},"stentorian":{"mistyped":{},"goods":1},"quaff":{"mistyped":{},"goods":1},"stanch":{"mistyped":{"stranch":1},"goods":0},"whittle":{"mistyped":{},"goods":1},"sonorous":{"mistyped":{},"goods":1},"parochial":{"mistyped":{"parochian":1},"goods":0},"range":{"mistyped":{},"goods":1},"importunate":{"mistyped":{"importunate p":1},"goods":0},"petulant":{"mistyped":{"etulant":1},"goods":0},"invocation":{"mistyped":{"incovation":1},"goods":0},"bane":{"mistyped":{},"goods":1},"contempt":{"mistyped":{},"goods":1},"headlong":{"mistyped":{},"goods":1},"armada":{"mistyped":{},"goods":1},"sanction":{"mistyped":{},"goods":1},"crew":{"mistyped":{},"goods":0}}});
    });



});




