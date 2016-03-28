
angular.module('config')
  .config(function ($routeProvider, $httpProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $httpProvider.interceptors.push('AuthInterceptor');
    $routeProvider
      .when('/',{
        templateUrl: 'html/game.html',
        controller: 'GameController'
      })
      .when('/login',{
        templateUrl: 'html/login.html',
        controller: 'LoginController'
      })
      .when('/logout',{
        template: ' ',
        controller: 'LogoutController'
      })
      .when('/register',{
        templateUrl: 'html/register.html',
        controller: 'RegisterController'
      })
      .otherwise({
        template: "This doesn't exist!"
      });
  });