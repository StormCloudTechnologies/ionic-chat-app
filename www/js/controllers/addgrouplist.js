angular.module('AddGroupList.controllers', [])

.controller('AddGroupListCtrl', function($scope, $rootScope, DB, $localstorage, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{
      // $rootScope.addList = [];
      // $scope.addList.ckeckDone = "";
    	// $scope.addgroupLists = [];
     //  var conatctsel = "SELECT * from Contact";
     //  var results = DB.query(conatctsel, []).then(function (result) {
     //      if(result.rows.length!=0){
     //      	var len = result.rows.length;
     //          for(var j=0;j<len;j++){
     //              $scope.addgroupLists.push({"displayName":result.rows.item(j).displayName, "photos":result.rows.item(j).photos, "number":result.rows.item(j).contactnumber});    
     //          } 
     //  	}
     //  });

      $scope.Donelist = function(){
        for(var i=0;i<$rootScope.userList.length;i++){
          if($rootScope.userList[i].ischeck==true){
            $rootScope.addList.push($rootScope.userList[i]);
            console.log($scope.addList);
          }
        }
        // $localstorage.set("addlistgroup", JSON.stringify($scope.addList));
        $state.go('addgroup');
      }

      $scope.group_name = localStorage.getItem("groupName");
      $rootScope.addList = [];
      $scope.addMember = function(phone) {
           $rootScope.addList.push(phone)
          console.log($rootScope.addList);
      };
      // $scope.createGroup = function() {
      //     APIService.setData({
      //         req_url: url_prefix + 'createGroup',
      //         data: {users: $scope.group_list, name: $scope.group_name}
      //     }).then(function(resp) {
      //         if(resp.data) {
      //             $state.go('home');
      //         }
      //        },function(resp) {
      //           // This block execute in case of error.
      //     });
      // }
     }catch(err){
      console.log(err.message);
    }
  });

});
