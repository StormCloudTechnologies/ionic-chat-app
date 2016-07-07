angular.module('AddGroupList.controllers', [])

.controller('AddGroupListCtrl', function($scope, $rootScope, DB, $localstorage, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{
      $rootScope.addList = [];
      // $scope.addList.ckeckDone = "";
    	$scope.addgroupLists = [];
      var conatctsel = "SELECT * from Contact";
      var results = DB.query(conatctsel, []).then(function (result) {
          if(result.rows.length!=0){
          	var len = result.rows.length;
                    for(var j=0;j<len;j++){
                        $scope.addgroupLists.push({"displayName":result.rows.item(j).displayName, "photos":result.rows.item(j).photos, "number":result.rows.item(j).contactnumber});    
                    } 
      	}
      });

      $scope.Donelist = function(){
        for(var i=0;i<$scope.addgroupLists.length;i++){
          if($scope.addgroupLists[i].ischeck==true){
            $rootScope.addList.push($scope.addgroupLists[i]);
            console.log($scope.addList);
          }
        }
        // $localstorage.set("addlistgroup", JSON.stringify($scope.addList));
        $state.go('addgroup');
      }

     }catch(err){
      console.log(err.message);
    }
  });

});