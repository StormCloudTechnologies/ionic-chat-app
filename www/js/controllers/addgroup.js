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
      $scope.usernumber = localStorageService.get('usernumber');
      var username = localStorageService.get('username');
      $scope.addlistgroup = $rootScope.addList;
      console.log($scope.addlistgroup);
    	$scope.searchbox = true;

    	// $scope.searchList = [];
    	// $scope.search = function() {
  			// $scope.searchbox = false;
  			// var conatctsel = "SELECT * from Contact";
  			// var results = DB.query(conatctsel, []).then(function (result) {
  			//     if(result.rows.length!=0){
     //          console.log(result);
  			//     	var len = result.rows.length;
     //            for(var j=0;j<len;j++){
     //                $scope.searchList.push({"displayName":result.rows.item(j).displayName, "photos":result.rows.item(j).photos, "number":result.rows.item(j).contactnumber});    
     //            } 
  			// 	}
  			// });
     //  }

    console.log($rootScope.addList);

    $scope.group_name = localStorage.getItem("groupName");
    $scope.groupImage = $localstorage.get("groupImage");
      // $scope.group_list = [];
      // $scope.addMember = function(phone) {
      //     $scope.group_list.push(phone)
      //     console.log($scope.group_list);
      // };
      $scope.createGroup = function() {
          APIService.setData({
              req_url: url_prefix + 'createGroup',
              data: {users: $rootScope.addList, group_name: $scope.group_name, admin_name: username , admin_number:$scope.usernumber , image_url:$scope.groupImage}
          }).then(function(resp) {
              console.log(resp);
              if(resp.data) {
                  $state.go('home');
              }
             },function(resp) {
                // This block execute in case of error.
          });
      }

      // $scope.createGroup = function(){
      //   var createTime = new Date();
      //   var CreateGroupQry = "Insert into GroupList(id, groupname, member, Creatname, Creatnumber, time) VALUES (?, ?, ?, ?, ?, ?)";
      //   DB.query(CreateGroupQry, [ID, $scope.groupname,  $scope.addlistgroup,username, usernumber,createTime]).then(function (result) {
      //       console.log('insert  '+ID);
      //       $state.go('home');
      //     // $scope.selectContact();
      //   });
      // }

      $scope.removelist = function(addlist){
       $rootScope.addList.splice($rootScope.addList.indexOf(addlist), 1);
       // $localstorage.set("addlistgroup", JSON.stringify($scope.addlistgroup));
        console.log($rootScope.addList);
      }
      
     }catch(err){
      console.log(err.message);
    }
  });

})