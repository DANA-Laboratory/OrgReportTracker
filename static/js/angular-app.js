var sort_by = function(field, reverse, primer){
   var key = primer ?
       function(x) {return primer(x[field])} :
       function(x) {return x[field]};
   reverse = !reverse ? 1 : -1;
   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     }
}
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
        $scope.query = function () {
            if(urlobject!=='Log'){
                var res = resource.query({}, function() {
                    if (urlobject!=='User') {
                        $scope.data = res.sort(sort_by('code'));
                    } else {
                        $scope.data = res.sort(sort_by('lname'));
                    }
                });
            };
        };
        $scope.selectitem = function (id) {
            if ($scope.selecteditem != id) {
                $scope.selecteditem = id;
                $scope.selected[urlobject] = id;
            } else {
                $scope.selecteditem = -1;
                $scope.selected[urlobject] = -1;
            }
        }
        $scope.filter = function (item) {
            var show = true;
            for (key in $scope.selected) {
                let _key = key.toLowerCase() + '_id';
                if (!item.hasOwnProperty(_key)) {
                    continue;
                }
                if (item.hasOwnProperty(_key)) {
                    show = show && ($scope.selected[key] == -1 || item[_key] == $scope.selected[key])
                }
            }
            return show;
        }
  }]);
});

app.controller('selectController', function ($scope) {
    $scope.selected = {};
});

app.controller('scopeUpdater', function ($scope) {
    $scope.setVar = function (varName, x) {
        $scope[varName] = x;
    }
});
