angular.module('GroupChat.controllers', [])

.controller('GroupChatCtrl', function($scope, $ionicModal, $timeout, $state, localStorageService, $ionicPlatform, SocketService, moment, $ionicScrollDelegate) {

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
        alert($scope.current_room_id);
		$scope.isNotCurrentUser = function(user){
			
			if($scope.current_user != user){
				return 'not-current-user';
			}
			return 'current-user';
		};
        $scope.typistList = [];
        $scope.startTyping = function() {
            var data_server={
                'room_id': $scope.current_room_id,
				'sender_id': $scope.usernumber,
                'message':$scope.current_user+" is typing"
            }
            SocketService.emit('start typing',data_server); //sending data to server
        };
        $scope.stopTyping = function() {
          console.log("msg.message");
            var data={
                'room_id': $scope.current_room_id,
				'sender_id': $scope.usernumber,
                'message': ''
            }
            SocketService.emit('stop typing',data); //sending data to server
        };
        SocketService.on('listen start typing', function(msg){
            if(msg.sender_id != $scope.usernumber) {
                if(!(msg.sender_id in $scope.typistList))
                $scope.typistList.push(msg.sender_id);
                $scope.type_message = msg.message;
            }
		});
        SocketService.on('listen stop typing', function(msg){
        	$timeout(function() {
	            if(msg.sender_id != $scope.usernumber) {
	                $scope.typistList.push(msg.sender_id);
	              console.log("msg.message",msg.message);
	                $scope.type_message = msg.message;
	            }
            }, 600);
		});

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


		$scope.sendTextMessage = function(){
			if($scope.message!='' && $scope.message!=null){
				$scope.msg = {
					'room_id': $scope.current_room_id,
					'sender_id': $scope.usernumber,
	                'sender_name': $scope.current_user,
					'message': $scope.message,
					'time': moment()
				};

				
				$scope.messageList.push($scope.msg);
				console.log($scope.messageList);
				$ionicScrollDelegate.scrollBottom();
				$scope.message = "";
				
				SocketService.emit('new group message', $scope.msg);
			}
		};
        SocketService.on('group message created', function(msg){
            if(msg.sender_id != $scope.usernumber)
			$scope.messageList.push(msg);
			console.log($scope.messageList);
			$ionicScrollDelegate.scrollBottom();
		});

        SocketService.on('group data', function(msg){
			$scope.messageList = msg;
			console.log($scope.messageList);
			$ionicScrollDelegate.scrollBottom();
		});

        $scope.leaveGroupRoom = function(){
        	console.log("call");
            SocketService.emit('leave group chat:room', {'room_id': $scope.current_room_id});
            SocketService.removeAllListeners('listen start typing');
            SocketService.removeAllListeners('listen stop typing');
            SocketService.removeAllListeners('group message created');
            SocketService.removeAllListeners('group data');
            $state.go('home');
        };

		

	}catch(err){
	      console.log(err.message);
	    }
	});

})