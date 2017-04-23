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
