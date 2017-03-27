var start=0;
var stop=100;
var part=(stop-start)/3;
var pi_value=10;
var pi_name="مدت توقف";
var pi_unit="(روز)";
var pi_data=[30, 30, 30];
angular.module('PIR').controller("DoughnutCtrl", ['$scope', function ($scope) {
  var originalDraw = Chart.controllers.doughnut.prototype.draw;
  Chart.controllers.doughnut.prototype.draw = function(ease) {
    let ctx = this.chart.chart.ctx;
    let left = this.chart.boxes[this.index].left;
    let right = this.chart.boxes[this.index].right;
    let top = this.chart.boxes[this.index].top;
    let bottom = this.chart.boxes[this.index].bottom;
    let centerx = (left+right)/2 + this.chart.offsetX;
    let centery = (top+bottom)/2 - this.chart.offsetY;
    let radius = this.chart.outerRadius;
    let width = this.chart.outerRadius - this.chart.innerRadius;
    let x = (right)/2;
    let teta=Math.PI/(stop-start)*pi_value;
    originalDraw.call(this, ease);
    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.moveTo(centerx, centery);
    ctx.lineTo(centerx-radius*Math.cos(teta), centery-radius*Math.sin(teta));
    ctx.arc(centerx-radius*Math.cos(teta), centery-radius*Math.sin(teta), 2, 0, 2*Math.PI);
    ctx.strokeStyle="gray";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerx, centery, 2, 0, 2*Math.PI);
    ctx.stroke();

    ctx.fillStyle="black";
    ctx.textAlign = "center";
    ctx.font="18px yekan";
    ctx.fillText(pi_value, centerx, centery-40);
    ctx.font="10px yekan";
    ctx.fillText(pi_name + ' ' + pi_unit, centerx, centery+20);
    ctx.fillText(start, left+width/2, centery+12);
    ctx.fillText(stop, right-width/2, centery+12);


  };
  $scope.data = [pi_data];
  $scope.datasetOverride = [
    {
        backgroundColor: [
            "rgb(255, 69, 96)",
            "rgb(206, 148, 73)",
            "rgb(153, 223, 89)"
        ],
        borderWidth: 0,
        hoverBackgroundColor: [
            "rgb(255, 69, 96)",
            "rgb(206, 148, 73)",
            "rgb(153, 223, 89)"
        ],
        hoverBorderWidth: 0,
    }
  ];
  $scope.options = {
    cutoutPercentage: 95,
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
        fontSize: 12,
        fontFamily: 'yekan',
        position: 'bottom'
    }
  };

}]);
