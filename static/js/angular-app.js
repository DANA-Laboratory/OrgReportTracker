var app = angular.module('PIR', ['ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ngRoute', 'chart.js', 'ngResource', 'btford.socket-io']);
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
['User', 'ReportClass', 'VariableCat_1', 'VariableCat_2', 'VariableCat_3', 'VariableDef', 'ReportClassVariable']
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

['vVariableDef']
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
      });
    }]
  );
});
//confirm method, will show #modalConfirm modal dialog
app.run(function($rootScope) {
    //load translation into rootScope
    $rootScope.fa = fa;
    $rootScope.confirm = (modalmessagekey, modalcallback) => {
      //called when confirm btn pressed
      $rootScope.modalcallback = modalcallback;
      $rootScope.modalmessage = modalmessagekey;
      if (!$('#modalConfirm').hasClass('show')) {
        $('#modalConfirm').modal('toggle');
      }
    };
});
//making a Socket Instance
app.factory('socketio', function (socketFactory) {
  return socketFactory();
});
app.controller('scopeUpdater', function ($scope) {
    $scope.setVar = function (varName, x) {
        $scope[varName] = x;
    }
});
