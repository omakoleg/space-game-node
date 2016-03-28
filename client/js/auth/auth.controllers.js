angular.module('auth.controllers')
.controller('LogoutController', function(Auth, $location){
  Auth.logout();
  $location.path('/login');
})
.controller('LoginController', function(Auth, $location, $scope){
  $scope.login = function(isValid){
    if(isValid){
      Auth.login($scope.email, $scope.password)
      .then(function(){
        $location.path('/');
      }, function(data){
        $scope.error = data.errors;
      });
    }
  }
})
.controller('RegisterController', function(Auth, $location, $scope){
  $scope.register = function(isValid){
    if(isValid){    
      Auth.register($scope.email, $scope.password)
      .then(function(){
        $location.path('/');
        // $window.location = '/projects';
      }, function(data){
        $scope.errors = data.errors;
      });
    }
  }
});