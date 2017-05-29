angular.module('PIR').controller('report-grid', ['$scope', '$http', function ($scope, $http) {
    $scope.gridOptions = {
      enableColumnMenus: false,
      enableFiltering: true,
      columnDefs: [
        { name:fa['commands'], enableCellEdit:false, enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents text-center"><a href="#" class="anchor-grid fa fa-info fa-fw"></a><a href="#" class="anchor-grid fa fa-line-chart fa-fw"></a><a href="#" class="anchor-grid fa fa-comments fa-red fa-fw" style="color:orange"></a><a href="#" class="anchor-grid fa fa-flag fa-fw"></a></div>'},
        { name:fa['pi'], field: 'PI', enableCellEdit:false },
        { name:fa['pi real'], field: 'PI real', type:'number' },
        { name:fa['pi category'], field: 'PI category'},
        { name:fa['pi weight'], field: 'PI weight', type:'number' },
        { name:fa['pi target'], field: 'PI target', type:'number' },
        { name:fa['unit'], field: 'Unit', enableCellEdit:false },
        { name:fa['lower limit'], field: 'Lower Limit', enableCellEdit:false, type:'number'},
        { name:fa['upper limit'], field: 'Upper Limit', enableCellEdit:false, type:'number'},
        { name:fa['edit time'], field: 'Edit Time', enableCellEdit:false},
        { field: 'link', visible: false,
          filter: {
                      term: 1,
                  }
        }
      ]
    };
    $http.post('/data/report', {report: 'test'}).then(function(res){
      $scope.gridOptions.data = res.data;
    }).catch(function(e){
      console.log(e);
      // handle errors in processing or in error.
    });
}]);
angular.module('PIR').controller('cat-grid', ['$scope', function ($scope) {
    var masterField = undefined;
    var urlobject = undefined;
    var masterKey = undefined;
    $scope.init = function(urlo, masterField_, handler) {
        if (masterField_ === 'ReportClass') {
            $scope.gridOptions.columnDefs = reportClasscolumnDefs;
        } else {
            $scope.gridOptions.columnDefs = columnDefs;
        }
        masterField = masterField_;
        urlobject = urlo;
        masterKey = $scope.getlatestselected(masterField);
        handler();
        if ($scope.config_show_only_latest === true) {
          $scope.$on('eventUpdateSelected', handler)
        }
    };
    $scope.catgridhandler = function() {
        if($scope.config_show_only_latest === true){
          masterKey = $scope.getlatestselected(masterField)
        }
        $scope.query(urlobject, {where: masterField.toLowerCase()+'_id', value: masterKey}, $scope.callback);
    };
    $scope.$on('uiGridEventEndCellEdit', function (data) {
        updatesum();
    });
    $scope.gridOptions = {
      enableColumnMenus: false,
      enableFiltering: true,
      enableRowHashing:false,
    };
    var reportClasscolumnDefs = [
            { name:fa['commands'], width: '5%', enableCellEdit:false, enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents text-center"><a href="#" class="anchor-grid fa fa-remove fa-fw" style="color:red"></a></div>'},
            { name:fa['code'], width: '10%', field: 'code', enableCellEdit:false},
            { name:fa['caption'], width: '50%', field: 'caption', enableCellEdit:false},
            { name:fa['VariableCat']['VariableCat_3'], width: '25%', field: 'variablecat_3_caption', enableCellEdit:false},
            { name:fa['provider'], width: '10%', field: 'user_provider_account', enableCellEdit:false},
    ];
    var columnDefs = [
            { name:fa['commands'], width: '5%', enableCellEdit:false, enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents text-center"><a href="#" class="anchor-grid fa fa-remove fa-fw" style="color:red"></a></div>'},
            { name:fa['code'], width: '10%', field: 'code'},
            { name:fa['caption'], width: '50%', field: 'caption'},
            { name:fa['weight'], width: '10%', field: 'weight', type: 'number'},
            { name:fa['share'], width: '10%', field: 'share', enableCellEdit:false},
            { name:fa['attribute'], field: 'attribute', enableCellEdit:false},
    ];
    $scope.callback = function(data) {
      $scope.gridOptions.data = data;
      updatesum();
      /*
      if (data === undefined) {
          data = $scope.data;
      }
      if ($scope.masterField !== undefined) {
          $scope.gridOptions.data = data.filter((item)=>{return item[$scope.masterField.toLowerCase()+'_id'] === $scope.getlatestselected($scope.masterField)});
      } else {
          $scope.gridOptions.data = data.filter($scope.filter);
      }
      */
    };
    var updatesum = function() {
      var sum = $scope.gridOptions.data.reduce((a,b)=>((b.weight) + (a)), 0);
      $scope.gridOptions.data.forEach((item)=>{item.share = (item.weight/sum*100).toPrecision(4)});
    };
}]);
