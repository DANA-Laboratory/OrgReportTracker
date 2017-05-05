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
//twitter-typeahead
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
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
            var res = resource.get(where, function() {
                $scope.load(res);
            });
        };
        $scope.getlatestselectedhandler = function() {
            var _where = (urlobject === 'Log') ? $scope.getlatestselected('User') : $scope.getlatestselected(urlobject);
            if (_where >= 0) {
                var res = resource.get({where: _where}, function() {
                    if(urlobject === 'Log') {
                        $scope.item = {};
                        $scope.item.log = '';
                        res.data.forEach((item)=>{$scope.item.log += item.message + " @ " + item.timestamp + "\n"});
                    } else {
                        $scope.load(res);
                    };
                });
            } else if (_where == newitem) {
                $scope.load({});
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
            if (value !== -2) {
                selected[key].delete(-2);
            }
        }
        $scope.$broadcast("eventUpdateSelected", {key: key, value: value});
    }
    $scope.selectedHas = function(key, value) {
        return selected[key].has(value);
    }
    $scope.selectedIsEmpty = function(key) {
        if ($scope.selectedHas(key, -2)) {
          return (selected[key].size === 1)
        } else {
          return (selected[key].size === 0)
        }
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

app.directive('typeaheadDirective', ['User', function (resource) {
   return {
     restrict: 'A',
     link: function (scope, el, attrs) {
       var options = {
         hint: true,
         highlight: true,
         minLength: 1
       };
       if (attrs.id == 'users') {
         var rec = resource.query({}, function(data) {
           var source = [];
           data.forEach((item)=>{source.push(item.lname + ' ' + item.fname + ' ' + item.pcode)});
           var rec = resource.query({}, function(data) {
             $(`#${attrs.id} .typeahead`).typeahead(
             options,
             {
               name: attrs.id,
               source: substringMatcher(source)
             });
             $(`#${attrs.id} .typeahead`).bind('typeahead:select', function(ev, suggestion) {
               scope[attrs.bind] = data[source.indexOf(suggestion)].id;
               console.log(scope.test);
             });
           });
         });
       } else {
         $(`#${attrs.id} .typeahead`).typeahead(
         options,
         {
           name: attrs.id,
           source: substringMatcher(fa[attrs.id])
         });
      }
   }
 };
}])
