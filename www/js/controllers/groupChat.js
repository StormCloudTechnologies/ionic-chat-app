angular.module('GroupChat.controllers', [])

.controller('GroupChatCtrl', function($scope, $ionicModal, $timeout, $state, localStorageService, $cordovaCamera, $cordovaFileTransfer, $ionicPlatform, SocketService, moment, $ionicScrollDelegate, $ionicLoading) {

	$ionicPlatform.ready(function(){
		try{
		
		$scope.messages = [];
        $scope.messageList = [];
        $scope.url_prefix = 'http://192.168.0.105:9992/';

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
        $scope.typistList = [];
        $scope.cameraOpen = function(){
          try{
            localStorage.setItem("type","camera");
            var options = {
              quality : 100,
              destinationType : Camera.DestinationType.FILE_URI,
              sourceType : Camera.PictureSourceType.CAMERA,
              allowEdit : false,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 277,
              targetHeight: 250,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false,
              correctOrientation: true
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
              $scope.ProfilePic = imageData;
             $scope.uploadPhoto($scope.ProfilePic);
            }, function(err) {
                console.log(err.message);
            });
          }
          catch(err){
            console.log(err.message);
          }
        };


       
        $scope.galleryOpen = function(){
          try{
            localStorage.setItem("type","gallery");
            var options = {
              quality : 100,
              destinationType : Camera.DestinationType.FILE_URI,
              sourceType : Camera.PictureSourceType.PHOTOLIBRARY ,
              allowEdit : false,
              targetWidth: 277,
              targetHeight: 250,
              encodingType: Camera.EncodingType.JPEG,
              popoverOptions: CameraPopoverOptions,
              correctOrientation: false
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
              $scope.ProfilePic = imageData;
              $scope.uploadPhoto($scope.ProfilePic);
            }, function(err) {
              console.log(err.message);
            });
          }
          catch(err){
            console.log(err.message);
          }
        }
        $scope.uploadPhoto = function(file){
          try{
            $ionicLoading.show({
             duration: 10000
            });
            console.log("====url_prefix====",url_prefix);
            var filePath = file;
            var Checktype = localStorage.getItem("type");
            var server =  encodeURI(url_prefix+"uploadPhoto");
              if(Checktype=="gallery"){
                var imageURI = filePath;
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = filePath.substr(filePath.lastIndexOf('/')+1);
                options.mimeType = "uploads/png";
                var params = new Object();
                options.params = params;
                var headers={'headerParam':'application/json'};
                options.headers = headers;
                options.chunkedMode = false;
                 var res = options.fileName.split("?");
                 options.fileName = res[0];
                console.log("gallery", options.fileName);
              }
              if(Checktype=="camera"){
                var imageURI = filePath;
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = filePath.substr(filePath.lastIndexOf('/')+1);
                options.mimeType = "uploads/png";
                var params = new Object();
                options.params = params;
                var headers={'headerParam':'application/json'};
                options.headers = headers;
                options.chunkedMode = false;
                console.log(JSON.stringify(options));
              }
            console.log("===server====",server);
            console.log("===filePath====",filePath);
            $cordovaFileTransfer.upload(server, filePath, options)
              .then(function(result) {
                try{
                    console.log(result.response);
                     var obj = JSON.parse(result.response);
                     var imagePath = obj.path;
                    
                     $ionicLoading.hide();
                     $scope.msg = {
                        'room_id': $scope.current_room_id,
                        'sender_id': $scope.usernumber,
                        'sender_name': $scope.current_user,
                        'image_url': imagePath,
                        'time': moment()
                    };


                    $scope.messageList.push($scope.msg);
                    console.log("===cordova file transfer====",$scope.messageList);
                    $ionicScrollDelegate.scrollBottom();

                    SocketService.emit('new group message', $scope.msg);
                    }catch(err){
                      // alert(err.message);
                    }
                  }, function(err) {
                    console.log(err);
                    $ionicLoading.hide();
                  }, function (progress) {
                     console.log(progress);
                    $ionicLoading.hide();
                  });
                }catch(err){
                  // alert(err.message);
                }
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
        SocketService.on('listen share image', function(msg){

        	if(msg.sender_id != $scope.usernumber) {
        		$scope.image_data = msg.imageData;
            }
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
			console.log("===group message created====",$scope.messageList);
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