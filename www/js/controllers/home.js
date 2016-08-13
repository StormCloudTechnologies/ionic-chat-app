angular.module('Home.controllers', [])
angular.module('Home.controllers', [])

.controller('HomeCtrl', function($scope, DB, $cordovaFile, $rootScope, $state, localStorageService, $ionicPlatform, SocketService, $ionicSlideBoxDelegate, $timeout, $cordovaContacts, $ionicTabsDelegate, $ionicPopover, $localstorage, APIService, $cordovaNetwork) {
	$ionicPlatform.ready(function(){
   		try{
   			
	     // cordova.plugins.diagnostic.requestContactsAuthorization(function(status){
	     //  if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
	     //      console.log("Contacts use is authorized");
	     //  }
	     //  }, function(error){
	     //      console.error(error);
	     //  });
   			// $scope.isOnline = $cordovaNetwork.isOnline();

   		// $scope.url_prefix1 = 'http://192.168.0.102:9992/';
        $scope.url_prefix1 = 'http://192.168.0.102:9992/';

   			$scope.hideCall = true;
   			$scope.hideChat = false;
   			$scope.hideContact = true;
   			$scope.Contacts = [];
   			$rootScope.userList = [];

   			 $scope.options = {
			    loop: true
			  };
			
			var usernumber = localStorageService.get('usernumber');

			$scope.selectContact = function(){
				$scope.isAppUser = "Y";
				var conatctsel = "SELECT * from Contact where isAppUser=? ORDER BY username ASC";
					var results = DB.query(conatctsel, [$scope.isAppUser]).then(function (result) {
					    if(result.rows.length!=0){
					    	// alert(JSON.stringify(result.rows));
					    	var len = result.rows.length;
	                        for(var j=0;j<len;j++){
	                            $rootScope.userList.push({"username":result.rows.item(j).username, "image_url":result.rows.item(j).image_url, "phone":result.rows.item(j).phone,"status":result.rows.item(j).status,"isAppUser":result.rows.item(j).isAppUser,"id":result.rows.item(j).contactnumber});    
	                        } 
	                      console.log($rootScope.userList);
						}
					});
			}
			$scope.selectContact();
			
			$scope.refreshUser = [];



			$scope.RefreshContact = function(){
				$scope.isAppUser = "N";
				var conatctsel = "SELECT * from Contact where isAppUser=?";
					var results = DB.query(conatctsel, [$scope.isAppUser]).then(function (result) {
					    if(result.rows.length!=0){
					    	console.log(JSON.stringify(result.rows));
					    	var len = result.rows.length;
	                        for(var j=0;j<len;j++){
	                        	if(result.rows.item(j).phone){
		                        	var NumberValue = result.rows.item(j).phone;
		                        	NumberValue = Number(NumberValue);
		                        	if(NumberValue){
		                        		$scope.refreshUser.push(NumberValue);  
		                        	} 
		                        }
	                            var lastContactIndex = len - 1;
                				if(j == lastContactIndex) {
				                  $scope.checkValidUser();
				                } 
	                        } 
	                        console.log($scope.refreshUser);
						}
					});
			}


			$scope.checkValidUser = function(){

	          APIService.setData({
	                req_url: url_prefix + 'getAppUsers',
	                data: {user_list: $scope.refreshUser}
	            }).then(function(resp) {
	              console.log(resp);
	                if(resp.data.length > 0) {
	                  for(var i=0;i<resp.data.length; i++){
	                    var ContactNumber = resp.data[i].phone;
	                    console.log("=====ContactNumber=====",ContactNumber);
	                    if(ContactNumber){
	                      var isAppUser = "Y";
	                      var updateQry = "UPDATE Contact SET isAppUser =? WHERE phone=?";
	                       DB.query(updateQry, [isAppUser, ContactNumber]).then(function (result) {
	                          console.log('update');
	                          
	                      });
	                    }
	                  }
	                  
	                  
	                }
	               },function(resp) {
	                console.log('error',resp);
	            });
	        };

				// if($scope.isOnline==true || $scope.isOnline=="true"){
				// 	var issInsert = $localstorage.get('issInsert');
				// 	if(issInsert!='0' && issInsert!=0){
				// 		APIService.setData({
			 //                req_url: url_prefix + 'getContacts',
			 //                data:{'sender_id':usernumber}
			          
			 //            }).then(function(resp) {
			 //                if(resp.data) {
			 //                	console.log(resp.data);
			 //                		$scope.ContactList = resp.data[0].contacts;
				//                		for(var i=0; i<=resp.data[0].contacts.length; i++){ // allContacts.length
				// 						var Name = resp.data[0].contacts[i].displayName;
				// 					  	var ID = resp.data[0].contacts[i].id;
				// 					  	var Photos = resp.data[0].contacts[i].photos;
				// 					  	var NumberValue = resp.data[0].contacts[i].phoneNumbers[0].value;
				// 					  	// console.log(allContacts);
				// 					   	var ContactQry = "Insert into Contact(id, username, phone, image_url, status, created_date, last_seen, socketId) VALUES (?, ?, ?, ?, ?, ?, ? ,?)";
				// 					  	DB.query(ContactQry, [ID, Name, NumberValue, Photos]).then(function (result) {
				// 					  		console.log('insert');
				// 					  		var conatctsel = "SELECT * from Contact";
				// 							var results = DB.query(conatctsel, []).then(function (result) {
				// 							    if(result.rows.length!=0){
				// 							    	var len = result.rows.length;
				// 			                        for(var j=0;j<len;j++){
				// 			                            $rootScope.userList.push({"displayName":result.rows.item(j).displayName, "photos":result.rows.item(j).photos, "number":result.rows.item(j).contactnumber});    
				// 			                        } 
				// 								}
				// 							});
				// 						});
			 //                		}	
			 //               		}
			               	
			 //               },function(resp) {
			 //                  // This block execute in case of error.
			 //            });
			 //        }else{
			 //   //      	var conatctsel = "SELECT * from Contact";
				// 		// var results = DB.query(conatctsel, []).then(function (result) {
				// 		//     if(result.rows.length!=0){
				// 		//     	var len = result.rows.length;
		  //   //                     for(var j=0;j<len;j++){
		  //   //                         $rootScope.userList.push({"displayName":result.rows.item(j).displayName, "photos":result.rows.item(j).photos, "number":result.rows.item(j).contactnumber});    
		  //   //                     } 
				// 		// 	}
				// 		// });
			 //        }
			 //    }else{
			 	// }





			//

			// $scope.current_room = localStorageService.get('room');
			// $scope.chatlist = function(){
			// 	var chatlist = "SELECT * from Message";
			// 	var results = DB.query(chatlist, []).then(function (result) {
			// 	    if(result.rows.length!=0){
			// 	    	var len = result.rows.length;
   //                      $scope.rooms = [];
   //                      for(var j=0;j<len;j++){
   //                          $scope.rooms.push({"name":result.rows.item(j).receiver_name, "number":result.rows.item(j).receiver_id});  
   //                          // $scope.grouplist();
   //                          // localStorageService.set('checkChat',"0");  
   //                      } 
			// 		}
			// 	});
			// }
			// $scope.grouplist = function(){
			// 	var chatlist = "SELECT * from GroupList";
			// 	var results = DB.query(chatlist, []).then(function (result) {
			// 	    if(result.rows.length!=0){
			// 	    	console.log(result);
			// 	    	var len = result.rows.length;
   //                      for(var j=0;j<len;j++){
   //                          $scope.rooms.push({"name":result.rows.item(j).groupname, "number":result.rows.item(j).Creatnumber});  
   //                          // localStorageService.set('checkChat',"0");  
   //                      } 
			// 		}
			// 	});
			// }
			// $scope.grouplist();
			// var chatroomvalue = localStorageService.get('checkChat');
			// if(chatroomvalue=="1"){
				// $scope.chatlist();
			// }
			

			$scope.getConatct = function(){
				return $scope.ContactList;
			}

			

            $scope.usernumber = localStorageService.get('usernumber');



   //          $scope.enterChatRoom = function(user){
   //          	var entermsg = localStorageService.get('ActiveMsg');
			// 	if(entermsg!=''){
			// 		localStorageService.set('current_chat_friend', user.displayName);
	  //               localStorageService.set('current_friend_number', user.number);	
	  //               localStorageService.set('checkChat',"0");
	  //               SocketService.emit('join chat:room',{
	  //                   receiver_id: user.number,
	  //                   sender_id: $scope.usernumber
	  //                  });
			// 		$state.go('room');
			// 	}
            	
			// };

			

			// $scope.enterRoom = function(room_name){
			// 	$scope.current_room = room_name.name;
			// 	localStorageService.set('current_chat_friend', room_name.name);
			// 	localStorageService.set('roomName', room_name.name);
			// 	localStorageService.set('current_friend_number', room_name.number);
				
			// 	var room = {
			// 		'room_name': name
			// 	};

			// 	SocketService.emit('join:room', room);

			// 	$state.go('room');
			// };


			$scope.usernumber = localStorageService.get('usernumber');
			// APIService.setData({
   //              req_url: url_prefix + 'getUser',
   //              data: {}
   //          }).then(function(resp) {
   //              if(resp.data) {
   //                  $rootScope.userList = resp.data;
   //                  console.log($rootScope.userList);
   //              }
   //             },function(resp) {
   //                // This block execute in case of error.
   //          });

            APIService.setData({
                req_url: url_prefix + 'getGroups',
                data: {user_number:$scope.usernumber}
            }).then(function(resp) {
            	console.log(resp);
                if(resp.data) {
                    $rootScope.groupList = resp.data;
                }
               },function(resp) {
                  // This block execute in case of error.
            });


            $scope.enterChatRoom = function(user){
            	localStorage.setItem("userchat", JSON.stringify(user));
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
				console.log(room_name);
				localStorageService.set('room', room_name);
				
				var room = {
					'room_name': room_name
				};

				SocketService.emit('join:room', room);

				$state.go('room');
			};
            $scope.enterGroupRoom = function(room){
            	localStorageService.set('current_room', room.group_name);
            	localStorage.setItem("groupList", JSON.stringify(room));
				localStorageService.set('room_id', room.room_id);
				localStorageService.set('room_check_ID', room._id);
				localStorage.setItem("userList", JSON.stringify(room.users));
				SocketService.emit('join group chat:room',{
                    room_id: room.room_id,
                    sender_id: $scope.usernumber
                   });

				$state.go('groupChat');
			};

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


		}catch(err){
	      console.log(err.message);
	    }
	});

});