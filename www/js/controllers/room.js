angular.module('Room.controllers', [])

.controller('RoomCtrl', function($scope, $state, localStorageService, $ionicPlatform, SocketService, moment, $ionicScrollDelegate) {

	$ionicPlatform.ready(function(){
		try{
		
		$scope.messages = [];

		$scope.humanize = function(timestamp){
			return moment(timestamp).fromNow();
		};

		$scope.current_room = localStorageService.get('room');
		
		$scope.current_user = localStorageService.get('username');

		$scope.isNotCurrentUser = function(user){
			
			if($scope.current_user != user){
				return 'not-current-user';
			}
			return 'current-user';
		};


		$scope.sendTextMessage = function(){

			$scope.msg = {
				'room': $scope.current_room,
				'user': $scope.current_user,
				'text': $scope.message,
				'time': moment()
			};

			
			$scope.messages.push($scope.msg);
			console.log($scope.messages);
			$ionicScrollDelegate.scrollBottom();

			$scope.message = '';
			
			SocketService.emit('send:message', $scope.msg);
		};


		$scope.leaveRoom = function(){
	
			$scope.msg = {
				'user': $scope.current_user,
				'room': $scope.current_room,
				'time': moment()
			};

			SocketService.emit('leave:room', $scope.msg);
			$state.go('home');

		};


		SocketService.on('message', function(msg){
			me.messages.push(msg);
			$ionicScrollDelegate.scrollBottom();
		});

	}catch(err){
	      console.log(err.message);
	    }
	});

})