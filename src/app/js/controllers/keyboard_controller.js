angular.module("app").controller('KeyboardController', function($scope, $rootScope, $timeout, $http) { 
  
  
    $scope.keyboardDisplay = true; 
    $scope.nextKeyDisplay = true; 
    $scope.layout = [
      ["blank-2","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12"],
      ["blank-4","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-10"],
      ["blank-14","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12","blank-12", "blank-12-space"]
    ];

    // Methods // 

    var setNextKey = function(key){
      $scope.nextKey = key;
    };

    var pressedKeyTimeout; 
    var setPressedKey = function(key){
      $timeout.cancel(pressedKeyTimeout);
      $scope.pressedKey = key;
      if(key !== null){
        pressedKeyTimeout = $timeout(function(){ setPressedKey(null); },100);
      }
    };

    var errorKeyTimeout; 
    var setErrorKey = function(key){
      $timeout.cancel(errorKeyTimeout);
      $scope.errorKey = key;
      if(key !== null){
        errorKeyTimeout = $timeout(function(){ setErrorKey(null); },100);
      }
    };

    var setLayout = function(lang){
      $rootScope.loadingMessage = 'Loading keyboard layout'; 
      return $http.get('data/layouts/'+lang.id+'.json').then(function(response){
        $scope.layout = response.data; 
      });      
    };

    // Event listeners //

    $rootScope.$on('keyboardDisplayChanged', function(event, data){
      $scope.keyboardDisplay = data.enabled; 
    });

    $rootScope.$on('nextKeyDisplayChanged', function(event, data){
      $scope.nextKeyDisplay = data.enabled;
    });

    $rootScope.$on('langChanged', function(event, data){
      setLayout(data.lang);  
    });

    $rootScope.$on('keyboardSetNextKey', function(event, data){
      setNextKey(data.key); 
    });

    $rootScope.$on('keyboardSetPressedKey', function(event, data){
      setPressedKey(data.key); 
    });
    
    $rootScope.$on('keyboardSetErrorKey', function(event, data){
      setErrorKey(data.key); 
    });


});



