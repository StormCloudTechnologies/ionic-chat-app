angular.module('Home.controllers', [])

.controller('HomeCtrl', function($scope, DB, $state, localStorageService, $ionicPlatform, SocketService, $ionicSlideBoxDelegate, $timeout, $cordovaContacts, $ionicTabsDelegate, $ionicPopover, APIService) {
	$ionicPlatform.ready(function(){
   		try{

   			$scope.hideCall = false;
   			$scope.hideChat = true;
   			$scope.hideContact = true;
   			$scope.Contacts = [];

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

			$scope.selectContact = function(){
				var conatctsel = "SELECT * from Contact";
				var results = DB.query(conatctsel, []).then(function (result) {
				    if(result.rows.length!=0){
				    	// console.log(result.rows);
				    	var len = result.rows.length;
                        $scope.ContactList = [];
                        for(var j=0;j<len;j++){
                            $scope.ContactList.push({"name":result.rows.item(j).displayName, "photos":result.rows.item(j).photos, "number":result.rows.item(j).contactnumber});    
                        } 
						// console.log($scope.ContactList);
					}
				});
			}

			$scope.getConatct = function(){
				return $scope.ContactList;
			}

			$scope.getAllContacts = function() {
				 try{
				 	var options = {};
       			    options.multiple = true;
					$cordovaContacts.find(options).then(function (allContacts) {
					  for(var i=0; i<=allContacts.length; i++){
						var Name = allContacts[i].displayName;
					  	var Address = allContacts[i].addresses;
					  	var Email = allContacts[i].emails;
					  	var ID = allContacts[i].id;
					  	var NickName = allContacts[i].nickname;
					  	var Note = allContacts[i].note;
					  	var Organizations = allContacts[i].organizations;
					  	var Photos = allContacts[i].photos;
					  	var NumberValue = allContacts[i].phoneNumbers[0].value;
					   	var ContactQry = "Insert into Contact(id, displayName, contactnumber, photos, addresses, nickname, note, organizations, emails) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
					  	DB.query(ContactQry, [ID, Name, NumberValue, Photos, Address, NickName, Note, Organizations, Email]).then(function (result) {
							$scope.selectContact();
						});

					}
					
					});
				 }catch(err){
					 alert(err.message);
				 }
			};

			$scope.getAllContacts(); 

            $scope.usernumber = localStorageService.get('usernumber');
			// APIService.setData({
   //              req_url: url_prefix + 'getUser',
   //              data: {}
   //          }).then(function(resp) {
   //              if(resp.data) {
   //                  $scope.userList = resp.data;
   //              }
   //             },function(resp) {
   //                // This block execute in case of error.
   //          });
            $scope.enterChatRoom = function(user){
                localStorageService.set('current_chat_friend', user.username);
                localStorageService.set('current_friend_number', user.phone);
				SocketService.emit('join chat:room',{
                    receiver_id: user.phone,
                    sender_id: $scope.usernumber
                   });

				$state.go('room');
			};

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