var app = angular.module('PIR', ['ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ngRoute', 'chart.js', 'ui.bootstrap', 'ngResource']);
app.directive("searchresult", function() {
    return {
        link: function(scope, el, attrs) {
          if(scope.results === undefined) {
            scope.results = {};
          }
          scope.results[attrs.searchQuery] = [
            {
              text: attrs.searchQuery
            },
            {
              text: attrs.searchQuery
            }
          ]
        }
    };
});

['User', 'ReportClass', 'VariableCat_1', 'VariableCat_2', 'VariableCat_3', 'VariableDef', 'Report', 'Variable', 'ReportVariable', 'Attachement', 'Value', 'Target', 'Message']
.forEach((urlobject)=>{
  app.factory(urlobject, ['$resource',
    function($resource) {
      return $resource(`/restful/${urlobject}`, {}, {
        get: {method: 'GET', cache: false, isArray: false},
        save: {method: 'POST', cache: false, isArray: false},
        update: {method: 'PUT', cache: false, isArray: false},
        delete: {method: 'DELETE', cache: false, isArray: false}
      });
    }]
  );
});

['Log']
.forEach((urlobject)=>{
  app.factory(urlobject, ['$resource',
    function($resource) {
      return $resource(`/restful/${urlobject}`, {}, {
          'get':    {method:'GET'},
          //'save':   {method:'POST'},
          //'query':  {method:'GET', isArray:true},
          //'remove': {method:'DELETE'},
          //'delete': {method:'DELETE'}
      });
    }]
  );
});

['Log']
.forEach((urlobject)=>{
  app.controller(urlobject + 'Controller',['$scope', urlobject, function ($scope, resource) {
      if(urlobject==='Log'){
          $scope.get = function () {
              var res = resource.get({}, function() {
                  $scope.data = res.data;
                  $scope.log = "";
                  $scope.data.forEach((item)=>{$scope.log += item.message + " @ " + item.timestamp + "\n"});
              });
          };
      };
  }]);
});

app.controller('scopeUpdater', function ($scope) {
    $scope.setVar = function (varName, x) {
        $scope[varName] = x;
    }
});
