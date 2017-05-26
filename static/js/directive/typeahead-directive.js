angular.module('PIR').directive('typeaheadDirective', ['User', 'VariableCat_1', 'VariableCat_2', 'VariableCat_3' , 'ReportClass', function (resUser, resCat1, resCat2, resCat3, resReport) {
   return {
     restrict: 'A',
     link: function (scope, el, attrs) {
       var options = {
         hint: true,
         highlight: true,
         minLength: 0
       };
       var rowsource = attrs.rowsource;
       var resource = null;
       if (rowsource == 'User') {
         resource = resUser;
         var rowItem = (item)=>{return (item.lname + ' ' + item.fname + ' ' + item.pcode)};
       }
       if (rowsource == 'VariableCat_1') {
         resource = resCat1;
         var rowItem = (item)=>{return (item.caption)};
       }
       if (rowsource == 'VariableCat_2') {
         resource = resCat2;
         var rowItem = (item)=>{return (item.caption)};
       }
       if (rowsource == 'VariableCat_3') {
         resource = resCat3;
         var rowItem = (item)=>{return (item.caption)};
       }
       if (rowsource == 'ReportClass') {
         resource = resReport;
         var rowItem = (item)=>{return (item.caption)};
       }
       if (resource !== null) {
         var rec = resource.query({}, function(data) {
           var source = [];
           data.forEach((item)=>{source.push(rowItem(item))});
           var rec = resource.query({}, function(data) {
             el.typeahead(
             options,
             {
               name: rowsource,
               source: substringMatcher(source)
             });
             if(attrs.bind) {
               if((scope.item[attrs.bind] >= 0)) {
                  var selectid = (id) => {
                    var current = data.filter((item)=>{return (item.id === id)})[0];
                    if(current !== undefined) {
                      el.typeahead('val', rowItem(current));
                    } else {
                      console.log('no current value');
                    }
                  }
                  selectid(scope.item[attrs.bind]);
                  //select into typeahead when item updates
                  scope.$watch(function(scope) { return scope.item[attrs.bind] },
                    function() {selectid(scope.item[attrs.bind])}
                  );
               }
               el.bind('typeahead:select', function(ev, suggestion) {
                 scope.item[attrs.bind] = data[source.indexOf(suggestion)].id;
               });
               el.blur(()=>{
                 if(source.indexOf(el.val()) === -1) {
                   console.log(fa["Error : element not in list!"]);
                 }
               });
             }
           });
         });
       } else {
         el.typeahead(
         options,
         {
           name: rowsource,
           source: substringMatcher(fa[rowsource])
         });
         //must set value property of typeahead if not
         el.blur(()=>{
           if(el.val().length==0) {
              var val = scope.item[(attrs.ngModel).split('.')[1]];
              if (val.length>0) {
                el.typeahead('val', val);
              }
           }
         });
      }
   }
 };
}])
