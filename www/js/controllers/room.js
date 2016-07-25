angular.module('Room.controllers', [])

.controller('RoomCtrl', function($scope, $ionicModal, $state, localStorageService, $cordovaCamera, $ionicPlatform, SocketService, $timeout, moment, $ionicScrollDelegate, DB, $cordovaFileTransfer, $ionicLoading, $cordovaCapture) {

	$ionicPlatform.ready(function(){
		try{
		// $scope.online = false;
		// $scope.typing = true;
		$scope.messages = [];
		$scope.videoDiv = "true";
    $scope.AudioDiv = "true";
    $scope.ImageDiv = "true";
    $scope.messageList = [];
    $scope.url_prefix1 = 'http://192.168.0.105:9992/';
    // $scope.url_prefix1 = 'http://192.168.0.105:9992/';
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
		$scope.isNotCurrentUser = function(user){
			
			if($scope.current_user != user){
				return 'not-current-user';
			}
			return 'current-user';
		};
		// $scope.current_room = localStorageService.get('current_room');
		
		$scope.current_user = localStorageService.get('username');
    $scope.usernumber = localStorageService.get('usernumber');
    $scope.current_chat_friend = localStorageService.get('current_chat_friend');
    $scope.current_friend_number = localStorageService.get('current_friend_number');

   
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
              // var res = imageData.split(".");
              // var check = res[1];
              // if(check=="mp4" || check=="MP4" || check=="3gp"){
              // 	localStorage.setItem("type","Video");
              // 	$scope.ProfilePic = imageData;
              // 	$scope.uploadPhoto($scope.ProfilePic);
              // }else{
              // 	localStorage.setItem("type","gallery");
              // 	$scope.ProfilePic = imageData;
              // 	$scope.uploadPhoto($scope.ProfilePic);
              // }
              $scope.ProfilePic = imageData;
              console.log(imageData);
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
            console.log(file);
            console.log("====url_prefix====",url_prefix);
            var filePath = file;
            var Checktype = localStorage.getItem("type");
            var server =  encodeURI(url_prefix+"uploadPhoto");
              if(Checktype=="gallery"){
                var imageURI = filePath;
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = filePath.substr(filePath.lastIndexOf('/')+1);
                // options.mimeType = "uploads/jpg";
                var params = new Object();
                options.params = params;
                var headers={'headerParam':'application/ji'};
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
                // options.mimeType = "uploads/jpg";
                var params = new Object();
                options.params = params;
                var headers={'headerParam':'application/ji'};
                options.headers = headers;
                options.chunkedMode = false;
                console.log(Ji.stringify(options));
              }
              console.log(options);
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
                      var resVideo = imagePath.split('-');
                      var filename = resVideo[1];
                      var url = $scope.url_prefix1+'public/uploads/file-'+filename;
                      var targetPath = cordova.file.externalRootDirectory+"StormChat/videos/sent/file-"+ filename;
                      $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                          console.log(result);
                          console.log(result.nativeURL);
                          $scope.videoDiv = "false";

			              	  $scope.msg = {
		                        'room_id': $scope.current_room_id,
								            'sender_id': $scope.usernumber,
				                    'sender_name': $scope.current_user,
								            'receiver_id': $scope.current_friend_number,
				                    'receiver_name': $scope.current_chat_friend,
								            'video_url': result.nativeURL,
								            'time': moment()
		                     };
                        var messageId = '';
                        var audioUrl = '';
                        var documentUrl = '';
                        var imageUrl = '';
                        var message = '';
                        var timeVideo = $scope.msg.time;
                        var VideoTime = Date.parse(timeVideo);
                        var isDownload = true;
                        console.log(VideoTime);

                        var MessageQry = "Insert into Message(message_id,room_id,sender_id, sender_name, receiver_id, receiver_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
                         DB.query(MessageQry, [messageId ,$scope.current_room_id,  $scope.usernumber, $scope.current_user, $scope.current_friend_number, $scope.current_chat_friend, audioUrl, $scope.msg.video_url, imageUrl, documentUrl,  message, VideoTime, isDownload]).then(function (result) {
                             console.log("insert", result);
                             setTimeout(function() {
                              $ionicScrollDelegate.scrollBottom();
                           }, 10);
                         });

					           		console.log($scope.msg);
		                    $scope.messageList.push($scope.msg);
		                    console.log("===cordova file transfer====",$scope.messageList);
		                    $ionicScrollDelegate.scrollBottom();

		                    SocketService.emit('new message', $scope.msg);
                    }, function (error) {
                        console.log('Error', error);
                    }, function (progress) {
                        // PROGRESS HANDLING GOES HERE
                    });
			            }else if(check=="amr" || check=="mp3"){
                    var resAudio = imagePath.split('-');
                    var filename = resAudio[1];
                    var url = $scope.url_prefix1+'public/uploads/file-'+filename;
                    var targetPath = cordova.file.externalRootDirectory+"StormChat/audio/sent/file-"+ filename;
                    $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                        console.log(result);
                        console.log(result.nativeURL);
                        $scope.AudioDiv = "false";
			              	  $scope.msg = {
		                        'room_id': $scope.current_room_id,
								            'sender_id': $scope.usernumber,
				                    'sender_name': $scope.current_user,
							              'receiver_id': $scope.current_friend_number,
			                      'receiver_name': $scope.current_chat_friend,
								            'audio_url': result.nativeURL,
								            'time': moment()
		                     };
                         var messageId = '';
                         var videoUrl = '';
                         var documentUrl = '';
                         var imageUrl = '';
                         var message = '';
                         var timeAudio = $scope.msg.time;
                         var AudioTime = Date.parse(timeAudio);
                         var isDownload = true;
                         console.log(AudioTime);

                          var MessageQry = "Insert into Message(message_id,room_id,sender_id, sender_name, receiver_id, receiver_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
                         DB.query(MessageQry, [messageId ,$scope.current_room_id,  $scope.usernumber, $scope.current_user, $scope.current_friend_number, $scope.current_chat_friend, $scope.msg.audio_url, videoUrl, imageUrl, documentUrl,  message, AudioTime, isDownload]).then(function (result) {
                               console.log("insert", result);
                               setTimeout(function() {
                                $ionicScrollDelegate.scrollBottom();
                             }, 10);
                           });


							          console.log($scope.msg);
		                    $scope.messageList.push($scope.msg);
		                    console.log("===cordova file transfer====",$scope.messageList);
		                    $ionicScrollDelegate.scrollBottom();

		                    SocketService.emit('new message', $scope.msg);
                    }, function (error) {
                        console.log('Error', error);
                    }, function (progress) {
                        // PROGRESS HANDLING GOES HERE
                    });
			            }else{
                    var resImage = imagePath.split('-');
                    var filename = resImage[1];
                    var url = $scope.url_prefix1+'public/uploads/file-'+filename;
                    var targetPath = cordova.file.externalRootDirectory+"StormChat/image/sent/file-"+ filename;
                    $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                        console.log(result);
                        console.log(result.nativeURL);
                        $scope.ImageDiv = "false";
			              	$scope.msg = {
	                        'room_id': $scope.current_room_id,
							            'sender_id': $scope.usernumber,
			                    'sender_name': $scope.current_user,
							            'receiver_id': $scope.current_friend_number,
			                    'receiver_name': $scope.current_chat_friend,
							            'image_url': result.nativeURL,
							            'time': moment()
	                     };
                       console.log($scope.msg.image_url);
                      var messageId = '';
                      var videoUrl = '';
                      var audioUrl = '';
                      var documentUrl = '';
                      var message = '';
                   
                      var isDownload = true;
                      var timeImage = $scope.msg.time;
                      var ImageTime = Date.parse(timeImage);
                      console.log(ImageTime);

                      var MessageQry = "Insert into Message(message_id,room_id,sender_id, sender_name, receiver_id, receiver_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
                     DB.query(MessageQry, [messageId ,$scope.current_room_id,  $scope.usernumber, $scope.current_user, $scope.current_friend_number, $scope.current_chat_friend, audioUrl, videoUrl, $scope.msg.image_url, documentUrl,  message, ImageTime, isDownload]).then(function (result) {
                           console.log("insert", result);
                           setTimeout(function() {
                            $ionicScrollDelegate.scrollBottom();
                         }, 10);
                       });

		                    console.log($scope.msg);
		                    $scope.messageList.push($scope.msg);
		                    console.log("===cordova file transfer====",$scope.messageList);
		                    $ionicScrollDelegate.scrollBottom();

		                    SocketService.emit('new message', $scope.msg);
                    }, function (error) {
                        console.log('Error', error);
                    }, function (progress) {
                        // PROGRESS HANDLING GOES HERE
                    });
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
      
      	$scope.downloadVideo=function(videoFile, messageId){
            // if(msg.sender_id != $scope.usernumber){  
              console.log(videoFile);
              var resVideo = videoFile.split('-');
              var filename = resVideo[1];
              var url = $scope.url_prefix1+'public/uploads/file-'+filename;
              var targetPath = cordova.file.externalRootDirectory+"StormChat/videos/file-"+ filename;
              $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                console.log(result);
                console.log(result.nativeURL);
                // $scope.videoDiv = "false";
                // $scope.openModalvideoplay(result.fullPath);
                // $scope.msg = {
                //     'room_id': $scope.current_room_id,
                //     'sender_id': $scope.usernumber,
                //     'sender_name': $scope.current_user,
                //     'video_url': result.nativeURL,
                //     'time': moment()
                //  };
                  // console.log($scope.msg);
                // $scope.messageList.push($scope.msg);
                var isdownload = true;
                var updateQry = "UPDATE Message SET isdownload =?, video_url = ? WHERE message_id=?";
                 console.log(updateQry);
                    DB.query(updateQry, [isdownload, result.nativeURL, messageId]).then(function (result) {
                      console.log("update successfully", result);
                      $scope.getAllMsg();
                     setTimeout(function() {
                      $ionicScrollDelegate.scrollBottom();
                   }, 10);
                 });

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
           // }
        }; 

        $scope.downloadAudio=function(AudioFile, messageId){
            // if(msg.sender_id != $scope.usernumber){
                console.log(AudioFile);
                var resAudio = AudioFile.split('-');
                var filename = resAudio[1];
                var url = $scope.url_prefix1+'public/uploads/file-'+filename;
           
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
                    // console.log($scope.msg);
                  var isdownload = true;
                  var updateQry = "UPDATE Message SET isdownload =?, audio_url= ?  WHERE message_id=?";
                   console.log(updateQry);
                      DB.query(updateQry, [isdownload, result.nativeURL, messageId]).then(function (result) {
                        console.log("update successfully", result);
                        $scope.getAllMsg();
                       setTimeout(function() {
                        $ionicScrollDelegate.scrollBottom();
                     }, 10);
                   });

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
          // }
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
          var data={
              'room_id': $scope.current_room_id,
              'sender_id': $scope.usernumber,
              'message': ''
          }
          SocketService.emit('stop typing',data); //sending data to server
      };
      SocketService.on('listen start typing', function(msg){

      if(msg.sender_id != $scope.usernumber) {
          if($scope.current_receiver_id == msg.sender_id)
                $scope.type_message = $scope.current_user+" is typing";
                $scope.current_receiver_id = msg.sender_id;
       //          $scope.online = true;
          // $scope.typing = false;
            }
      });
      
       SocketService.on('listen stop typing', function(msg){
            $timeout(function() {
              if(msg.sender_id != $scope.usernumber) {
                    $scope.type_message = msg.message;
                    $scope.current_receiver_id = '';
           //          $scope.online = false;
              // $scope.typing = true;
                }
            }, 800);
                
      });
          
      SocketService.on('listen share image', function(msg){
          if(msg.sender_id != $scope.usernumber) {
            $scope.image_data = msg.imageData;
          }
      });

      $scope.sendTextMessage = function(){
        if($scope.message!='' && $scope.message!=null){
          $scope.msg = {
            'room_id': $scope.current_room_id,
            'sender_id': $scope.usernumber,
            'sender_name': $scope.current_user,
            'receiver_id': $scope.current_friend_number,
            'receiver_name': $scope.current_chat_friend,
            'message': $scope.message,
            'time': moment()
          };
          console.log($scope.msg);
          
          $scope.messageList.push($scope.msg);
          var timeMsg = $scope.msg.time;
          console.log(timeMsg);
          var MsgTime = Date.parse(timeMsg);
          console.log(MsgTime);
          var messageId = '';
          var videoUrl = '';
          var audioUrl = '';
          var documentUrl = '';
          var imageUrl = "";
          var isDownload = false;

          var MessageQry = "Insert into Message(message_id,room_id,sender_id, sender_name, receiver_id, receiver_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
             DB.query(MessageQry, [messageId ,$scope.current_room_id, $scope.usernumber, $scope.current_user, $scope.current_friend_number, $scope.current_chat_friend, audioUrl, videoUrl, imageUrl, documentUrl,  $scope.message, MsgTime, isDownload]).then(function (result) {
                  console.log("insert", result);
                  $scope.getAllMsg();
               setTimeout(function() {
                $ionicScrollDelegate.scrollBottom();
             }, 10);
           });


          console.log($scope.messageList);
          $ionicScrollDelegate.scrollBottom();
          $scope.message = '';
          
          SocketService.emit('new message', $scope.msg);
        }
        
      };
      SocketService.on('message created', function(msg){
        console.log(msg);

        var messageID = msg._id;
        console.log(messageID);
        var roomID = msg.room_id;
        var senderID = msg.sender_id;
        var senderName = msg.sender_name;
        var ReceiverID = msg.receiver_id;
        console.log(ReceiverID);
        var ReceiverName = msg.receiver_name;
        var Time = msg.time;
        console.log(Time);
        var newDate = new Date(Time);
        var timestamptest = Date.parse(newDate);
        console.log(timestamptest);
        // var StringTime = Time.toDateString();
        // console.log(StringTime);

        console.log(msg.audio_url, msg.video_url, msg.document_url, msg.image_url, msg.message);
        // var newDate= $filter('date')(Time, "EEE MMM DD YYYY HH:mm:ss Z");
        // console.log(newDate);
        if(msg.sender_id==$scope.usernumber){
          console.log("if worng");
          if(msg.audio_url!=undefined || msg.video_url!=undefined || msg.document_url!=undefined || msg.image_url!=undefined || msg.message!=undefined){
                console.log("hiiiiiiiii");
                // var updateQry = "UPDATE GroupChat SET message_id ="+msg._id+" WHERE time="+timestamptest;
                var updateQry = "UPDATE Message SET message_id =? WHERE time=?";
                 console.log(updateQry);
                  DB.query(updateQry, [msg._id, timestamptest]).then(function (result) {
                    console.log("update successfully", result);
                    $scope.getAllMsg();
                   setTimeout(function() {
                    $ionicScrollDelegate.scrollBottom();
                 }, 10);
               });
            }
        }


        if(msg.audio_url==undefined || msg.audio_url==''){
          var audioUrl = '';
        }else{
          var audioUrl = msg.audio_url;
        }
        if(msg.video_url==undefined || msg.video_url==''){
          var videoUrl = '';
        }else{
          var videoUrl = msg.video_url;
        }
        if(msg.document_url==undefined || msg.document_url==''){
          var documentUrl = '';
        }else{
          var documentUrl = msg.document_url;
        }
        if(msg.image_url==undefined || msg.image_url==''){
          var imageUrl = '';
        }else{
          var imageUrl = msg.image_url;
        }
        if(msg.message==undefined || msg.message==''){
          var message = '';
        }else{
          var message = msg.message;
        }
        var isDownload = false;
        if(msg.sender_id != $scope.usernumber){
        $scope.messageList.push(msg);
           var MessageQry = "Insert into Message(message_id,room_id,sender_id, sender_name, receiver_id, receiver_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
               DB.query(MessageQry, [messageID ,roomID, senderID, senderName, ReceiverID, ReceiverName, audioUrl, videoUrl, imageUrl, documentUrl,  message, Time, isDownload]).then(function (result) {
                    console.log("insert", result);
                    $scope.getAllMsg();
                 setTimeout(function() {
                  $ionicScrollDelegate.scrollBottom();
               }, 10);
             });
        }
        console.log($scope.messageList);
        $ionicScrollDelegate.scrollBottom();
      });

      
     SocketService.on('user data', function(msg){
        $scope.messageList = msg;
         
        console.log(msg);
        var CheckAll = localStorageService.get("oneTime");
        if(CheckAll!="1"){
          for(var i=0; i<msg.length; i++){
            var roomID = msg[i].room_id;
            console.log(roomID);
            console.log(msg[i].room_id);
            var messageID = msg[i]._id;
            var RecevierID = msg[i].receiver_id;
            var ReceiverName= msg[i].receiver_name;
            var senderID = msg[i].sender_id;
            var senderName= msg[i].sender_name;
            var Time= msg[i].time;
            var message = msg[i].message;
            var videoUrl = msg[i].video_url;
            var audioUrl = msg[i].audio_url;
            var imageUrl = msg[i].audio_url;
            var documentUrl = msg[i].document_url;
            if(message==undefined){
              message= '';
            }
            if(videoUrl==undefined){
              videoUrl= '';
            }
            if(audioUrl==undefined){
              audioUrl= '';
            }
            if(imageUrl==undefined){
              imageUrl= '';
            }
            if(documentUrl==undefined){
              documentUrl= '';
            }
            var isDownload = false;


            var MessageQry = "Insert into Message(message_id,room_id,sender_id, sender_name, receiver_id, receiver_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
               DB.query(MessageQry, [messageID ,roomID, senderID, senderName, RecevierID, ReceiverName, audioUrl, videoUrl, imageUrl, documentUrl,  message, Time, isDownload]).then(function (result) {
                    console.log("insert", result);
                    localStorageService.set("oneTime", "1");
                    $scope.getAllMsg();
                 setTimeout(function() {
                  $ionicScrollDelegate.scrollBottom();
               }, 10);
             });
          }
        }
        console.log($scope.messageList);
        $ionicScrollDelegate.scrollBottom();
      });

      $scope.getAllMsg = function(){
        console.log($scope.current_room_id);
        var chatlist = "SELECT * from Message where room_id=?";
         var results = DB.query(chatlist, [$scope.current_room_id]).then(function (result) {
           console.log(result.rows);
            if(result.rows.length!=0){
             var len = result.rows.length;
              for(var j=0;j<len;j++){
                  $scope.messageList.push({"message_id":result.rows.item(j).message_id,"room_id":result.rows.item(j).room_id, "sender_id":result.rows.item(j).sender_id, "sender_name":result.rows.item(j).sender_name, "receiver_id":result.rows.item(j).receiver_id, "receiver_name":result.rows.item(j).receiver_name, "message":result.rows.item(j).message, "time":result.rows.item(j).time, "isdownload":result.rows.item(j).isdownload, "audio_url":result.rows.item(j).audio_url, "document_url":result.rows.item(j).document_url, "image_url":result.rows.item(j).image_url, "video_url":result.rows.item(j).video_url});  
                  $ionicScrollDelegate.scrollBottom();
              } 
            }else{
               console.log("insert All Ready List");
             }
         });
      }
      $scope.getAllMsg();

      SocketService.on('current room id', function(data){
        $scope.current_room_id = data.current_room_id;
        alert($scope.current_room_id);
        $ionicScrollDelegate.scrollBottom();
      });

      $scope.leaveRoom = function(){
          SocketService.emit('leave chat:room', {'room_id': $scope.current_room_id});
          SocketService.removeAllListeners('listen start typing');
          SocketService.removeAllListeners('listen stop typing');
          SocketService.removeAllListeners('message created');
          SocketService.removeAllListeners('user data');
          SocketService.removeAllListeners('current room id');
          $state.go('home');
      };
     

				

	}catch(err){
	      console.log(err.message);
	    }
	});

})