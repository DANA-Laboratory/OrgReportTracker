var fa={}
fa['PI'] = 'شاخص'
fa['PI real'] = 'دستاورد'
fa['PI target'] = 'هدف'
fa['PI category'] = 'گروه'
fa['PI weight'] = 'وزن'
fa['Edit Time'] = 'زمان ویرایش'
fa['Upper Limit'] = 'حد بالا'
fa['Lower Limit'] = 'حد پایین'
fa['Unit'] = 'واحد'
fa['Commands'] = ' '
angular.module("PIR").controller("PolarAreaCtrl", function ($scope) {
  $scope.labels = ["مالی", "ذی نفعان", "رشد و یادگیری", "فرآیندها"];
  $scope.data = [20, 10, 10, 30];
  $scope.options = {
       scale: {
           ticks: {
               stepSize: 20,
               max: 100
           }
       },
  }
});
angular.module('PIR').controller('GridCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.gridOptions = {
      enableColumnMenus: false,
      enableFiltering: true,
      columnDefs: [
        { name:fa['Commands'], enableCellEdit:false, enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents text-center"><a href="#" class="anchor-grid glyphicon glyphicon-info-sign"></a><a href="#" class="anchor-grid fa fa-line-chart"></a><a href="#" class="anchor-grid fa fa-comments fa-red" style="color:orange"></a><a href="#" class="anchor-grid glyphicon glyphicon-flag"></a></div>'},
        { name:fa['PI'], field: 'PI', enableCellEdit:false },
        { name:fa['PI real'], field: 'PI real' },
        { name:fa['PI category'], field: 'PI category' },
        { name:fa['PI weight'], field: 'PI weight' },
        { name:fa['PI target'], field: 'PI target' },
        { name:fa['Unit'], field: 'Unit', enableCellEdit:false},
        { name:fa['Lower Limit'], field: 'Lower Limit', enableCellEdit:false},
        { name:fa['Upper Limit'], field: 'Upper Limit', enableCellEdit:false},
        { name:fa['Edit Time'], field: 'Edit Time', enableCellEdit:false}
      ]
    };
    $http.post('/data/report', {report: 'test'}).then(function(res){
      $scope.gridOptions.data = res.data;
    }).catch(function(e){
      console.log(e);
      // handle errors in processing or in error.
    });
}]);
