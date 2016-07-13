angular.module('Room.controllers', [])

.controller('RoomCtrl', function($scope, $ionicModal, $state, localStorageService, $ionicPlatform, SocketService, $timeout, moment, $ionicScrollDelegate, DB) {

	$ionicPlatform.ready(function(){
		try{
		
		setTimeout(function() {
			$ionicScrollDelegate.scrollBottom();
		}, 10);
		// $scope.online = false;
		// $scope.typing = true;
		$scope.messages = [];
        $scope.messageList = [];

        $ionicModal.fromTemplateUrl('templates/uploadview.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		}).then(function(uploadview) {
		    $scope.uploadview = uploadview;
		});
		$scope.openModaluploadview = function() {
		    $scope.uploadview.show();
		};
		$scope.closeModaluploadview = function() {
		    $scope.uploadview.hide();
		};

		
		$scope.humanize = function(timestamp){
			return moment(timestamp).fromNow();
		};
		$scope.isNotCurrentUser = function(user){
			
			if($scope.current_user != user){
				return 'not-current-user';
			}
			return 'current-user';
		};
		// $scope.current_room = localStorageService.get('current_room');
		
		$scope.current_user = localStorageService.get('username');
        $scope.usernumber = localStorageService.get('usernumber');
        $scope.current_chat_friend = localStorageService.get('current_chat_friend');
        $scope.current_friend_number = localStorageService.get('current_friend_number');


		$scope.isNotCurrentUser = function(user){
			
			if($scope.current_user != user){
				return 'not-current-user';
			}
			return 'current-user';
		};
        $scope.startTyping = function() {
            var data_server={
                'room_id': $scope.current_room_id,
				'sender_id': $scope.usernumber,
                'message':$scope.current_user+" is typing"
            }
            SocketService.emit('start typing',data_server); //sending data to server
        };
        $scope.stopTyping = function() {
            var data={
                'room_id': $scope.current_room_id,
				'sender_id': $scope.usernumber,
                'message': ''
            }
            SocketService.emit('stop typing',data); //sending data to server
        };
        SocketService.on('listen start typing', function(msg){

        	if(msg.sender_id != $scope.usernumber) {
        		if($scope.current_receiver_id == msg.sender_id)
	                $scope.type_message = $scope.current_user+" is typing";
	                $scope.current_receiver_id = msg.sender_id;
	       //          $scope.online = true;
				    // $scope.typing = false;
	            }
		});
		
		 SocketService.on('listen stop typing', function(msg){
	        	$timeout(function() {
	        		if(msg.sender_id != $scope.usernumber) {
		                $scope.type_message = msg.message;
		                $scope.current_receiver_id = '';
		       //          $scope.online = false;
				   		// $scope.typing = true;
		            }
	        	}, 800);
	            
		});
		
       




		$scope.sendTextMessage = function(){
			if($scope.message!='' && $scope.message!=null){
				$scope.msg = {
					'room_id': $scope.current_room_id,
					'sender_id': $scope.usernumber,
	                'sender_name': $scope.current_user,
					'receiver_id': $scope.current_friend_number,
	                'receiver_name': $scope.current_chat_friend,
					'message': $scope.message,
					'time': moment()
				};
				console.log($scope.msg);
				
				$scope.messageList.push($scope.msg);
				console.log($scope.messageList);
				$ionicScrollDelegate.scrollBottom();
				$scope.message = '';
				
				SocketService.emit('new message', $scope.msg);
			}
			
		};
        SocketService.on('message created', function(msg){
        	console.log(msg);
            if(msg.sender_id != $scope.usernumber)
			$scope.messageList.push(msg);
			console.log($scope.messageList);
			$ionicScrollDelegate.scrollBottom();
		});

		// $scope.leaveRoom = function(){
	
		// 	$scope.msg = {
		// 		'user': $scope.current_user,
		// 		'room': $scope.current_room,
		// 		'time': moment()
		// 	};

		// 	SocketService.emit('leave:room', $scope.msg);
		// 	$state.go('home');

		// };
        SocketService.on('user data', function(msg){
			$scope.messageList = msg;
			console.log($scope.messageList);
			$ionicScrollDelegate.scrollBottom();
		});
        SocketService.on('current room id', function(data){
			$scope.current_room_id = data.current_room_id;
			console.log(data.current_room_id);
			alert(data.current_room_id);
			$ionicScrollDelegate.scrollBottom();
		});

		$scope.leaveRoom = function(){

            SocketService.emit('leave chat:room', {'room_id': $scope.current_room_id});
            SocketService.removeAllListeners('listen start typing');
            SocketService.removeAllListeners('listen stop typing');
            SocketService.removeAllListeners('message created');
            SocketService.removeAllListeners('user data');
            SocketService.removeAllListeners('current room id');
            $state.go('home');
        };
     
      

		// $scope.sendTextMessage = function(){
		// 	if($scope.message!=''){
		// 		localStorageService.set('ActiveMsg', $scope.message);
		// 		$scope.msg = {
		// 		'room_id': $scope.current_room_id,
		// 		'sender_id': $scope.usernumber,
  //               'sender_name': $scope.current_user,
		// 		'receiver_id': $scope.current_friend_number,
  //               'receiver_name': $scope.current_chat_friend,
		// 		'message': $scope.message,
		// 		'time': moment()
		// 		};
		// 		var MessageQry = "Insert into ChatList(sender_id, sender_name, receiver_id, receiver_name, message, time) VALUES (?, ?, ?, ?, ?, ?)";
		//   		DB.query(MessageQry, [$scope.usernumber, $scope.current_user, $scope.current_friend_number, $scope.current_chat_friend,  $scope.message, moment()]).then(function (result) {
	 //  				console.log("insert", result);
	 //  				setTimeout(function() {
		// 				$ionicScrollDelegate.scrollBottom();
		// 			}, 10);
		// 		});
		// 		var chatlist = "SELECT * from Message where receiver_name=?";
		// 		var results = DB.query(chatlist, [$scope.current_chat_friend]).then(function (result) {
		// 			console.log(result.rows);
		// 			// console.log(result.rows[0]);
		// 		    if(result.rows.length==0){
		// 				var MessageQry = "Insert into Message(room_id, sender_id, sender_name, receiver_id, receiver_name, message, time) VALUES (?, ?, ?, ?, ?, ?, ?)";
		// 		  		DB.query(MessageQry, [$scope.current_room_id, $scope.usernumber, $scope.current_user, $scope.current_friend_number, $scope.current_chat_friend,  $scope.message, moment()]).then(function (result) {
		// 	  				console.log("insert All List", result);
		// 				});
		// 			}else if(result.rows.item[0].receiver_name!=$scope.current_chat_friend){
		// 		    	var MessageQry = "Insert into Message(room_id, sender_id, sender_name, receiver_id, receiver_name, message, time) VALUES (?, ?, ?, ?, ?, ?, ?)";
		// 		  		DB.query(MessageQry, [$scope.current_room_id, $scope.usernumber, $scope.current_user, $scope.current_friend_number, $scope.current_chat_friend,  $scope.message, moment()]).then(function (result) {
		// 	  				console.log("insert All List", result);
		// 	  				setTimeout(function() {
		// 						$ionicScrollDelegate.scrollBottom();
		// 					}, 10);
		// 				});
		// 			}else{
		// 				console.log("insert All Ready List");
		// 			}
		// 		});
			
 
			
						
			
  //          	$scope.messageList.push($scope.msg);
		// 	$scope.message = "";
		// 	setTimeout(function() {
		// 		$ionicScrollDelegate.scrollBottom();
		// 	}, 10);
			
		// 	 SocketService.emit('new message', $scope.msg);
		// 	}
			
		// };
  //       SocketService.on('message created', function(msg){
  //           if(msg.sender_id != $scope.usernumber)
		// 	$scope.messageList.push(msg);
		// 	setTimeout(function() {
		// 		$ionicScrollDelegate.scrollBottom();
		// 	}, 10);
		// });


		// $scope.SelectAllMsg = function(){
  //       	var messagesel = "SELECT * from ChatList WHERE receiver_id=?";
		// 	var results = DB.query(messagesel, [$scope.current_friend_number]).then(function (result) {
		// 		console.log(result);
		// 	    if(result.rows.length!=0){
		// 	    	var len = result.rows.length;
  //                   for(var j=0;j<len;j++){
  //                       $scope.messageList.push({"sender_id":result.rows.item(j).sender_id, "sender_name":result.rows.item(j).sender_name, "receiver_id":result.rows.item(j).receiver_id, "receiver_name":result.rows.item(j).receiver_name, "message":result.rows.item(j).message, "time":result.rows.item(j).time});   
  //                       console.log($scope.messageList); 
  //                   } 
		// 		}
		// 	});
		// 	setTimeout(function() {
		// 		$ionicScrollDelegate.scrollBottom();
		// 	}, 10);
  //       }
  //       $scope.SelectAllMsg();

		// $scope.leaveRoom = function(){
	
		// 	$scope.msg = {
		// 		'user': $scope.current_user,
		// 		'room': $scope.current_room,
		// 		'time': moment()
		// 	};

		// 	SocketService.emit('leave:room', $scope.msg);
		// 	$state.go('home');

		// };


		

	}catch(err){
	      console.log(err.message);
	    }
	});

})