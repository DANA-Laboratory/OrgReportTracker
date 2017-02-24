angular.module("PIR", ["chart.js"])
  // Optional configuration
  .config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      chartColors: ['#005252', '#FF8A80'],
      responsive: true
    });
    ChartJsProvider.setOptions('tooltips', {
      titleFontFamily: 'b titr',
      position: 'nearest',
      titleMarginBottom: 15,
      bodyFontFamily: 'b yekan',
      footerFontFamily: 'tahoma'

    });
    ChartJsProvider.setOptions('layout', {
      padding: 10
    });
    ChartJsProvider.setOptions('legend', {
      display: true,
      position: 'right',
      labels: {
        fontFamily: 'b yekan', fontSize: 8, usePointStyle:true
      }
    });
    ChartJsProvider.setOptions('title', {
      display: true,
      text: 'توقف تولید (روز)',
      fontFamily: 'B Titr',
    });
    ChartJsProvider.setOptions('line', {
      showLines: true
    });
    ChartJsProvider.setOptions('elements', {
      line: {
        tension: 0.1
      }
    });
  }])
  .controller("LineCtrl", ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.labels = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر"];
    $scope.series = ['واقعی', 'پیشبینی'];
    $scope.data = [
      [3, 3, 2, 3, 4, 5, 1],
      [3, 2, 3, 2, 3, 2, 3]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };

    // Simulate async data update
    $timeout(function () {
      $scope.data = [
        [3, 3, 2, 3, 4, 5, 1],
        [3, 2, 3, 2, 3, 2, 3]
      ];
    }, 3000);
  }]);
