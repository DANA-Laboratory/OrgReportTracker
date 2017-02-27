var app = angular.module('app', ['ui.grid', 'ui.grid.edit']);
app.controller('GridCtrl', ['$scope', '$http', function ($scope) {
    $scope.myData = [
      {
          "شاخص": "Cox",
          "دستاورد": "Enormo",
          "واحد": "تن",
          "حد پایین": 100,
          "حد بالا": 150,
          "زمان ویرایش": ""
      },
      {
          "شاخص": "Lorraine",
          "دستاورد": "Comveyer",
          "واحد": "درصد",
          "حد پایین": 0,
          "حد بالا": 10,
          "زمان ویرایش": ""
      },
      {
          "شاخص": "Nancy",
          "دستاورد": "Fuelton",
          "واحد": "بی بعد",
          "حد پایین": 1000,
          "حد بالا": 10000,
          "زمان ویرایش": ""
      }
  ];
}]);
