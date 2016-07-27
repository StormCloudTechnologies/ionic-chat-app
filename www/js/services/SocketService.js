(function(){

	angular.module('ChatApp')
	.service('SocketService', ['socketFactory', SocketService]);

    var username = localStorage.getItem('ls.username');
    var usernumber = localStorage.getItem('ls.usernumber');

	function SocketService(socketFactory){
		return socketFactory({
			// ioSocket: io.connect('http://localhost:9992', { query: "usernumber="+ usernumber+"&username="+username})
			ioSocket: io.connect('http://52.36.75.89:9992', { query: "usernumber="+ usernumber+"&username="+username})
			// ioSocket: io.connect('http://52.36.75.89:9992')
			// ioSocket: io.connect('http://192.168.0.105:9992')

		});
	}
})();