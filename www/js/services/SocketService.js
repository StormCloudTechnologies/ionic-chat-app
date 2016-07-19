(function(){

	angular.module('ChatApp')
	.service('SocketService', ['socketFactory', SocketService]);

	function SocketService(socketFactory){
		return socketFactory({
			
			//ioSocket: io.connect('http://localhost:9992')
			// ioSocket: io.connect('http://52.36.75.89:9992')
			ioSocket: io.connect('http://192.168.0.102:9992')

		});
	}
})();