var start=8000;
var stop=1000000000;
var pi_value=(start+stop)/2;
var pi_name="مدت توقف";
var pi_unit="(روز)";
var pi_data=[30, 30, 30];
var small=[12, 16];
var normall=[16, 24];
var big=[18, 28];
var size=normall;
angular.module('PIR').controller("DoughnutCtrl", ['$scope', function ($scope) {
  var originalDraw = Chart.controllers.doughnut.prototype.draw;
  var afterOriginalDraw = function(chart) {
    let ctx = chart.chart.ctx;
    let left = chart.boxes[0].left;
    let right = chart.boxes[0].right;
    let top = chart.boxes[0].top;
    let bottom = chart.boxes[0].bottom;
    let centerx = (left+right)/2 + chart.offsetX;
    let centery = (top+bottom)/2 - chart.offsetY;
    let radius = chart.outerRadius;
    let width = chart.outerRadius - chart.innerRadius;
    let x = (right)/2;
    let teta=Math.PI/(stop-start)*pi_value;
    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.moveTo(centerx, centery);
    ctx.lineTo(centerx-(radius*3/4)*Math.cos(teta+0.02), centery-(radius*3/4)*Math.sin(teta+0.02));
    ctx.lineTo(centerx-radius*Math.cos(teta), centery-radius*Math.sin(teta));
    ctx.moveTo(centerx, centery);
    ctx.lineTo(centerx-(radius*3/4)*Math.cos(teta-0.02), centery-(radius*3/4)*Math.sin(teta-0.02));
    ctx.lineTo(centerx-radius*Math.cos(teta), centery-radius*Math.sin(teta));
    ctx.strokeStyle="gray";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerx, centery, 2, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fillStyle="black";
    ctx.textAlign = "center";
    ctx.font= size[0] + "px Yekan";
    ctx.fillText(pi_name + ' ' + pi_unit, centerx, centery + 2 * size[0]);
    ctx.font= size[1] + "px WWDigital";
    ctx.fillText(pi_value.toLocaleString(), centerx, centery - size[0]);
    ctx.font= size[0] + "px WWDigital";
    ctx.textAlign = "left";
    ctx.fillText(start.toLocaleString(), left, centery + size[0]);
    ctx.textAlign = "right";
    ctx.fillText(stop.toLocaleString(), right, centery + size[0]);
  };
  Chart.controllers.doughnut.prototype.draw = function(ease) {
    if(this.chart.options.customize){
        afterOriginalDraw(this.chart);
    };
    originalDraw.call(this, ease);
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
        position: 'bottom'
    },
    customize: true
  };

}]);
