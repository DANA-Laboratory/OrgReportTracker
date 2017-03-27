var start=0;
var stop=100;
var part=(stop-start)/3;
var pi_value=4.999;
var pi_name="مدت توقف";
var pi_unit="(روز)";
var pi_data=[30, 30, 20, 1, 9];
var inner={
    backgroundColor: [
        "rgba(0, 0, 0, 0)",
        "rgba(0, 0, 0, 0)",
        "rgba(0, 0, 0, 0)",
        "rgba(0, 0, 0, 1)",
        "rgba(0, 0, 0, 0)"
    ],
    borderWidth: 0,
    hoverBackgroundColor: [
        "rgba(0, 0, 0, 0)",
        "rgba(0, 0, 0, 0)",
        "rgba(0, 0, 0, 0)",
        "rgba(0, 0, 0, 1)",
        "rgba(0, 0, 0, 0)"
    ],
    hoverBorderWidth: 0
};
angular.module('PIR').controller("DoughnutCtrl", ['$scope', function ($scope) {
  var originalDraw = Chart.controllers.doughnut.prototype.draw;
  Chart.controllers.doughnut.prototype.draw = function(ease) {
    //this.innerRadius = this.outerRadius - 10;
    //console.log(ease);
    console.log(this);
    if(this.index == 1){
      let x = (this.chart.boxes[this.index].right)/2;
      this.chart.chart.ctx.textAlign = "center";
      this.chart.chart.ctx.fillText(pi_value, x, x*3/2);
      this.chart.chart.ctx.fillText(start, 4*this.chart.boxes[this.index].left, x*3/2);
      this.chart.chart.ctx.fillText(stop, this.chart.boxes[this.index].right-3*this.chart.boxes[this.index].left, x*3/2);
    }
    originalDraw.call(this, ease);
  };
  $scope.data = [pi_data, pi_data];
  $scope.datasetOverride = [
    {
        backgroundColor: [
            "rgb(255, 69, 96)",
            "rgb(206, 148, 73)",
            "rgb(153, 223, 89)",
            "rgba(0, 0, 0, 1)",
            "rgb(153, 223, 89)"
        ],
        borderWidth: 0,
        hoverBackgroundColor: [
            "rgb(255, 69, 96)",
            "rgb(206, 148, 73)",
            "rgb(153, 223, 89)",
            "rgba(0, 0, 0, 1)",
            "rgb(153, 223, 89)"
        ],
        hoverBorderWidth: 0,
    },
    inner
  ];
  $scope.options = {
    cutoutPercentage: 0,
    rotation: -3.1415926535898,
    circumference: 3.1415926535898,
    legend: {
        display: false
    },
    tooltips: {
        enabled: false
    },
    title: {
        display: true,
        text: pi_name + ' ' + pi_unit,
        fontSize: 14,
        fontFamily: 'yekan',
        position: 'bottom'
    }
  };

}]);
