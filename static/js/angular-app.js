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
                query:  {method:'GET', isArray:true, transformResponse: function (data)
                    {
                        return angular.fromJson(data);
                    },
                },
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

['Log', 'User', 'ReportClass', 'VariableCat_1', 'VariableCat_2', 'VariableCat_3', 'VariableDef']
.forEach((urlobject)=>{
  app.controller(urlobject + 'Controller',['$scope', urlobject, function ($scope, resource) {
        $scope.get = function () {
            var res = resource.get({}, function() {
                $scope.data = res.data;
                if(urlobject==='Log') {
                    $scope.log = "";
                    $scope.data.forEach((item)=>{$scope.log += item.message + " @ " + item.timestamp + "\n"});
                };
            });
        };
        if(urlobject!=='Log'){
            $scope.query = function () {
                var res = resource.query({}, function() {
                    $scope.data = res;
                });
            };
        };
        $scope.selectitem = function (id) {
            $scope.selecteditem=id;
        }
  }]);
});

app.controller('scopeUpdater', function ($scope) {
    $scope.setVar = function (varName, x) {
        $scope[varName] = x;
    }
});
