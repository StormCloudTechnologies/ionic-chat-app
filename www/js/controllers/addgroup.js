angular.module('AddGroup.controllers', [])

.controller('AddGroupCtrl', function($scope, DB, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{

    	$scope.searchbox = true;
    	$scope.searchList = [];
    	$scope.search = function() {
			$scope.searchbox = false;
			var conatctsel = "SELECT * from Contact";
			var results = DB.query(conatctsel, []).then(function (result) {
			    if(result.rows.length!=0){
			    	var len = result.rows.length;
                    for(var j=0;j<len;j++){
                        $scope.searchList.push({"displayName":result.rows.item(j).displayName, "photos":result.rows.item(j).photos, "number":result.rows.item(j).contactnumber});    
                    } 
				}
			});
        }
      
     }catch(err){
      console.log(err.message);
    }
  });

})