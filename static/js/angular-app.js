var app = angular.module('PIR', ['ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ngRoute', 'chart.js', 'ngResource']);
var sort_by = function(field, reverse, primer){
   var key = primer ?
       function(x) {return primer(x[field])} :
       function(x) {return x[field]};
   reverse = !reverse ? 1 : -1;
   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     }
};

['User', 'ReportClass', 'VariableCat_1', 'VariableCat_2', 'VariableCat_3', 'VariableDef', 'vVariableDef']
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

['Log', 'User', 'ReportClass', 'VariableCat_1', 'VariableCat_2', 'VariableCat_3', 'VariableDef', 'vVariableDef']
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
        $scope.query = function (callback) {
            if(urlobject!=='Log'){
                $scope.registerSelected(urlobject, callback);
                var res = resource.query({}, function(data) {
                    if (urlobject !== 'User') {
                        $scope.data = res.sort(sort_by('code'));
                    } else {
                        $scope.data = res.sort(sort_by('lname'));
                    }
                    if (callback !== undefined) {
                        callback($scope.data);
                    }
                });
            };
        };
        $scope.isSelected = function (id) {
            return $scope.selectedHas(urlobject, id);
        };
        $scope.selectitem = function (id) {
            $scope.updateSelected(urlobject, id);
        };
  }]);
});

app.controller('selectController', function ($scope) {
    var selected = {};
    var callbacks = {};
    $scope.registerSelected = function(key, callback) {
        selected[key] = new Set();
        if (callback !== undefined) {
            callbacks[key] = callback;
        }
    }
    $scope.updateSelected = function(key, value) {
        if (selected[key].has(value)) {
            selected[key].delete(value);
        } else {
            selected[key].add(value);
        }
        for (key_ in callbacks) {
            callbacks[key_]();
        }
    }
    $scope.selectedHas = function(key, value) {
        return selected[key].has(value);
    }
    $scope.selectedIsEmpty = function(key) {
        return (selected[key].size === 0)
    }
    $scope.filter = function (item) {
        var show = true;
        var hasrelation = false;
        for (key in selected) {
            var _key = key.toLowerCase() + '_id';
            if (_key !== 'user_id') {
                if (!item.hasOwnProperty(_key)) {
                    continue;
                }
                hasrelation = true;
                show = show && (($scope.selectedIsEmpty(key)) || $scope.selectedHas(key, item[_key]));
            } else {
                for (many in item) {
                    if (many.substring(0, 5) === 'user_') {
                        hasrelation = true;
                        show = show && (($scope.selectedIsEmpty(key)) || $scope.selectedHas(key, item[many]));
                    }
                }
            }
        }
        return !hasrelation || show;
    };
});

app.controller('scopeUpdater', function ($scope) {
    $scope.setVar = function (varName, x) {
        $scope[varName] = x;
    }
});

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
