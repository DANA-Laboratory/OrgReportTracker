angular.module('PIR').config(function($routeProvider) {
  $routeProvider
    .when("/report", {
        templateUrl : 'panels/openreport.pug'
    })
    .otherwise({
        templateUrl : 'old.pug'
    });
});
