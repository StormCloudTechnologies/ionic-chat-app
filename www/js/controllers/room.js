angular.module('Room.controllers', [])

.controller('RoomCtrl', function($scope, $ionicModal, $state, localStorageService, $cordovaCamera, $ionicPlatform, SocketService, $timeout, moment, $ionicScrollDelegate, DB, $cordovaFileTransfer, $ionicLoading, $cordovaCapture, $cordovaDialogs, $cordovaFile) {

	$ionicPlatform.ready(function(){
		try{
	     	$scope.messages = [];
		    $scope.videoDiv = "true";
        $scope.AudioDiv = "true";
        $scope.ImageDiv = "true";
        $scope.messageList = [];
        // $scope.url_prefix1 = 'http://192.168.0.100:9992/';
        $scope.url_prefix1 = 'http://52.36.75.89:9992/';
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
                // console.log(err.message);
            });
          }
          catch(err){
            // console.log(err.message);
          }
        };


        $scope.captureVideo = function() {
  		    var options = { limit: 1, duration: 30 };

  		    $cordovaCapture.captureVideo(options).then(function(videoData) {
  		       localStorage.setItem("type","gallery");
  		       $scope.ProfilePic = videoData[0].fullPath;
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
              }
            $cordovaFileTransfer.upload(server, filePath, options)
              .then(function(result) {
                try{
	                   var obj = JSON.parse(result.response);
                     var imagePath = obj.path;
                    
                     $ionicLoading.hide();
                      var res = imagePath.split(".");
                      var check = res[1];
                      if(check=="mp4" || check=="MP4" || check=="3gp"){
                          var resVideo = imagePath.split('-');
                          var filename = resVideo[1];
                          var url = $scope.url_prefix1+'public/uploads/file-'+filename;
                          var targetPath = cordova.file.externalRootDirectory+"StormChat/videos/sent/file-"+ filename;
                          $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                         
    			              	  $scope.msg = {
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
                            var isDownload = "true";
                         
                            var MessageQry = "Insert into Message(message_id,sender_id, sender_name, receiver_id, receiver_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
                             DB.query(MessageQry, [messageId,  $scope.usernumber, $scope.current_user, $scope.current_friend_number, $scope.current_chat_friend, audioUrl, $scope.msg.video_url, imageUrl, documentUrl,  message, VideoTime, isDownload]).then(function (result) {
                                 setTimeout(function() {
                                  $ionicScrollDelegate.scrollBottom();
                               }, 10);
                             });
                            $scope.messageList.push($scope.msg);
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
                           $scope.msg = {
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
                             var isDownload = "true";
                           
                              var MessageQry = "Insert into Message(message_id,sender_id, sender_name, receiver_id, receiver_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
                             DB.query(MessageQry, [messageId,$scope.usernumber, $scope.current_user, $scope.current_friend_number, $scope.current_chat_friend, $scope.msg.audio_url, videoUrl, imageUrl, documentUrl,  message, AudioTime, isDownload]).then(function (result) {
                                  
                               });


    							          $scope.messageList.push($scope.msg);
    		                    $ionicScrollDelegate.scrollBottom();

    		                    SocketService.emit('new message', $scope.msg);
                        }, function (error) {
                            console.log('Error', error);
                        }, function (progress) {
                            // PROGRESS HANDLING GOES HERE
                        });
    			            }else if(check=="docx"){
                                var resVideo = imagePath.split('-');
                                var filename = resVideo[1];
                                var url = $scope.url_prefix1+'public/uploads/file-'+filename;
                                var targetPath = cordova.file.externalRootDirectory+"StormChat/document/sent/file-"+ filename;
                                $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                                    $scope.msg = {
                                        'sender_id': $scope.usernumber,
                                        'sender_name': $scope.current_user,
                                        'documnet_url': result.nativeURL,
                                        'time': moment()
                                    };
                                    var messageId = '';
                                    var videoUrl = '';
                                    var audioUrl = '';
                                    var documentUrl = result.nativeURL;
                                    var imageUrl = '';
                                    var message = '';
                                    var timeAudio = $scope.msg.time;
                                    var AudioTime = Date.parse(timeAudio);
                                    var isDownload = "true";
                                     var MessageQry = "Insert into GroupChat(message_id,sender_id, sender_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                                     DB.query(MessageQry, [messageId,$scope.msg.sender_id, $scope.msg.sender_name, audioUrl, videoUrl, imageUrl, documentUrl, message, AudioTime, isDownload]).then(function (result) {
                                     
                                     });

                                    $scope.messageList.push($scope.msg);
                                    $ionicScrollDelegate.scrollBottom();
                                    SocketService.emit('new group message', $scope.msg);
                                }, function (error) {
                                    console.log('Error', error);
                                }, function (progress) {
                                    // PROGRESS HANDLING GOES HERE
                                });

                        }else{
                          var resImage = imagePath.split('-');
                          var filename = resImage[1];
                          var url = $scope.url_prefix1+'public/uploads/file-'+filename;
                          var targetPath = cordova.file.externalRootDirectory+"StormChat/images/sent/file-"+ filename;
                          $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                           	$scope.msg = {
      							            'sender_id': $scope.usernumber,
      			                    'sender_name': $scope.current_user,
      							            'receiver_id': $scope.current_friend_number,
      			                    'receiver_name': $scope.current_chat_friend,
      							            'image_url': result.nativeURL,
      							            'time': moment()
      	                     };
                            var messageId = '';
                            var videoUrl = '';
                            var audioUrl = '';
                            var documentUrl = '';
                            var message = '';
                         
                            var isDownload = "true";
                            var timeImage = $scope.msg.time;
                            var ImageTime = Date.parse(timeImage);
                          
                            var MessageQry = "Insert into Message(message_id,sender_id, sender_name, receiver_id, receiver_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
                           DB.query(MessageQry, [messageId ,$scope.usernumber, $scope.current_user, $scope.current_friend_number, $scope.current_chat_friend, audioUrl, videoUrl, $scope.msg.image_url, documentUrl,  message, ImageTime, isDownload]).then(function (result) {
                               
                             });

      		                    $scope.messageList.push($scope.msg);
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
      
        $scope.deleteMsg = function(data, type, id){
           $cordovaDialogs.confirm('Delete this message !!', 'Are You Sure ?', ['Cancel','OK'])
            .then(function(buttonIndex) {
              // no button = 0, 'OK' = 1, 'Cancel' = 2
             var btnIndex = buttonIndex;
              if(btnIndex==1){
                $scope.checkData(data, type, id);
              }
            });
        }
        $scope.checkData = function(data, type, id){
            $scope.data = {
              message_id:id
            }

            var resdata = data.split('-');
            var filename = resdata[1];
            if(type=='message'){
              var deleteQuery = "DELETE from Message where message_id=?";
              DB.query(deleteQuery, [id]).then(function (result) {
                $scope.getAllMsg();
                setTimeout(function() {
                    $ionicScrollDelegate.scrollBottom();
                }, 10);
              });

            }else if(type=='video'){
              if($scope.usernumber){
               $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/videos/sent", 'file-'+filename)
                .then(function (success) {
                     var deleteQuery = "DELETE from Message where message_id=?";
                      DB.query(deleteQuery, [id]).then(function (result) {
                        $scope.getAllMsg();
                      });
                }, function (error) {
                  console.log(error);
                });
              }else{
                $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/videos/", 'file-'+filename)
                .then(function (success) {
                     var deleteQuery = "DELETE from Message where message_id=?";
                      DB.query(deleteQuery, [id]).then(function (result) {
                        SocketService.emit('delete p2p file', {file_path: 'public/uploads/file-'+filename});
                        $scope.getAllMsg();
                      });
                }, function (error) {
                  console.log(error);
                });
              }
            }else if(type=='image'){
                if($scope.usernumber){
                 $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/images/sent", 'file-'+filename)
                  .then(function (success) {
                       var deleteQuery = "DELETE from Message where message_id=?";
                        DB.query(deleteQuery, [id]).then(function (result) {
                          $scope.getAllMsg();
                        });
                  }, function (error) {
                    console.log(error);
                  });
                }else{
                  $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/images/", 'file-'+filename)
                  .then(function (success) {
                       var deleteQuery = "DELETE from Message where message_id=?";
                        DB.query(deleteQuery, [id]).then(function (result) {
                          SocketService.emit('delete p2p file', {file_path: 'public/uploads/file-'+filename});
                          $scope.getAllMsg();
                        });
                  }, function (error) {
                    console.log(error);
                  });
                }

            }else if(type=='audio'){
                if($scope.usernumber){
                 $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/audio/sent", 'file-'+filename)
                  .then(function (success) {
                       var deleteQuery = "DELETE from Message where message_id=?";
                        DB.query(deleteQuery, [id]).then(function (result) {
                          $scope.getAllMsg();
                          setTimeout(function() {
                              $ionicScrollDelegate.scrollBottom();
                          }, 10);
                        });
                  }, function (error) {
                    console.log(error);
                  });
                }else{
                  $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/audio/", 'file-'+filename)
                  .then(function (success) {
                       var deleteQuery = "DELETE from Message where message_id=?";
                        DB.query(deleteQuery, [id]).then(function (result) {
                          SocketService.emit('delete p2p file', {file_path: 'public/uploads/file-'+filename});
                          $scope.getAllMsg();
                        });
                  }, function (error) {
                    console.log(error);
                  });
                }

            }else{
              if($scope.usernumber){
                 $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/documents/sent", 'file-'+filename)
                  .then(function (success) {
                       var deleteQuery = "DELETE from Message where message_id=?";
                        DB.query(deleteQuery, [id]).then(function (result) {
                          $scope.getAllMsg();
                          setTimeout(function() {
                              $ionicScrollDelegate.scrollBottom();
                          }, 10);
                        });
                  }, function (error) {
                    console.log(error);
                  });
                }else{
                  $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/documents/", 'file-'+filename)
                  .then(function (success) {
                       var deleteQuery = "DELETE from Message where message_id=?";
                        DB.query(deleteQuery, [id]).then(function (result) {
                          SocketService.emit('delete p2p file', {file_path: 'public/uploads/file-'+filename});
                          $scope.getAllMsg();
                        });
                  }, function (error) {
                    console.log(error);
                  });
                }

            }

        }

      	$scope.downloadVideo=function(videoFile, messageId){
              var resVideo = videoFile.split('-');
              var filename = resVideo[1];
              var url = $scope.url_prefix1+'public/uploads/file-'+filename;
              var targetPath = cordova.file.externalRootDirectory+"StormChat/videos/file-"+ filename;
              $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
               var isdownload = "true";
                var updateQry = "UPDATE Message SET isdownload =?, video_url = ? WHERE message_id=?";
                   DB.query(updateQry, [isdownload, result.nativeURL, messageId]).then(function (result) {
                      $scope.getAllMsg();
                  });
                $ionicScrollDelegate.scrollBottom();
               
              }, function (error) {
                  console.log('Error', error);
              }, function (progress) {
                  // PROGRESS HANDLING GOES HERE
              });
           // }
        }; 

        $scope.downloadAudio=function(AudioFile, messageId){
              var resAudio = AudioFile.split('-');
                var filename = resAudio[1];
                var url = $scope.url_prefix1+'public/uploads/file-'+filename;
           
                var targetPath = cordova.file.externalRootDirectory+"StormChat/audio/file-"+ filename;
                $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                  var isdownload = "true";
                  var updateQry = "UPDATE Message SET isdownload =?, audio_url= ?  WHERE message_id=?";
                      DB.query(updateQry, [isdownload, result.nativeURL, messageId]).then(function (result) {
                       $scope.getAllMsg();
                   });
                  $ionicScrollDelegate.scrollBottom();
              }, function (error) {
                  console.log('Error', error);
              }, function (progress) {
                  // PROGRESS HANDLING GOES HERE
              });
          // }
        }; 

        $scope.downloadImage=function(ImageFile, messageId){
            var resAudio = ImageFile.split('-');
            var filename = resAudio[1];
            var url = $scope.url_prefix1+'public/uploads/file-'+filename;

                var targetPath = cordova.file.externalRootDirectory+"StormChat/images/file-"+ filename;
                $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                
                  var isdownload = "true";
                  var updateQry = "UPDATE GroupChat SET isdownload =?, image_url = ?  WHERE message_id=?";
                      DB.query(updateQry, [isdownload, result.nativeURL, messageId]).then(function (result) {
                        $scope.getAllMsg();
                         
                   });
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
                'receiver_id': $scope.current_friend_number,
                'sender_id': $scope.usernumber,
                'message':$scope.current_user+" is typing"
            }
            SocketService.emit('start p2p typing',data_server); //sending data to server
        };
        $scope.stopTyping = function() {
            var data={
                'receiver_id': $scope.current_friend_number,
                'sender_id': $scope.usernumber,
                'message': ''
            }
            SocketService.emit('stop p2p typing',data); //sending data to server
        };
        SocketService.on('listen start p2p typing', function(msg){

        if(msg.sender_id != $scope.usernumber) {
            if($scope.current_receiver_id == msg.sender_id)
                  $scope.type_message = $scope.current_user+" is typing";
                  $scope.current_receiver_id = msg.sender_id;
     
              }
        });
      
       SocketService.on('listen stop p2p typing', function(msg){
            $timeout(function() {
              if(msg.sender_id != $scope.usernumber) {
                    $scope.type_message = msg.message;
                    $scope.current_receiver_id = '';
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
            'sender_id': $scope.usernumber,
            'sender_name': $scope.current_user,
            'receiver_id': $scope.current_friend_number,
            'receiver_name': $scope.current_chat_friend,
            'message': $scope.message,
            'time': moment()
          };
           
          
          var timeMsg = $scope.msg.time;
          var MsgTime = Date.parse(timeMsg);
          var messageId = '';
          var videoUrl = '';
          var audioUrl = '';
          var documentUrl = '';
          var imageUrl = "";
          var isDownload = "false";
          $scope.messageList.push($scope.msg);
          
          var MessageQry = "Insert into Message(message_id,sender_id, sender_name, receiver_id, receiver_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
             DB.query(MessageQry, [messageId, $scope.usernumber, $scope.current_user, $scope.current_friend_number, $scope.current_chat_friend, audioUrl, videoUrl, imageUrl, documentUrl,  $scope.message, MsgTime, isDownload]).then(function (result) {
                  // $scope.getAllMsg();
           });


          $ionicScrollDelegate.scrollBottom();
          $scope.message = '';
          
          SocketService.emit('new message', $scope.msg);
        }
        
      };
      SocketService.on('message created', function(msg){
       
        var messageID = msg._id;
        var senderID = msg.sender_id;
        var senderName = msg.sender_name;
        var ReceiverID = msg.receiver_id;
        var ReceiverName = msg.receiver_name;
        var Time = msg.time;
        var newDate = new Date(Time);
        var timestamptest = Date.parse(newDate);
        if(msg.sender_id==$scope.usernumber){
          if(msg.audio_url!=undefined || msg.video_url!=undefined || msg.document_url!=undefined || msg.image_url!=undefined || msg.message!=undefined){
                var updateQry = "UPDATE Message SET message_id =? WHERE time=?";
                 console.log(updateQry);
                  DB.query(updateQry, [msg._id, timestamptest]).then(function (result) {
                    $scope.getAllMsg();
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
        var isDownload = "false";
        if(msg.sender_id != $scope.usernumber){
           $scope.messageList.push(msg);
           var MessageQry = "Insert into Message(message_id,sender_id, sender_name, receiver_id, receiver_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
               DB.query(MessageQry, [messageID , senderID, senderName, ReceiverID, ReceiverName, audioUrl, videoUrl, imageUrl, documentUrl,  message, Time, isDownload]).then(function (result) {
                    // SocketService.emit('delete p2p chat message', {message_id: msg._id});
                    // $scope.messageList.push(msg);
             });
        }
        $ionicScrollDelegate.scrollBottom();
      });

      
     SocketService.on('user data', function(msg){
        $scope.messageList = msg;
        var CheckAll = localStorageService.get("oneTime");
        if(CheckAll!="1"){
          for(var i=0; i<msg.length; i++){
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
            var isDownload = "false";


            var MessageQry = "Insert into Message(message_id,sender_id, sender_name, receiver_id, receiver_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
               DB.query(MessageQry, [messageID , senderID, senderName, RecevierID, ReceiverName, audioUrl, videoUrl, imageUrl, documentUrl,  message, Time, isDownload]).then(function (result) {
                    localStorageService.set("oneTime", "1");
                    $scope.getAllMsg();
                 setTimeout(function() {
                  $ionicScrollDelegate.scrollBottom();
               }, 10);
             });
          }
        }
        $ionicScrollDelegate.scrollBottom();
      });

      $scope.getAllMsg = function(){
        var chatlist = "SELECT * from Message where receiver_id=? AND sender_id=?";
         var results = DB.query(chatlist, [$scope.current_friend_number, $scope.usernumber]).then(function (result) {
           if(result.rows.length!=0){
             var len = result.rows.length;
              for(var j=0;j<len;j++){
                  $scope.messageList.push({"message_id":result.rows.item(j).message_id, "sender_id":result.rows.item(j).sender_id, "sender_name":result.rows.item(j).sender_name, "receiver_id":result.rows.item(j).receiver_id, "receiver_name":result.rows.item(j).receiver_name, "message":result.rows.item(j).message, "time":result.rows.item(j).time, "isdownload":result.rows.item(j).isdownload, "audio_url":result.rows.item(j).audio_url, "document_url":result.rows.item(j).document_url, "image_url":result.rows.item(j).image_url, "video_url":result.rows.item(j).video_url});  
                  $ionicScrollDelegate.scrollBottom();
              } 
            }else{
               console.log("insert All Ready List");
             }
         });
      }
      // $scope.getAllMsg();
     
         $scope.leaveRoom = function(){

            $state.go('home');
            // SocketService.emit('leave chat:room', {'room_id': $scope.current_room_id});

        };

				

	}catch(err){
	      console.log(err.message);
	    }
	});

})