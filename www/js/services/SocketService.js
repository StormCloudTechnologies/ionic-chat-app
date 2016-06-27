(function(){

	angular.module('starter')
	.service('SocketService', ['socketFactory', SocketService]);

	function SocketService(socketFactory){
		return socketFactory({
			
			ioSocket: io.connect('http://192.168.0.105:9992')

		});
	}
})();