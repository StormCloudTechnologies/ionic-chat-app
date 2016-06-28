angular.module('Home.controllers', [])

.controller('HomeController', function($scope, $state, localStorageService, $ionicPlatform, SocketService, $ionicSlideBoxDelegate, $timeout, $cordovaContacts, $ionicTabsDelegate, $ionicPopover) {
	$ionicPlatform.ready(function(){
   		try{

   			$scope.hideCall = false;
   			$scope.hideChat = true;
   			$scope.hideContact = true;

			$scope.slideHasChanged=function(Value){
				if(Value==0){
					$scope.hideCall = false;
					$scope.hideChat = true;
   					$scope.hideContact = true;

				}
				if(Value==1){
					$scope.hideCall = true;
					$scope.hideChat = false;
   					$scope.hideContact = true;

				}
				if(Value==2){
					$scope.hideCall = true;
					$scope.hideChat = true;
   					$scope.hideContact = false;

				}
			}

			$ionicPopover.fromTemplateUrl('templates/callPop.html', {
			    scope: $scope
			}).then(function(callPop) {
			    $scope.callPop = callPop;
			});
			$scope.openPopovercallPop = function($event) {
			    $scope.callPop.show($event);
			};
			$scope.closePopovercallPop = function() {
			    $scope.callPop.hide();
			};

			$ionicPopover.fromTemplateUrl('templates/chatPop.html', {
			    scope: $scope
			}).then(function(chatPop) {
			    $scope.chatPop = chatPop;
			});
			$scope.openPopoverchatPop = function($event) {
			    $scope.chatPop.show($event);
			};
			$scope.closePopoverchatPop = function() {
			    $scope.callPop.hide();
			};

			$ionicPopover.fromTemplateUrl('templates/contactPop.html', {
			    scope: $scope
			}).then(function(contactPop) {
			    $scope.contactPop = contactPop;
			});
			$scope.openPopovercontactPop = function($event) {
			    $scope.contactPop.show($event);
			};
			$scope.closePopovercontactPop = function() {
			    $scope.contactPop.hide();
			};

			$scope.current_room = localStorageService.get('room');
			$scope.rooms = ['Storm', 'Cloud', 'Technologies'];



			// $scope.getAllContacts = function(searchQuery) {
			// 	 try{
			// 		var opts = {                                           //search options
			// 		  filter : searchQuery,                                          // 'Bob'
			// 		  multiple: true,                                      // Yes, return any contact that matches criteria
			// 		  fields:  [ 'displayName', 'name' ]
			// 		};
			// 		if(ionic.Platform.isAndroid()){
			// 			opts.hasPhoneNumber = true;         //hasPhoneNumber only works for android.
			// 		};
					
			// 		// $ionicLoading.show();

			// 		$cordovaContacts.find(opts).then(function (contactsFound) {
			// 		  $scope.contacts = contactsFound;
			// 		  // $ionicLoading.hide();
			// 		});


			// 	 }catch(err){
			// 		 alert(err.message);
			// 	 }
			// };

			// $scope.getAllContacts("Ak"); 
			
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