angular.module('PIR').config(['ChartJsProvider', function (ChartJsProvider) {
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
}]);
