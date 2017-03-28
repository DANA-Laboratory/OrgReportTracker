angular.module('PIR').config(function($routeProvider) {
  $routeProvider
    .when("/pi", {
        templateUrl : 'panels/pi.pug'
    })
    .when("/report", {
        templateUrl : 'panels/openreport.pug'
    })
    .when("/tree", {
        templateUrl : 'tree.pug'
    })
    .otherwise({
        templateUrl : 'old.pug'
    });
});
