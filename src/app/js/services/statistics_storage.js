angular.module("app").service('StatisticsStorageService', function() { 	
	
	var data; 

	this.setData = function(_data){
		this.data = _data; 
	};

	this.getData = function(){
		return data; 
	};

});


