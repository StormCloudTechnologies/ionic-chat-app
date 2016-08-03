angular.module('AddName.controllers', [])

.controller('AddNameCtrl', function($scope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService, $localstorage) {
  $ionicPlatform.ready(function(){
    try{
        $scope.addform = {};
      	$scope.addform.userName = "";
      	$scope.ProfileDone =function(editName){
          console.log(editName);
      	  $localstorage.set('editName',editName)
      		$state.go('editprofile');
      	}

     }catch(err){
      console.log(err.message);
    }
  });

})