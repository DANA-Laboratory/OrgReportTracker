angular.module('PIR').config(function($routeProvider) {
  $routeProvider
    .when("/pi", {
        templateUrl : 'all.pug'
    })
    .when("/report", {
        templateUrl : 'all.pug'
    })
    .when("/variables", {
        templateUrl : 'all.pug'
    })
    .otherwise({
        templateUrl : 'all.pug'
    });
});
