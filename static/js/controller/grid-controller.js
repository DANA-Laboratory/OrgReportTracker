var fa={}
fa['PI'] = 'شاخص'
fa['PI real'] = 'دستاورد'
fa['PI target'] = 'هدف'
fa['Edit Time'] = 'زمان ویرایش'
fa['Upper Limit'] = 'حد بالا'
fa['Lower Limit'] = 'حد پایین'
fa['Unit'] = 'واحد'
fa['Commands'] = ' '
angular.module('PIR').controller('GridCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.post('data/grid/', {PI: 'test'}).then(function(res){
      console.log(res.data);
    }).catch(function(e){
      console.log(e);
      // handle errors in processing or in error.
    });
    $scope.gridOptions = {
      enableColumnMenus: false,
      enableFiltering: true,
      columnDefs: [
        { name:fa['Commands'], enableCellEdit:false, enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents text-center"><a href="#" class="anchor-grid glyphicon glyphicon-info-sign"></a><a href="#" class="anchor-grid glyphicon glyphicon-stats"></a><a href="#" class="anchor-grid fa fa-comments fa-red" style="color:orange"></a><a href="#" class="anchor-grid glyphicon glyphicon-flag"></a></div>'},
        { name:fa['PI'], field: 'PI', enableCellEdit:false },
        { name:fa['PI real'], field: 'PI real' },
        { name:fa['PI target'], field: 'PI target' },
        { name:fa['Unit'], field: 'Unit', enableCellEdit:false},
        { name:fa['Lower Limit'], field: 'Lower Limit', enableCellEdit:false},
        { name:fa['Upper Limit'], field: 'Upper Limit', enableCellEdit:false},
        { name:fa['Edit Time'], field: 'Edit Time', enableCellEdit:false}
      ],
      data : [
        {
            "PI": "عملکرد واحد",
            "PI real": "125",
            "Unit": "تن",
            "Lower Limit": 100,
            "Upper Limit": 150,
            "Edit Time": "",
            "PI target": 120
        },
        {
            "PI": "بهره وری",
            "PI real": "8.5",
            "Unit": "درصد",
            "Lower Limit": 0,
            "Upper Limit": 10,
            "Edit Time": "",
            "PI target": 9
        },
        {
            "PI": "نسبت سود",
            "PI real": "8001.2",
            "Unit": "بی بعد",
            "Lower Limit": 1000,
            "Upper Limit": 10000,
            "Edit Time": "",
            "PI target": 9000
        }
      ]
    };
}]);
