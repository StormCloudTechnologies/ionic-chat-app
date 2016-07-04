angular.module('Room.controllers', [])

.controller('RoomCtrl', function($scope, $ionicModal, $state, localStorageService, $ionicPlatform, SocketService, moment, $ionicScrollDelegate, DB) {

	$ionicPlatform.ready(function(){
		try{
		
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

		$scope.current_room = localStorageService.get('current_room');
		
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


		$scope.sendTextMessage = function(){
			if($scope.message!=''){
				localStorageService.set('ActiveMsg', $scope.message);
				$scope.msg = {
				'room_id': $scope.current_room_id,
				'sender_id': $scope.usernumber,
                'sender_name': $scope.current_user,
				'receiver_id': $scope.current_friend_number,
                'receiver_name': $scope.current_chat_friend,
				'message': $scope.message,
				'time': moment()
				};

			// var chatlist = "SELECT * from Message";
			// var results = DB.query(chatlist, []).then(function (result) {
			// 	if(result.rows.length!=0){
			// 	   console.log(result.rows);
			// 	   var len = result.rows.length;
   //                      for(var j=0;j<len;j++){
			// 		        if(result.rows.item(j).receiver_name!=$scope.current_chat_friend){
		                   		var MessageQry = "Insert into Message(room_id, sender_id, sender_name, receiver_id, receiver_name, message, time) VALUES (?, ?, ?, ?, ?, ?, ?)";
						  		DB.query(MessageQry, [$scope.current_room_id, $scope.usernumber, $scope.current_user, $scope.current_friend_number, $scope.current_chat_friend,  $scope.message, moment()]).then(function (result) {
						  				console.log("insert");
						  				// localStorageService.set('checkChat',"1");
									});
		 //                    }
		 //                }
               
			// 	}
			// })
			
			$scope.messageList.push($scope.msg);
			$scope.message = "";
			$ionicScrollDelegate.scrollBottom();
			
			SocketService.emit('new message', $scope.msg);
			}
			
		};
        SocketService.on('message created', function(msg){
            if(msg.sender_id != $scope.usernumber)
			$scope.messageList.push(msg);
			$ionicScrollDelegate.scrollBottom();
		});

		$scope.leaveRoom = function(){
	
			$scope.msg = {
				'user': $scope.current_user,
				'room': $scope.current_room,
				'time': moment()
			};

			SocketService.emit('leave:room', $scope.msg);
			$state.go('home');

		};
        SocketService.on('user data', function(msg){
			$scope.messageList = msg;
			$ionicScrollDelegate.scrollBottom();
		});
        SocketService.on('current room id', function(data){
			$scope.current_room_id = data.current_room_id;
			console.log("===$scope.current_room_id====",$scope.current_room_id);
			$ionicScrollDelegate.scrollBottom();
		});


		

	}catch(err){
	      console.log(err.message);
	    }
	});

})