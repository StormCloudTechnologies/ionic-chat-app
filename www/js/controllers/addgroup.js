angular.module('AddGroup.controllers', [])

.controller('AddGroupCtrl', function($scope, $rootScope, DB, $ionicLoading, $localstorage, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{
      $scope.addlistgroup = [];
      $scope.groupname = $localstorage.get("groupname");
      $scope.backaddgorup = function(){
        $localstorage.set("addlistgroup", "");
        $state.go('group');
      }
      var usernumber = localStorageService.get('usernumber');
      var username = localStorageService.get('username');
      $scope.addlistgroup = $rootScope.addList;
      console.log($scope.addlistgroup);
    	$scope.searchbox = true;
    	$scope.searchList = [];
    	$scope.search = function() {
  			$scope.searchbox = false;
  			var conatctsel = "SELECT * from Contact";
  			var results = DB.query(conatctsel, []).then(function (result) {
  			    if(result.rows.length!=0){
              console.log(result);
  			    	var len = result.rows.length;
                for(var j=0;j<len;j++){
                    $scope.searchList.push({"displayName":result.rows.item(j).displayName, "photos":result.rows.item(j).photos, "number":result.rows.item(j).contactnumber});    
                } 
  				}
  			});
      }

      $scope.createGroup = function(){
        var createTime = new Date();
        var ID = 1;
        var CreateGroupQry = "Insert into GroupList(id, groupname, member, Creatname, Creatnumber, time) VALUES (?, ?, ?, ?, ?, ?)";
        DB.query(CreateGroupQry, [ID, $scope.groupname,  $scope.addlistgroup,username, usernumber,createTime]).then(function (result) {
            ID = ID+1;
            console.log('insert  '+ID);
            $state.go('home');
          // $scope.selectContact();
        });
      }

      $scope.removelist = function(addlist){
       $scope.addlistgroup.splice($scope.addlistgroup.indexOf(addlist), 1);
       $localstorage.set("addlistgroup", JSON.stringify($scope.addlistgroup));
        console.log($scope.addlistgroup);
      }
      
     }catch(err){
      console.log(err.message);
    }
  });

})