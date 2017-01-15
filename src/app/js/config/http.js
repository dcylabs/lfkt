angular.module("app").config(function($httpProvider) {
	$httpProvider.interceptors.push(function($q, $rootScope){
		$rootScope.loading = 0;
		return{
			'request': function(config){
				$rootScope.loading++;
				return config;
			},
			'requestError': function(rejection){
				$rootScope.loading--;
				return rejection; 
			},				
			'response': function(response){
				$rootScope.loading--;
				return response; 
			},
			'responseError': function(rejection){
				$rootScope.loading--;
				return rejection; 
			}		
		};
	});
});