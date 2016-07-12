angular.module('Status.controllers', [])

.controller('StatusCtrl', function($scope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService, $ionicPopover) {
  $ionicPlatform.ready(function(){
    try{

    	$ionicPopover.fromTemplateUrl('templates/deletestatus.html', {
		    scope: $scope
		}).then(function(deletestatus) {
		    $scope.deletestatus = deletestatus;
		});
		$scope.openPopoverdeletestatus = function($event2) {
		    $scope.deletestatus.show($event2);
		};
		$scope.closePopoverdeletestatus = function() {
		    $scope.deletestatus.hide();
		};
      
     }catch(err){
      console.log(err.message);
    }
  });

})