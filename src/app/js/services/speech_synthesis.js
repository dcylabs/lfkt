angular.module("app").service('SpeechSynthesisService', function($rootScope) { 	
	
	var lang; 
	var speech = false; 

	var setLang = function(_lang){
		lang = _lang; 
		updateSpeechVoice();
	}; 

	var setSpeech = function(_speech){
		speech = _speech; 
	};

	$rootScope.$on('langChanged', function(event, data){
	  setLang(data.lang);  
	});

   $rootScope.$on('speechChanged', function(event, data){
      setSpeech(data.enabled);  
   });

	var speechVoice = null;
	var updateSpeechVoice = function(){
		if(lang === null){ return; }
		speechVoice = null; 
		var voices = window.speechSynthesis.getVoices();
		if(voices.length < 1){ return; }
		var voice = voices.filter(function(voice) { return voice.lang == lang.voice; });
		if(voice.length < 1){ return; }
		speechVoice = voice[0]; 
	};

	var speak = function(text){
		if(speech === false){ return; }
		if(speechVoice === null){ return; }
		var msg = new SpeechSynthesisUtterance(text);
		msg.voice = speechVoice;
		window.speechSynthesis.speak(msg);
	};

	window.speechSynthesis.onvoiceschanged = function() {
		updateSpeechVoice();
	}; 

	this.speak = window.speak = speak; 

});


