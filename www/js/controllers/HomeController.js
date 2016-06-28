angular.module('Home.controllers', [])

.controller('HomeController', function($scope, $state, localStorageService, $ionicPlatform, SocketService, $ionicSlideBoxDelegate, $timeout, $cordovaContacts) {
	$ionicPlatform.ready(function(){
   		try{
			// $timeout(function() {
			// 	$ionicSlideBoxDelegate.slide(1);
			// }, 4000);
			// if ($ionicTabsDelegate.selectedIndex() == 0){
		 //     // Perform some action 
		 //    }

			$scope.current_room = localStorageService.get('room');
			$scope.rooms = ['Storm', 'Cloud', 'Technologies'];



			$scope.getAllContacts = function(searchQuery) {
				 try{
					var opts = {                                           //search options
					  filter : searchQuery,                                          // 'Bob'
					  multiple: true,                                      // Yes, return any contact that matches criteria
					  fields:  [ 'displayName', 'name' ]
					};
					if(ionic.Platform.isAndroid()){
						opts.hasPhoneNumber = true;         //hasPhoneNumber only works for android.
					};
					
					// $ionicLoading.show();

					$cordovaContacts.find(opts).then(function (contactsFound) {
					  $scope.contacts = contactsFound;
					  // $ionicLoading.hide();
					});


				 }catch(err){
					 alert(err.message);
				 }
			};

			$scope.getAllContacts("Ak"); 
			
			$scope.enterRoom = function(room_name){

				$scope.current_room = room_name;
				localStorageService.set('room', room_name);
				
				var room = {
					'room_name': room_name
				};

				SocketService.emit('join:room', room);

				$state.go('room');
			};
		}catch(err){
	      console.log(err.message);
	    }
	});

});