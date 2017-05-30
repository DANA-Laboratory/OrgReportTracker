var app = angular.module('PIR', ['ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ngRoute', 'chart.js', 'ngResource', 'btford.socket-io', 'angular-cache']);
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
//alter $rootScope, create cache
var resource_cache = undefined;
app.run(function($rootScope, CacheFactory) {
    //make a cache for resources
    //resource_cache = $cacheFactory('resource_cache');
    resource_cache = CacheFactory('resource_cache', {maxAge: 15 * 60 * 1000}); // Items added to this cache expire after 15 minutes.
    //load translation into rootScope
    $rootScope.fa = fa;
    //confirm method, will show #modalConfirm modal dialog
    $rootScope.confirm = (modalmessagekey, modalcallback) => {
      //called when confirm btn pressed
      $rootScope.modalcallback = modalcallback;
      $rootScope.modalmessage = modalmessagekey;
      if (!$('#modalConfirm').hasClass('show')) {
        $('#modalConfirm').modal('toggle');
      }
    };
});
//making a Socket Instance, inject it as *socketio*
app.factory('socketio', function (socketFactory) {
  return socketFactory();
});

['User', 'ReportClass', 'VariableCat_1', 'VariableCat_2', 'VariableCat_3', 'VariableDef', 'ReportClassVariable']
.forEach((urlobject)=>{
    app.factory(urlobject, ['$resource', 'socketio',
        function($resource, socketio) {
            //remove cache
            socketio.on(urlobject, function () {
              for (k of resource_cache.keys()) {
                  if (k.includes(`/restful/${urlobject}/`)) {
                      resource_cache.remove(k);
                  }
              };
            });
            return $resource(`/restful/${urlobject}/:where/:value`, {}, {
                get: {method: 'GET', cache: resource_cache, isArray: false},
                query: {method:'GET', cache: resource_cache, isArray:true, transformResponse: function (data)
                    {
                        //console.log(resource_cache.info())
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
//views a getter and query
['vVariableDef']
.forEach((urlobject)=>{
  app.factory(urlobject, ['$resource', 'socketio',
      function($resource, socketio) {
          //remove cache
          socketio.on(urlobject, function () {
            console.log('search keys for ', urlobject, resource_cache.keys());
            for (k of resource_cache.keys()) {
                if (k.includes(`/restful/${urlobject}/`) || (k === `/restful/${urlobject}`)) {
                    resource_cache.remove(k);
                    console.log(k, ' removed');
                }
            };
          });
          return $resource(`/restful/${urlobject}/:where/:value`, {}, {
              get: {method: 'GET', cache: resource_cache, isArray: false},
              query: {method:'GET', cache: resource_cache, isArray:true, transformResponse: function (data)
                  {
                      return angular.fromJson(data);
                  },
              },
          });
      }]
  );
});
//that only need getter
['Log']
.forEach((urlobject)=>{
  app.factory(urlobject, ['$resource',
    function($resource) {
      return $resource(`/restful/${urlobject}/:where`, {}, {
          'get':    {method:'GET', cache: false},
      });
    }]
  );
});
