(function(){
	angular.module('starter')
	.controller('HomeController', ['$scope', '$state', 'localStorageService', 'SocketService', HomeController]);
	
	function HomeController($scope, $state, localStorageService, SocketService){

		var me = this;

		me.current_room = localStorageService.get('room');
		me.rooms = ['Storm', 'Cloud', 'Technologies'];
		

		$scope.login = function(username){
			localStorageService.set('username', username);
			$state.go('rooms');
		};


		$scope.enterRoom = function(room_name){

			me.current_room = room_name;
			localStorageService.set('room', room_name);
			
			var room = {
				'room_name': room_name
			};

			SocketService.emit('join:room', room);

			$state.go('room');
		};

	}

})();