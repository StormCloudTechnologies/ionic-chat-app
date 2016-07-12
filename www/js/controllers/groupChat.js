angular.module('groupchat.controllers', [])

.controller('GroupChatCtrl', function($scope, $state, localStorageService, $ionicPlatform, SocketService, moment, $ionicScrollDelegate) {

	$ionicPlatform.ready(function(){
		try{
		
		$scope.messages = [];
        $scope.messageList = [];

		$scope.humanize = function(timestamp){
			return moment(timestamp).fromNow();
		};

		$scope.current_room = localStorageService.get('current_room');
		
		$scope.current_user = localStorageService.get('username');
        $scope.usernumber = localStorageService.get('usernumber');
        $scope.current_room_id = localStorageService.get('room_id');

		$scope.isNotCurrentUser = function(user){
			
			if($scope.current_user != user){
				return 'not-current-user';
			}
			return 'current-user';
		};


		$scope.sendTextMessage = function(){

			$scope.msg = {
				'room_id': $scope.current_room_id,
				'sender_id': $scope.usernumber,
                'sender_name': $scope.current_user,
				'message': $scope.message,
				'time': moment()
			};

			
			$scope.messageList.push($scope.msg);
			$ionicScrollDelegate.scrollBottom();
			
			SocketService.emit('new group message', $scope.msg);
		};
        SocketService.on('group message created', function(msg){
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
        SocketService.on('group data', function(msg){
			$scope.messageList = msg;
			$ionicScrollDelegate.scrollBottom();
		});


		

	}catch(err){
	      console.log(err.message);
	    }
	});

})