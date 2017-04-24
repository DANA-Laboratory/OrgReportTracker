angular.module('PIR').controller('report-grid', ['$scope', '$http', function ($scope, $http) {
    $scope.gridOptions = {
      enableColumnMenus: false,
      enableFiltering: true,
      columnDefs: [
        { name:fa['commands'], enableCellEdit:false, enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents text-center"><a href="#" class="anchor-grid fa fa-info fa-fw"></a><a href="#" class="anchor-grid fa fa-line-chart fa-fw"></a><a href="#" class="anchor-grid fa fa-comments fa-red fa-fw" style="color:orange"></a><a href="#" class="anchor-grid fa fa-flag fa-fw"></a></div>'},
        { name:fa['pi'], field: 'PI', enableCellEdit:false },
        { name:fa['pi real'], field: 'PI real' },
        { name:fa['pi category'], field: 'PI category' },
        { name:fa['pi weight'], field: 'PI weight' },
        { name:fa['pi target'], field: 'PI target' },
        { name:fa['unit'], field: 'Unit', enableCellEdit:false},
        { name:fa['lower limit'], field: 'Lower Limit', enableCellEdit:false},
        { name:fa['upper limit'], field: 'Upper Limit', enableCellEdit:false},
        { name:fa['edit time'], field: 'Edit Time', enableCellEdit:false}
      ]
    };
    $http.post('/data/report', {report: 'test'}).then(function(res){
      $scope.gridOptions.data = res.data;
      // console.log($scope.gridOptions.data);
    }).catch(function(e){
      console.log(e);
      // handle errors in processing or in error.
    });
}]);
angular.module('PIR').controller('cat-grid', ['$scope', function ($scope) {
    $scope.gridOptions = {
      enableColumnMenus: false,
      enableFiltering: true,
      columnDefs: [
        { name:fa['commands'], width: '5%', enableCellEdit:false, enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents text-center"><a href="#" class="anchor-grid fa fa-remove fa-fw" style="color:red"></a></div>'},
        { name:fa['code'], width: '10%', field: 'code'},
        { name:fa['caption'], width: '50%', field: 'caption'},
        { name:fa['weight'], width: '10%', field: 'weight'},
        { name:fa['attribute'], field: 'attribute', enableCellEdit:false},
      ]
    };
    $scope.callback = function(data) {
      $scope.gridOptions.data = data;
      console.log(data);
    };
}]);
