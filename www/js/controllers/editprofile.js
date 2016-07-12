angular.module('EditProfile.controllers', [])

.controller('EditProfileCtrl', function($scope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService, $ionicModal) {
  $ionicPlatform.ready(function(){
    try{

    	$ionicModal.fromTemplateUrl('templates/profileview.html', {
		    scope: $scope,
		    animation: 'slide-in'
		}).then(function(profileview) {
		    $scope.profileview = profileview;
		});
		$scope.openModalprofileview = function() {
		    $scope.profileview.show();
		};
		$scope.closeModalprofileview = function() {
		    $scope.profileview.hide();
		};
      	
     }catch(err){
      console.log(err.message);
    }
  });

})