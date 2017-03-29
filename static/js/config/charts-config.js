angular.module('PIR').config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    chartColors: ['#005252', '#FF8A80'],
    responsive: true,
    animation: false
  });
  ChartJsProvider.setOptions('tooltips', {
    titleFontFamily: 'Yekan',
    position: 'nearest',
    titleMarginBottom: 15,
    bodyFontFamily: 'Yekan',
    footerFontFamily: 'Yekan'
  });
  ChartJsProvider.setOptions('layout', {
    padding: 10
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
