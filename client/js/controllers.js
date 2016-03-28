angular.module('controllers')
.controller('GameController', function(Auth, $scope, $http, $filter, $parse, $location){
  console.log('www', Auth.getToken());
  if(!Auth.isLogined()){
    $location.path('/login');
    console.log('go');
  }
});