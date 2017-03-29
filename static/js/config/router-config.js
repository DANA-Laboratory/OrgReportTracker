angular.module('PIR').config(function($routeProvider) {
  $routeProvider
    .when("/pi", {
        templateUrl : 'panels/pi.pug'
    })
    .when("/report", {
        templateUrl : 'panels/openreport.pug'
    })
    .when("/variables", {
        templateUrl : 'panels/variables.pug'
    })
    .otherwise({
        templateUrl : 'old.pug'
    });
});
