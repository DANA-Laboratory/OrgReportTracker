//controllers for resources
angular.module("PIR").controller('urlqueryController',function ($scope, $injector, socketio) {
    var resource = undefined;
    var urlobject = undefined;
    var where = undefined;
    var callback = undefined;
    const newitem = -2;//id for a new item
    //first use
    $scope.setResource = function(res, where_, callback_) {
      resource = $injector.get(res);
      urlobject = res;
      where = where_;
      callback = callback_;
      $scope.registerSelected(urlobject);
      //wake-up and query
      socketio.on(urlobject, function () {
        $scope.query();
      });
    }
    //query list
    $scope.query = function (res, where_, callback_) {
        if(resource === undefined) {
            $scope.setResource(res, where_, callback_);
        }
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
        if ($scope.config_show_only_latest === true) {
          $scope.$on('eventUpdateSelected', handler);
        }
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
    var diff = undefined;
    var watcher = (newval)=>{
       if(JSON.stringify(originItem) !== JSON.stringify(newval)) {
           $scope.changed = true;
           diff = {};
           for (k in newval) {
             if(newval.hasOwnProperty(k)) {
               if(!(originItem.hasOwnProperty(k) && (newval[k] == originItem[k]))) {
                 diff[k]=newval[k];
               }
             }
           };
           //console.log(diff);
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
                    $scope.close();
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
    $scope.update_or_insert = function() {
      //check if is new item
      if($scope.newitem === true) {
        //insert
        $scope.confirm(fa['confirm insert'], ()=>{
            var res = resource.save({}, $scope.item,
                (data)=>{
                    $scope.confirm(fa['new item inserted']);
                    selectedkey = data.lastID;
                    $scope.query();
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
      } else {
        //update
        if ($scope.changed) {
          $scope.confirm(fa['confirm update'], ()=>{
              var res = resource.update({where: $scope.item.id}, diff,
                  (data)=>{
                      $scope.confirm(fa['item updated']);
                      $scope.changed = false;
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
        }
      }
    };
    //close button click, unselect
    $scope.close = function() {
      $scope.unselect(urlobject, selectedkey);
    }
});
