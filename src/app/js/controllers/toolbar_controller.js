angular.module("app").controller('ToolbarController', function($scope, $rootScope, $http ,$timeout) { 
   
   	$scope.keyboardDisplay = false; 
   	$scope.nextKeyDisplay = false; 
   	$scope.speech = false; 

   	$scope.lang = ''; 
	$scope.langs = [];
	$scope.translation = null;

	$scope.langChooserOpened = false; 
	$scope.translationChooserOpened = false; 

	// Methods // 

	var loadLangList = function(){
		$rootScope.loadingMessage = 'Loading languages'; 
		return $http.get('data/dictionaries/list.json').then(function(response){
			$scope.langs = response.data; 
		});
	};

	var toggleKeyboardDisplay = function(value){
		if(typeof(value) !== 'undefined'){
			$scope.keyboardDisplay = value;
		}else{
			$scope.keyboardDisplay = !$scope.keyboardDisplay;
		}
		$rootScope.$broadcast('keyboardDisplayChanged', {'enabled': $scope.keyboardDisplay}); 
	};

	var toggleNextKeyDisplay = function(value){
		if(typeof(value) !== 'undefined'){
			$scope.nextKeyDisplay = value;
		}else{
			$scope.nextKeyDisplay = !$scope.nextKeyDisplay;
		}
		$rootScope.$broadcast('nextKeyDisplayChanged', {'enabled': $scope.nextKeyDisplay}); 
	};

	var toggleSpeech = function(value){
		if(typeof(value) !== 'undefined'){
			$scope.speech = value;
		}else{
			$scope.speech = !$scope.speech;
		}
		$rootScope.$broadcast('speechChanged', {'enabled': $scope.speech}); 		
	};

	var toggleLangChooser = function(){
		$scope.langChooserOpened = !$scope.langChooserOpened; 
	};

	var toggleTranslationChooser = function(){
		$scope.translationChooserOpened = !$scope.translationChooserOpened; 
	};

	var setLang = function(lang){
		$scope.lang = lang; 
		$rootScope.$broadcast('langChanged', {'lang': lang}); 
		$scope.langChooserOpened = false;
		if(lang.translations.length > 0){
			setTranslation(lang.translations[0]);
		}else{
			setTranslation(null);
		} 
	};

	var setTranslation = function(translation){
		$scope.translation = translation; 
		$rootScope.$broadcast('translationChanged', {'translation': translation}); 
		$scope.translationChooserOpened = false; 		
	};

	var newSession = function(){
		$rootScope.$broadcast('newSession');
	};

	// Scope // 

	$scope.toggleKeyboardDisplay = function(value){
		toggleKeyboardDisplay(value);
	};

	$scope.toggleNextKeyDisplay = function(value){
		toggleNextKeyDisplay(value);
	};

	$scope.toggleSpeech = function(value){
		toggleSpeech(value);
	};

	$scope.toggleLangChooser = function(){
		toggleLangChooser();
	};

	$scope.toggleTranslationChooser = function(){
		toggleTranslationChooser();
	};

	$scope.setLang = function(lang){
		setLang(lang);
	};

	$scope.setTranslation = function(translation){
		setTranslation(translation);
	};

	$scope.newSession = function(){
		newSession(); 
	};


	$timeout(function(){
		loadLangList().then(function(){
			toggleKeyboardDisplay(true);
			toggleNextKeyDisplay(true);
			setLang($scope.langs[0]); 
		});
	},300);

});



