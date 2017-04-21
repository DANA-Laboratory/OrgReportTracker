angular.module('PIR').config(function($routeProvider) {
  $routeProvider
    .when("/pi", {
        templateUrl : 'forms/pi.pug'
    })
    .when("/report", {
        templateUrl : 'forms/pi.pug'
    })
    .when("/desktop", {
        templateUrl : 'forms/desktop.pug'
    })
    .otherwise({
        templateUrl : 'all.pug'
    });
});
