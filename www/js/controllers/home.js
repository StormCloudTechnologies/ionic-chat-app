angular.module('Home.controllers', [])

.controller('HomeCtrl', function($scope, $state, localStorageService, $ionicPlatform, SocketService, $ionicSlideBoxDelegate, $timeout, $cordovaContacts, $ionicTabsDelegate, $ionicPopover, APIService) {
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
			$scope.openPopoverchatPop = function($event1) {
			    $scope.chatPop.show($event1);
			};
			$scope.closePopoverchatPop = function() {
			    $scope.callPop.hide();
			};

			$ionicPopover.fromTemplateUrl('templates/contactPop.html', {
			    scope: $scope
			}).then(function(contactPop) {
			    $scope.contactPop = contactPop;
			});
			$scope.openPopovercontactPop = function($event2) {
			    $scope.contactPop.show($event2);
			};
			$scope.closePopovercontactPop = function() {
			    $scope.contactPop.hide();
			};

			$scope.status = function(){
				$scope.callPop.hide();
				$state.go('status');
			}

			$scope.current_room = localStorageService.get('room');
			$scope.rooms = ['Storm', 'Cloud', 'Technologies'];



			// $scope.getAllContacts = function() {
			// 	 try{
			// 		$cordovaContacts.find().then(function (allContacts) {
			// 		  $scope.contacts = allContacts;
			// 		  console.log(allContacts);
			// 		  // $ionicLoading.hide();
			// 		});
			// 	 }catch(err){
			// 		 alert(err.message);
			// 	 }
			// };

			// $scope.getAllContacts(); 

            $scope.usernumber = localStorageService.get('usernumber');
			APIService.setData({
                req_url: url_prefix + 'getUser',
                data: {}
            }).then(function(resp) {
                if(resp.data) {
                    $scope.userList = resp.data;
                }
               },function(resp) {
                  // This block execute in case of error.
            });
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