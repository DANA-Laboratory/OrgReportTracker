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
            return $resource(`/restful/${urlobject}/:where/:value`, {}, {
                get: {method: 'GET', cache: false, isArray: false},
                query: {method:'GET', isArray:true, transformResponse: function (data)
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
      return $resource(`/restful/${urlobject}/:where`, {}, {
          'get':    {method:'GET'},
          //'save':   {method:'POST'},
          //'query':  {method:'GET', isArray:true},
          //'remove': {method:'DELETE'},
          //'delete': {method:'DELETE'}
      });
    }]
  );
});
//controllers for resources
['Log', 'User', 'ReportClass', 'VariableCat_1', 'VariableCat_2', 'VariableCat_3', 'VariableDef', 'vVariableDef']
.forEach((urlobject)=>{
    app.controller(urlobject + 'Controller',['$scope', urlobject, function ($scope, resource) {
        const newitem = -2;
        $scope.init = function(handler) {
          handler();
          $scope.$on('eventUpdateSelected', handler);
        };
        $scope.get = function (where) {
            //console.log(where);
            var res = resource.get(where, function() {
                $scope.load(res);
            });
        };
        $scope.getlatestselectedhandler = function() {
            var _where = (urlobject === 'Log') ? $scope.getlatestselected('User') : $scope.getlatestselected(urlobject);
            if (_where >= 0) {
                var res = resource.get({where: _where}, function() {
                    if(urlobject === 'Log') {
                        $scope.log = '';
                        res.data.forEach((item)=>{$scope.log += item.message + " @ " + item.timestamp + "\n"});
                    } else {
                        //$scope.data = [res];
                        //console.log(res);
                        $scope.load(res);
                    };
                });
            }
        }
        $scope.query = function (where, callback) {
            if(urlobject!=='Log') {
                $scope.registerSelected(urlobject);
                var res = resource.query(where, function(data) {
                    if (urlobject !== 'User') {
                        $scope.data = res.sort(sort_by('code'));
                    } else {
                        $scope.data = res.sort(sort_by('lname'));
                    }
                    if (callback !== undefined) {
                        callback($scope.data);
                    }
                    /*
                    if ($scope.getlatestselected(urlobject) > -1) {
                        var i = 0;
                        while(data[i++].id !== $scope.getlatestselected(urlobject));
                        $scope.load(data[i-1]);
                    }
                    */
                });
            };
        };
        $scope.isSelected = function (id) {
            return $scope.selectedHas(urlobject, id);
        };
        $scope.selectitem = function (id) {
            $scope.updateSelected(urlobject, id);
        };
        $scope.load = function (item) {
            $scope.item = item;
            /*
            for (key in item) {
                if (item.hasOwnProperty(key)){
                    $scope[key] = item[key];
                }
            }
            */
        };
        $scope.addnew = function () {
            $scope.updateSelected(urlobject, newitem);
        }
    }]);
});

app.controller('selectController', function ($scope) {
    var selected = {};
    $scope.registerSelected = function(key) {
        if (!(key in selected)) {
          selected[key] = new Set();
        }
    }
    $scope.updateSelected = function(key, value) {
        if (selected[key].has(value)) {
            selected[key].delete(value);
        } else {
            selected[key].add(value);
        }
        /*
        for (key_ in callbacks) {
            callbacks[key_]();
        }
        */
        $scope.$broadcast("eventUpdateSelected", {key: key, value: value});
    }
    $scope.selectedHas = function(key, value) {
        return selected[key].has(value);
    }
    $scope.selectedIsEmpty = function(key) {
        return (selected[key].size === 0)
    }
    $scope.getlatestselected = (key) => {
      return ((key in selected) && selected[key].size>0) ? [...selected[key]][selected[key].size-1] : -1;
    };
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
