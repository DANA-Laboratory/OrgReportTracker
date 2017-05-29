app.controller('selectController', function ($scope) {
    var selected = {};
    $scope.registerSelected = function(key) {
        if (!(key in selected)) {
          selected[key] = new Set();
        }
    }
    $scope.updateSelected = function(key, value) {
        if (selected[key].has(value)) {
            selected[key].delete(value);
        } else {
            selected[key].add(value);
            if (value !== -2) {
                selected[key].delete(-2);
            }
        }
        $scope.$broadcast("eventUpdateSelected", {key: key, value: value});
    }
    $scope.unselect = function(key, value) {
        if (key === 'VariableDef') {
          key = 'vVariableDef';
        }
        if (selected[key].has(value)) {
            selected[key].delete(value);
        }
        $scope.$broadcast("eventUpdateSelected", {key: key, value: value});
    }
    $scope.selectedHas = function(key, value) {
        return selected[key].has(value);
    }
    $scope.selectedIsEmpty = function(key) {
        if ($scope.selectedHas(key, -2)) {
          return (selected[key].size === 1)
        } else {
          return (selected[key].size === 0)
        }
    }
    $scope.getlatestselected = (key) => {
      if (key === 'VariableDef') {
        key = 'vVariableDef';
      }
      return ((key in selected) && selected[key].size>0) ? [...selected[key]][selected[key].size-1] : -1;
    };
    $scope.getselectionlength = (key) => {
      if (key === 'VariableDef') {
        key = 'vVariableDef';
      }
      return selected[key].size;
    };
    $scope.getselection = (key) => {
      if (key === 'VariableDef') {
        key = 'vVariableDef';
      }
      return ((key in selected) && selected[key].size>0) ? [...selected[key]] : -1;
    };
    $scope.filter = function (item) {
        var show = true;
        var hasrelation = false;
        for (key in selected) {
            var _key = key.toLowerCase() + '_id';
            if (_key !== 'user_id') {
                if (!item.hasOwnProperty(_key)) {
                    continue;
                }
                hasrelation = true;
                show = show && (($scope.selectedIsEmpty(key)) || $scope.selectedHas(key, item[_key]));
            } else {
                for (many in item) {
                    if (many.substring(0, 5) === 'user_') {
                        hasrelation = true;
                        show = show && (($scope.selectedIsEmpty(key)) || $scope.selectedHas(key, item[many]));
                    }
                }
            }
        }
        return !hasrelation || show;
    };
});
