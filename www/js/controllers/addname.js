angular.module('AddName.controllers', [])

.controller('AddNameCtrl', function($scope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService, $localstorage, $rootScope) {
  $ionicPlatform.ready(function(){
    try{
        $scope.addform = {};
      	$scope.addform.userName = "";
      	$scope.ProfileDone =function(editName){
          console.log(editName);
      	  localStorageService.set('username',editName)
          $rootScope.userName = editName;
      		$state.go('editprofile');
      	}

     }catch(err){
      console.log(err.message);
    }
  });

})