angular.module('Home.controllers', [])

.controller('HomeCtrl', function($scope, DB, $state, localStorageService, $ionicPlatform, SocketService, $ionicSlideBoxDelegate, $timeout, $cordovaContacts, $ionicTabsDelegate, $ionicPopover, $localstorage, APIService, $cordovaNetwork) {
	$ionicPlatform.ready(function(){
   		try{
   			$scope.isOnline = $cordovaNetwork.isOnline();
   			$scope.hideCall = false;
   			$scope.hideChat = true;
   			$scope.hideContact = true;
   			$scope.Contacts = [];

   			 $scope.options = {
			    loop: true
			  };

   			$scope.onTouch = function(){ $ionicSlideBoxDelegate.enableSlide(false); };

			$scope.onRelease = function(){ $ionicSlideBoxDelegate.enableSlide(true); };

			$scope.nextSlide = function() { $ionicSlideBoxDelegate.next(); };

			$scope.previousSlide = function() { $ionicSlideBoxDelegate.previous(); };

			var usernumber = localStorageService.get('usernumber');

			$scope.ContactList = [];
			$scope.selectContact = function(){
				if($scope.isOnline==true || $scope.isOnline=="true"){
					var issInsert = $localstorage.get('issInsert');
					if(issInsert!='0' && issInsert!=0){
						APIService.setData({
			                req_url: url_prefix + 'getContacts',
			                data:{'sender_id':usernumber}
			          
			            }).then(function(resp) {
			                if(resp.data) {
			                	console.log(resp.data);
			                		$scope.ContactList = resp.data[0].contacts;
				               		for(var i=0; i<=resp.data[0].contacts.length; i++){ // allContacts.length
										var Name = resp.data[0].contacts[i].displayName;
									  	var ID = resp.data[0].contacts[i].id;
									  	var Photos = resp.data[0].contacts[i].photos;
									  	var NumberValue = resp.data[0].contacts[i].phoneNumbers[0].value;
									  	// console.log(allContacts);
									   	var ContactQry = "Insert into Contact(id, displayName, contactnumber, photos) VALUES (?, ?, ?, ?)";
									  	DB.query(ContactQry, [ID, Name, NumberValue, Photos]).then(function (result) {
									  		console.log('insert');
									  		$localstorage.set('issInsert', "0");
											// $scope.selectContact();
										});
			                		}	
			               		}
			               	
			               },function(resp) {
			                  // This block execute in case of error.
			            });
			        }else{
			        	var conatctsel = "SELECT * from Contact";
						var results = DB.query(conatctsel, []).then(function (result) {
						    if(result.rows.length!=0){
						    	var len = result.rows.length;
		                        for(var j=0;j<len;j++){
		                            $scope.ContactList.push({"displayName":result.rows.item(j).displayName, "photos":result.rows.item(j).photos, "number":result.rows.item(j).contactnumber});    
		                        } 
							}
						});
			        }
			    }else{
		        	var conatctsel = "SELECT * from Contact";
					var results = DB.query(conatctsel, []).then(function (result) {
					    if(result.rows.length!=0){
					    	var len = result.rows.length;
	                        for(var j=0;j<len;j++){
	                            $scope.ContactList.push({"displayName":result.rows.item(j).displayName, "photos":result.rows.item(j).photos, "number":result.rows.item(j).contactnumber});    
	                        } 
						}
					});
				}
			}

			$scope.getAllContacts = function() {
				 try{
				    var options = {                                       // 'Bob'
				      multiple: true 
				    };
					$cordovaContacts.find(options).then(function (allContacts) {
						APIService.setData({
			                req_url: url_prefix + 'createContact',
			                data:{'contacts':allContacts, 'sender_id':usernumber}
			          
			            }).then(function(resp) {
			                if(resp.data) {
			                	console.log(resp.data);
			                	$localstorage.set('issload', "0");
			                 	$scope.selectContact();
			                }
			               },function(resp) {
			                  // This block execute in case of error.
			            });					
					});
				 }catch(err){
					 alert(err.message);
				 }
			};
			 var isslogin = $localstorage.get('issload');
		      if(isslogin!="0" && isslogin!=0){
		        $scope.getAllContacts();
		      }else{
		      	$scope.selectContact();
		      }

			//

			$scope.current_room = localStorageService.get('room');
			$scope.chatlist = function(){
				var chatlist = "SELECT * from Message";
				var results = DB.query(chatlist, []).then(function (result) {
				    if(result.rows.length!=0){
				    	console.log(result.rows);
				    	var len = result.rows.length;
                        $scope.rooms = [];
                        for(var j=0;j<len;j++){
                            $scope.rooms.push({"name":result.rows.item(j).receiver_name, "number":result.rows.item(j).receiver_id});  
                            // localStorageService.set('checkChat',"0");  
                        } 
					}
				});
			}
			// var chatroomvalue = localStorageService.get('checkChat');
			// if(chatroomvalue=="1"){
				$scope.chatlist();
			// }
			

			$scope.getConatct = function(){
				return $scope.ContactList;
			}

			

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
            	var entermsg = localStorageService.get('ActiveMsg');
				if(entermsg!=''){
					localStorageService.set('current_chat_friend', user.displayName);
	                localStorageService.set('current_friend_number', user.number);	
					SocketService.emit('join chat:room',{
	                    receiver_id: user.number,
	                    sender_id: $scope.usernumber
	                   });
					$state.go('room');
				}
            	
			};

			

			$scope.enterRoom = function(room_name){
				
				$scope.current_room = room_name.name;
				localStorageService.set('room', room_name.name);
				
				var room = {
					'room_name': name
				};

				SocketService.emit('join:room', room);

				$state.go('room');
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

			
			
		}catch(err){
	      console.log(err.message);
	    }
	});

});