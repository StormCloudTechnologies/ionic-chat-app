angular.module('GroupChat.controllers', [])

.controller('GroupChatCtrl', function($scope, $ionicModal, $timeout, $state, localStorageService, $cordovaCamera, $cordovaFileTransfer, $ionicPlatform, SocketService, moment, $ionicScrollDelegate, $ionicLoading, $cordovaCapture, $cordovaMedia) {

	$ionicPlatform.ready(function(){
		try{
		    $ionicScrollDelegate.scrollBottom();
		    $scope.messages = [];
        $scope.messageList = [];
        // $scope.url_prefix1 = 'http://192.168.0.105:9992/';
        $scope.url_prefix1 = 'http://192.168.0.102:9992/';

    $scope.videoDiv = "true";
    $scope.AudioDiv = "true";
    $scope.ImageDiv = "true";        

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


          $scope.captureVideo = function() {
            var options = { limit: 1, duration: 30 };

            $cordovaCapture.captureVideo(options).then(function(videoData) {
               localStorage.setItem("type","gallery");
               $scope.ProfilePic = videoData[0].fullPath;
                   console.log(videoData[0].fullPath);
                   $scope.uploadPhoto($scope.ProfilePic);
            }, function(err) {
              // An error occurred. Show a message to the user
            });
          }

        $scope.captureAudio = function() {
            var options = { limit:1, duration: 30 };
          $cordovaCapture.captureAudio(options).then(function(audioData) {
               localStorage.setItem("type","gallery");
               $scope.ProfilePic = audioData[0].fullPath;
                   console.log(audioData[0].fullPath);
                   $scope.uploadPhoto($scope.ProfilePic);
            }, function(err) {
              // An error occurred. Show a message to the user
            });
        }
       
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
              mediaType: Camera.MediaType.ALLMEDIA,   
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
                      var res = imagePath.split(".");
                      var check = res[1];
                      console.log(check);
                    if(check=="mp4" || check=="MP4" || check=="3gp"){
                        $scope.msg = {
                            'room_id': $scope.current_room_id,
                            'sender_id': $scope.usernumber,
                            'sender_name': $scope.current_user,
                            'video_url': imagePath,
                            'time': moment()
                         };
                          console.log($scope.msg);
                        $scope.messageList.push($scope.msg);
                        console.log("===cordova file transfer====",$scope.messageList);
                        $ionicScrollDelegate.scrollBottom();
                        SocketService.emit('new group message', $scope.msg);
                      }else if(check=="amr" || check=="mp3"){
                          $scope.msg = {
                            'room_id': $scope.current_room_id,
                            'sender_id': $scope.usernumber,
                            'sender_name': $scope.current_user,
                            'audio_url': imagePath,
                            'time': moment()
                         };
                        console.log($scope.msg);
                        $scope.messageList.push($scope.msg);
                        console.log("===cordova file transfer====",$scope.messageList);
                        $ionicScrollDelegate.scrollBottom();
                        SocketService.emit('new group message', $scope.msg);
                    }else{
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
                   }
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

        $scope.downloadVideo=function(videoFile){
          console.log(videoFile);
          var resVideo = videoFile.split('-');
          var filename = resVideo[1];
            var url = $scope.url_prefix1+'public/uploads/file-'+filename;
            console.log(targetPath);
            if($scope.usernumber){
              var targetPath = cordova.file.externalRootDirectory+"StormChat/videos/sent/file-"+ filename;
              $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                  console.log(result);
                  console.log(result.nativeURL);
                  $scope.videoDiv = "false";
                  // $scope.openModalvideoplay(result.fullPath);
                  $scope.msg = {
                      'room_id': $scope.current_room_id,
                      'sender_id': $scope.usernumber,
                      'sender_name': $scope.current_user,
                      'video_url': result.nativeURL,
                      'time': moment()
                   };
                    console.log($scope.msg);
                  $scope.messageList.push($scope.msg);
                  console.log("===cordova file transfer====",$scope.messageList);
                  $ionicScrollDelegate.scrollBottom();
                  SocketService.emit('new group message', $scope.msg);

                  console.log('Success');
                  $ionicScrollDelegate.scrollBottom();
              }, function (error) {
                  console.log('Error', error);
              }, function (progress) {
                  // PROGRESS HANDLING GOES HERE
              });
            }else{
                var targetPath = cordova.file.externalRootDirectory+"StormChat/videos/file-"+ filename;
                $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                  console.log(result);
                  console.log(result.nativeURL);
                  $scope.videoDiv = "false";
                  // $scope.openModalvideoplay(result.fullPath);
                  $scope.msg = {
                      'room_id': $scope.current_room_id,
                      'sender_id': $scope.usernumber,
                      'sender_name': $scope.current_user,
                      'video_url': result.nativeURL,
                      'time': moment()
                   };
                    console.log($scope.msg);
                  $scope.messageList.push($scope.msg);
                  console.log("===cordova file transfer====",$scope.messageList);
                  $ionicScrollDelegate.scrollBottom();
                  SocketService.emit('new group message', $scope.msg);

                  console.log('Success');
                  $ionicScrollDelegate.scrollBottom();
              }, function (error) {
                  console.log('Error', error);
              }, function (progress) {
                  // PROGRESS HANDLING GOES HERE
              });
           }
        }; 
        $scope.downloadAudio=function(AudioFile){
          console.log(AudioFile);
          var resAudio = AudioFile.split('-');
          var filename = resAudio[1];
            var url = $scope.url_prefix1+'public/uploads/file-'+filename;
            if($scope.usernumber){
              var targetPath = cordova.file.externalRootDirectory+"StormChat/audio/sent/file-"+ filename;
              $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                  console.log(result);
                  console.log(result.nativeURL);
                  $scope.AudioDiv = "false";
                  // $scope.openModalvideoplay(result.fullPath);
                  $scope.msg = {
                      'room_id': $scope.current_room_id,
                      'sender_id': $scope.usernumber,
                      'sender_name': $scope.current_user,
                      'audio_url': result.nativeURL,
                      'time': moment()
                   };
                    console.log($scope.msg);
                  $scope.messageList.push($scope.msg);
                  console.log("===cordova file transfer====",$scope.messageList);
                  $ionicScrollDelegate.scrollBottom();
                  SocketService.emit('new group message', $scope.msg);

                  console.log('Success');
                  $ionicScrollDelegate.scrollBottom();
              }, function (error) {
                  console.log('Error', error);
              }, function (progress) {
                  // PROGRESS HANDLING GOES HERE
              });
            }else{
                var targetPath = cordova.file.externalRootDirectory+"StormChat/audio/file-"+ filename;
                $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                  console.log(result);
                  console.log(result.nativeURL);
                  $scope.AudioDiv = "false";
                  // $scope.openModalvideoplay(result.fullPath);
                  $scope.msg = {
                      'room_id': $scope.current_room_id,
                      'sender_id': $scope.usernumber,
                      'sender_name': $scope.current_user,
                      'audio_url': result.nativeURL,
                      'time': moment()
                   };
                    console.log($scope.msg);
                  $scope.messageList.push($scope.msg);
                  console.log("===cordova file transfer====",$scope.messageList);
                  $ionicScrollDelegate.scrollBottom();
                  SocketService.emit('new group message', $scope.msg);

                  console.log('Success');
                  $ionicScrollDelegate.scrollBottom();
              }, function (error) {
                  console.log('Error', error);
              }, function (progress) {
                  // PROGRESS HANDLING GOES HERE
              });
           }
        }; 

        // $scope.downloadImage=function(ImageFile){
        //   console.log(ImageFile);
        //   var resImage = ImageFile.split('-');
        //   var filename = resImage[1];
        //   console.log(resImage);
        //     var url = 'http://192.168.0.103:9992/public/uploads/file-'+filename;
        //     console.log(targetPath);
        //     if($scope.usernumber){
        //       var targetPath = cordova.file.externalRootDirectory+"StormChat/images/sent/file-"+ filename;
        //       $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
        //           console.log(result);
        //           console.log(result.nativeURL);
        //           $scope.ImageDiv = "false";
        //           // $scope.openModalvideoplay(result.fullPath);
        //           $scope.msg = {
        //               'room_id': $scope.current_room_id,
        //               'sender_id': $scope.usernumber,
        //               'sender_name': $scope.current_user,
        //               'image_url': result.nativeURL,
        //               'time': moment()
        //            };
        //             console.log($scope.msg);
        //           $scope.messageList.push($scope.msg);
        //           console.log("===cordova file transfer====",$scope.messageList);
        //           $ionicScrollDelegate.scrollBottom();
        //           SocketService.emit('new group message', $scope.msg);

        //           console.log('Success');
        //           $ionicScrollDelegate.scrollBottom();
        //       }, function (error) {
        //           console.log('Error', error);
        //       }, function (progress) {
        //           // PROGRESS HANDLING GOES HERE
        //       });
        //     }else{
        //         var targetPath = cordova.file.externalRootDirectory+"StormChat/images/file-"+ filename;
        //         $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
        //           console.log(result);
        //           console.log(result.nativeURL);
        //           $scope.ImageDiv = "false";
        //           // $scope.openModalvideoplay(result.fullPath);
        //           $scope.msg = {
        //               'room_id': $scope.current_room_id,
        //               'sender_id': $scope.usernumber,
        //               'sender_name': $scope.current_user,
        //               'image_url': result.nativeURL,
        //               'time': moment()
        //            };
        //             console.log($scope.msg);
        //           $scope.messageList.push($scope.msg);
        //           console.log("===cordova file transfer====",$scope.messageList);
        //           $ionicScrollDelegate.scrollBottom();
        //           SocketService.emit('new group message', $scope.msg);

        //           console.log('Success');
        //           $ionicScrollDelegate.scrollBottom();
        //       }, function (error) {
        //           console.log('Error', error);
        //       }, function (progress) {
        //           // PROGRESS HANDLING GOES HERE
        //       });
        //    }
        // }; 

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

    $ionicModal.fromTemplateUrl('templates/videoplay.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(videoplay) {
        $scope.videoplay = videoplay;
    });
    $scope.openModalvideoplay = function(videoUrl) {
        $scope.videoplay.show();
        $scope.videoPath = videoUrl;
        var media = $cordovaMedia.newMedia($scope.videoPath);
        media.play();
    };
    $scope.closeModalvideoplay = function() {
        $scope.videoplay.hide();
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