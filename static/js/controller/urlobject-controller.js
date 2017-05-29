//controllers for resources
angular.module("PIR").controller('urlqueryController',function ($scope, $injector) {
    var resource = undefined;
    var urlobject = undefined;
    const newitem = -2;//id for a new item
    //query list
    $scope.setResource = function(res) {
      resource = $injector.get(res);
      urlobject = res;
    }
    $scope.query = function (res, where, callback) {
        $scope.setResource(res);
        if(urlobject!=='Log') {
            $scope.registerSelected(urlobject);
            var res = resource.query(where, function() {
                if (urlobject !== 'User') {
                    $scope.data = res.sort(sort_by('code'));
                } else {
                    $scope.data = res.sort(sort_by('lname'));
                }
                if (callback !== undefined) {
                    callback($scope.data);
                }
            });
        };
    };
    //check if an item is selected
    $scope.isSelected = function (id) {
        return $scope.selectedHas(urlobject, id);
    };
    //select item from list
    $scope.selectitem = function (id) {
       $scope.updateSelected(urlobject, id);
    };
    //new item btn pressed
    $scope.addnew = function () {
        $scope.updateSelected(urlobject, newitem);
    };
    //delete the passed item
    $scope.delete = function (item) {
        if (item == undefined) {
            throw('item undefiend');
        };
        $scope.confirm(fa['confirm delete'], ()=>{
            var res = resource.delete({where: item.id},
                (data)=>{
                    $scope.confirm(fa['item removed'] + ', ' + fa['number of changes:'] + ' ' + data.changes);
                    $scope.hide = true;
                },
                (err)=>{
                    if (err.status === 409) {
                        $scope.confirm(fa['error'] + ': ' + fa[err.data]);
                    } else {
                        $scope.confirm(fa['error']);
                    }
                }
            );
        });
    };
});
//controllers for resources
angular.module("PIR").controller('urlgetController',function ($scope, $injector) {
    var resource = undefined;
    var urlobject = undefined;
    var selectedkey = undefined;
    const newitem = -2;//id for a new item
    $scope.changed = false;//check if it need an update
    //callback called when selection changed
    $scope.init = function(res, handler, key) {
        selectedkey = key;
        resource = $injector.get(res);
        urlobject = res;
        handler();
        $scope.$on('eventUpdateSelected', handler);
    };
    //get latest selected item if ($scope.config_show_only_latest===true) or (selectedkey) if ($scope.config_show_only_latest!==true) and load into $scope.item
    $scope.getselectedhandler = function() {
        if ($scope.config_show_only_latest === true) {
          //get latest selected item and load into $scope.item
          _where = (urlobject === 'Log') ? $scope.getlatestselected('User') : $scope.getlatestselected(urlobject);
        } else {
          //get item with key equals selectedkey
          _where = selectedkey;
        }
        if (_where >= 0) {
            var res = resource.get({where: _where}, function() {
                if(urlobject === 'Log') {
                    $scope.item = {};
                    $scope.item.log = '';
                    res.data.forEach((item)=>{$scope.item.log += item.message + " @ " + item.timestamp + "\n"});
                } else {
                    $scope.newitem = false;
                    $scope.load(res);
                };
            });
        } else if (_where == newitem) {
            $scope.newitem = true;
            $scope.load({});
        }
    }
    var originItem = {};
    var listener = ()=>{};
    //load an item, lissten for change
    $scope.load = function (item) {
        //unwatch
        listener();
        $scope.item = Object.assign({}, item);
        //watch for any change if is not a new item
        if($scope.newitem === false) {
          //record original value
          originItem = Object.assign({}, item);
          //deep watch
          listener = $scope.$watchCollection('item', watcher, true);
        }
    };
    var watcher = (newval)=>{
       if(JSON.stringify(originItem) !== JSON.stringify(newval)) {
           $scope.changed = true;
       } else {
           $scope.changed = false;
       }
    }
    //password update
    $scope.updateitem = function (key, value) {
        $scope.item[key] = value;
    };
    //delete current
    $scope.delete = function () {
        $scope.confirm(fa['confirm delete'], ()=>{
            var res = resource.delete({where: $scope.item.id},
                (data)=>{
                    $scope.confirm(fa['item removed'] + ', ' + fa['number of changes:'] + ' ' + data.changes);
                    $scope.hide = true;
                },
                (err)=>{
                    if (err.status === 409) {
                        $scope.confirm(fa['error'] + ': ' + fa[err.data]);
                    } else {
                        $scope.confirm(fa['error']);
                    }
                }
            );
        });
    };
    //close button click, unselect
    $scope.close = function() {
      $scope.unselect(urlobject, selectedkey);
    }
});
