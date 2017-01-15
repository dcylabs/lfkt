angular.module("app").controller('LearnController', function($scope, $rootScope, $http, $timeout, SpeechSynthesisService)  { 


   // Vars // 
   var COUNTDOWN_DURATION = 60;
   var dictionary = {}; 
 

   $scope.lang = null;
   $scope.translation = null;

   $scope.input = '';
   $scope.wordList = []; 

   $scope.valid = false;

   // Countdown // 

   var counter = 0; 
   var timeout; 
   $scope.counter = counter; 

   var getKey = function(event){
      if(typeof(event.key) !== 'undefined'){
         return event.key; 
      }
      if(typeof(event.keyIdentifier) !== 'undefined'){
         if(event.keyIdentifier.slice(0,2) === 'U+'){
            return String.fromCharCode(parseInt(event.keyIdentifier.slice(2,6),16));
         }
         return event.keyIdentifier; 
      }
   };

   var resetCounter = function(){
      counter = COUNTDOWN_DURATION; 
      $scope.counter = counter;
      finishCountdown(); 
   };

   var countdown = function(){
      timeout = $timeout(function(){
         counter = (counter - 0.01).toFixed(2);
         $scope.counter = counter;
         if(counter <= 0){
            finishCountdown(); 
         }else{
            countdown(); 
         }
      },10);
   };

   var finishCountdown = function(){
      $timeout.cancel(timeout);
      $rootScope.$broadcast('statisticsUpdated', {'statistics': statistics}); 
   };

   // Statistics // 

   var statistics = {}; 
   var resetStatistics = function(){
      statistics = {
         "keys" : {},
         "words" : {}
      };
   };

   var registerKey = function(key){
      if(typeof(statistics.keys[key]) === 'undefined'){
         statistics.keys[key] = {
            "mistyped": {}, 
            "goods" : 0
         };
      }
   };
   
   var registerWord = function(word){
      if(typeof(statistics.words[word.word]) === 'undefined'){
         statistics.words[word.word] = {
            "mistyped": {}, 
            "goods" : 0,
            "definition": word
         };
      }
   };

   var registerGoodtypedKey = function(key){
      if(['', null, undefined].indexOf(key) !== -1 || counter <= 0){ return; }
      registerKey(key); 
      statistics.keys[key].goods++;
   };

   var registerMistypedKey = function(expectedKey, pressedKey){
      if(['', null, undefined].indexOf(pressedKey) !== -1 || counter <= 0){ return; }
      registerKey(expectedKey); 
      statistics.keys[expectedKey].mistyped[pressedKey] =  ( statistics.keys[expectedKey].mistyped[pressedKey] || 0 ) + 1 ; 
   };

   var registerGoodtypedWord = function(expectedWord){
      if([null, undefined].indexOf(expectedWord.word) !== -1 || counter <= 0){ return; }
      registerWord(expectedWord); 
      statistics.words[expectedWord.word].goods++;
   };

   var registerMistypedWord = function(expectedWord, typedWord){
      if([null, undefined].indexOf(expectedWord.word) !== -1 || counter <= 0){ return; }
      registerWord(expectedWord); 
      statistics.words[expectedWord.word].mistyped[typedWord] = ( statistics.words[expectedWord.word].mistyped[typedWord] || 0 ) + 1 ;
   };

   var hideStatistics = function(){
      $rootScope.$broadcast('hideStatistics', {});
   };
   

   // Methods // 

   var setLang = function(lang){
      $scope.lang = lang;
      $rootScope.loadingMessage = 'Loading dictionary'; 
      return $http.get('data/dictionaries/'+$scope.lang.id+'.json').then(function(response){
        dictionary = response.data; 
        newSession();
      });        
   };
 

   var getRandomWord = function(){
      return dictionary[Math.floor(Math.random()*dictionary.length)];
   };

   var setTranslation = function(translation){
      $scope.translation = translation;
   };

   var setNextKey = function(key){
      $rootScope.$broadcast('keyboardSetNextKey', {key: key});
   };

   var setPressedKey = function(key){
      registerGoodtypedKey(key);
      $rootScope.$broadcast('keyboardSetPressedKey', {key: key});
   };

   var setErrorKey = function(key, expectedKey){
      // handling case when we types more than the word length 
      if(typeof(expectedKey) !== 'undefined'){
         registerMistypedKey(expectedKey, key);
      }
      $rootScope.$broadcast('keyboardSetErrorKey', {key: key});
   };      

   var wordComplete = function(typedWord, expectedWord){
      resetInput(); 
      if(typedWord.toLowerCase().trim() === expectedWord.word.toLowerCase().trim()){
         registerGoodtypedWord(expectedWord); 
      }else{
         registerMistypedWord(expectedWord, typedWord); 
      }
      $scope.wordList.shift(); 
      $scope.wordList.push(getRandomWord()); 
      $scope.$broadcast('wordListChanged');
   };

   var onKeyDown = function(event){
      var newInputValue = $scope.input; 
      var expectedWord =  $scope.wordList[0];

      if([' ','Enter'].indexOf(getKey(event)) !== -1){
         wordComplete(newInputValue, expectedWord);
      }      
   };

   var onKeyUp = function(event){

      // Resetting next key help
      setNextKey(null);
      setPressedKey(null);
      setErrorKey(null);


      // Starting counter 
      if(_.isEmpty(statistics.keys) && counter === COUNTDOWN_DURATION && getKey(event).length > 0){
         countdown();
      }

      // Typing logic 
      var expectedWord = $scope.wordList[0].word;
      expectedWord = expectedWord.toLowerCase();
      var newInputValue = $scope.input.toLowerCase().trim(); 

      // Calculating expected character 
      var isValid = true;
      if(newInputValue.length > expectedWord.length){
         isValid = false;
      }else{
         for(var i = 0; i < Math.min(expectedWord.length, newInputValue.length); i++){
            if(expectedWord[i] !== newInputValue[i]){
               isValid = false;
               break;
            }
         }
      }
      $scope.isValid = isValid; 

      // Result treatment
      if(isValid && newInputValue.length < expectedWord.length){
         setNextKey(expectedWord[newInputValue.length]);
      }else{
         setNextKey(null);
      }
      
      if(getKey(event).length === 1){
         var pressedKey = newInputValue[newInputValue.length - 1]; 
         var expectedKey = expectedWord[newInputValue.length - 1];
         if(isValid){
            setPressedKey(pressedKey);   
         }else{
            setErrorKey(pressedKey, expectedKey);   
         }
      }

   };

   var resetInput = function(){
      $scope.input = ''; 
      onKeyUp({key:''});
   };


   var newSession = function(){

      // load 20 words in memory 
      $scope.wordList = []; 
      for(var i = 0; i < 6; i++){
         $scope.wordList.push(getRandomWord()); 
      }

      resetStatistics(); 
      resetCounter();
      hideStatistics();
      resetInput(); 
      $scope.$broadcast('wordListChanged');

   };

   // Scope // 
   $scope.keyDown = function(event){
      onKeyDown(event);    
   }; 

   $scope.keyUp = function(event){
      onKeyUp(event);    
   }; 


   // Event Listeners //

   $rootScope.$on('langChanged', function(event, data){
      setLang(data.lang);  
   });



   $rootScope.$on('translationChanged', function(event, data){
      setTranslation(data.translation);  
   });

   $rootScope.$on('newSession', function(event, data){
      newSession();    
   });   

   $scope.$on('wordListChanged', function(event, data){

      var word = $scope.wordList[0].word; 
      SpeechSynthesisService.speak(word); 

   });




});



