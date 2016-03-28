angular.module('auth.services')
  .service('AuthInterceptor', function ($injector, $location) {
    var AuthInterceptor = {
      request: function (config) {
        var Auth = $injector.get('Auth');
        var token = Auth.getToken();
        if (token) {
          config.headers['AUTH_TOKEN'] = token;
        }
        return config;
      },
      responseError: function (response) {
        console.log('403');
        if (response.status === 403) {
            $location.path('/login');
        }
        return response;
      }
    };
    return AuthInterceptor;
  })
  .service('Auth', function ($http, $location, $q, $window) {
    var Auth = {
      isLogined: function(){
        return Auth.getToken() == '';
      },
      getToken: function () {
        return $window.localStorage.getItem('token');
      },
      setToken: function (token) {
        $window.localStorage.setItem('token', token);
      },
      deleteToken: function () {
        $window.localStorage.removeItem('token');
      },
      login: function (email, password) {
        var deferred = $q.defer();
        $http.post('/rest/users/login', {
          email: email, 
          password: password
        }).success(function (response, status, headers, config) {
          if (response && response.errors == undefined) {
            Auth.setToken(response);
            deferred.resolve(response, status, headers, config);
          } else {
            deferred.reject(response, status, headers, config);
          }
        }).error(function (response, status, headers, config) {
          deferred.reject(response, status, headers, config);
        });
        return deferred.promise;
      },
      logout: function () {
        Auth.deleteToken();
      },
      register: function (email, password) {
        var deferred = $q.defer();
        $http.post('/rest/users/register', {
          email: email,
          password: password
        }).success(function (response, status, headers, config) {
          if (response && response.errors == undefined) {
            Auth.setToken(response);
            deferred.resolve(response, status, headers, config);
          } else {
            deferred.reject(response, status, headers, config);
          }
        }).error(function (response, status, headers, config) {
          deferred.reject(response, status, headers, config);
        });
        return deferred.promise;
      }
    };
    return Auth;
  });