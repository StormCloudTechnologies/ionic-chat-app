angular.module('AddGroup.controllers', [])

.controller('AddGroupCtrl', function($scope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{

    	$scope.searchbox = true;
        

    	$scope.search = function() {
			$scope.searchbox = false;
			$scope.searchList = [{
				'name':'demo',
				'status':'demo',
				'image':'img/profile.png'
			},{
				'name':'demo',
				'status':'demo',
				'image':'img/profile.png'
			},{
				'name':'demo',
				'status':'demo',
				'image':'img/profile.png'
			},{
				'name':'demo',
				'status':'demo',
				'image':'img/profile.png'
			},{
				'name':'demo',
				'status':'demo',
				'image':'img/profile.png'
			},{
				'name':'demo',
				'status':'demo',
				'image':'img/profile.png'
			},{
				'name':'demo',
				'status':'demo',
				'image':'img/profile.png'
			},{
				'name':'demo',
				'status':'demo',
				'image':'img/profile.png'
			},{
				'name':'demo',
				'status':'demo',
				'image':'img/profile.png'
			}]
        }
      
     }catch(err){
      console.log(err.message);
    }
  });

})