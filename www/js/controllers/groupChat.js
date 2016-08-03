angular.module('GroupChat.controllers', [])

.controller('GroupChatCtrl', function($scope, $ionicModal, $timeout, $state, localStorageService, $cordovaCamera, $cordovaFileTransfer, $ionicPlatform, SocketService, moment, $ionicScrollDelegate, $ionicLoading, $cordovaCapture, $cordovaMedia, DB, $filter, $cordovaDialogs, $cordovaFile) {

	$ionicPlatform.ready(function(){
		try{
        $ionicScrollDelegate.scrollBottom();
        $scope.messages = [];
        $scope.messageList = [];
        // $scope.url_prefix1 = 'http://52.36.75.89:9992/';
        $scope.url_prefix1 = 'http://192.168.0.103:9992/';

        $scope.videoDiv = "true";
        $scope.AudioDiv = "true";
        $scope.ImageDiv = "true";        

        $scope.grouplist = JSON.parse(localStorage.getItem("groupList"));
        console.log($scope.grouplist);

        $scope.humanize = function(timestamp){
          return moment(timestamp).fromNow();
        };

        $scope.gorupView = function(){
          
          $state.go('groupview');
        }

        $scope.current_room = localStorageService.get('current_room');

        $scope.current_user = localStorageService.get('username');
        $scope.usernumber = localStorageService.get('usernumber');
        $scope.userList = JSON.parse(localStorage.getItem('userList'));
        $scope.new_user_list = [];
        for(var i=0;i<$scope.userList.length;i++){
          $scope.new_user_list.push($scope.userList[i]);
        }
        console.log("==$scope.userList===",typeof($scope.new_user_list));
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
            localStorage.setItem("type","video");
            $scope.ProfilePic = videoData[0].fullPath;
            $scope.uploadPhoto($scope.ProfilePic);
          }, function(err) {
           // An error occurred. Show a message to the user
          });
        }

        $scope.captureAudio = function() {
          var options = { limit:1, duration: 30 };
          $cordovaCapture.captureAudio(options).then(function(audioData) {
            localStorage.setItem("type","audio");
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
              var params = new Object();
              options.params = params;
              var headers={'headerParam':'application/json'};
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
              var params = new Object();
              options.params = params;
              var headers={'headerParam':'application/json'};
              options.headers = headers;
              options.chunkedMode = false;
            }
            $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {
             try{
                var obj = JSON.parse(result.response);
                var imagePath = obj.path;
                $ionicLoading.hide();
                var res = imagePath.split(".");
                var check = res[1];
                if(Checktype=="camera" || Checktype=="gallery"){
                  if(check=="mp4" || check=="MP4" || check=="3gp"){
                      var resVideo = imagePath.split('-');
                      var filename = resVideo[1];
                      var url = $scope.url_prefix1+'public/uploads/file-'+filename;
                      var targetPath = cordova.file.externalRootDirectory+"StormChat/videos/sent/file-"+ filename;
                      $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                        $scope.msg = {
                          'room_id': $scope.current_room_id,
                          'sender_id': $scope.usernumber,
                          'sender_name': $scope.current_user,
                          'video_url': imagePath,
                          'users':$scope.new_user_list,
                          'time': moment()
                        };
                        $scope.msg1 = {
                          'room_id': $scope.current_room_id,
                          'sender_id': $scope.usernumber,
                          'sender_name': $scope.current_user,
                          'video_url': result.nativeURL,
                          'users':$scope.new_user_list,
                          'isdownload':"true",
                          'time': moment()
                        };
                        $scope.messageList.push($scope.msg1);
                        var messageId = '';
                        var audioUrl = '';
                        var documentUrl = '';
                        var imageUrl = '';
                        var message = '';
                       var timeVideo = $scope.msg.time;
                       var VideoTime = Date.parse(timeVideo);
                        var isDownload = true;
                        var MessageQry = "Insert into GroupChat(message_id, room_id,sender_id, sender_name, audio_url, video_url, image_url,  document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        DB.query(MessageQry, [messageId,$scope.msg.room_id,$scope.msg.sender_id, $scope.msg.sender_name, audioUrl, $scope.msg1.video_url, imageUrl, documentUrl, message, VideoTime, isDownload]).then(function (result) {
                      
                        });
                        SocketService.emit('new group message', $scope.msg);
                       $ionicScrollDelegate.scrollBottom();
                     }, function (error) {
                         console.log('Error', error);
                     }, function (progress) {
                        // PROGRESS HANDLING GOES HERE
                     });
                   }

                  if(check=="amr" || check=="mp3"){
                    var resVideo = imagePath.split('-');
                    var filename = resVideo[1];
                    var url = $scope.url_prefix1+'public/uploads/file-'+filename;
                    var targetPath = cordova.file.externalRootDirectory+"StormChat/audio/sent/file-"+ filename;
                    $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                     $scope.msg = {
                        'room_id': $scope.current_room_id,
                        'sender_id': $scope.usernumber,
                        'sender_name': $scope.current_user,
                        'audio_url':imagePath,
                        'users':$scope.new_user_list,
                        'time': moment()
                      };
                     $scope.msg1 = {
                        'room_id': $scope.current_room_id,
                        'sender_id': $scope.usernumber,
                        'sender_name': $scope.current_user,
                        'audio_url': result.nativeURL,
                        'users':$scope.new_user_list,
                        'isdownload':"true",
                        'time': moment()
                      };
                      $scope.messageList.push($scope.msg1);
                      var messageId = '';
                      var videoUrl = '';
                     var documentUrl = '';
                      var imageUrl = '';
                      var message = '';
                      var timeAudio = $scope.msg.time;
                      var AudioTime = Date.parse(timeAudio);
                      var isDownload = true;

                      var MessageQry = "Insert into GroupChat(message_id, room_id,sender_id, sender_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                     DB.query(MessageQry, [messageId,$scope.msg.room_id,$scope.msg.sender_id, $scope.msg.sender_name, $scope.msg1.audio_url, videoUrl, imageUrl, documentUrl, message, AudioTime, isDownload]).then(function (result) {

                      });

                     SocketService.emit('new group message', $scope.msg);
                      $ionicScrollDelegate.scrollBottom();
                    }, function (error) {
                     console.log('Error', error);
                    }, function (progress) {
                     // PROGRESS HANDLING GOES HERE
                    });
                   }

                  if(check=="docx"){
                    var resVideo = imagePath.split('-');
                    var filename = resVideo[1];
                    var url = $scope.url_prefix1+'public/uploads/file-'+filename;
                    var targetPath = cordova.file.externalRootDirectory+"StormChat/documents/sent/file-"+ filename;
                   $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                      $scope.msg = {
                        'room_id': $scope.current_room_id,
                        'sender_id': $scope.usernumber,
                        'sender_name': $scope.current_user,
                        'users':$scope.new_user_list,
                        'documnet_url': imagePath,
                        'time': moment()
                      };
                      $scope.msg1 = {
                        'room_id': $scope.current_room_id,
                        'sender_id': $scope.usernumber,
                        'sender_name': $scope.current_user,
                        'documnet_url': result.nativeURL,
                        'users':$scope.new_user_list,
                        'isdownload':"true",
                        'time': moment()
                      };
                      $scope.messageList.push($scope.msg1);
                      var messageId = '';
                     var videoUrl = '';
                     var audioUrl = '';
                      var documentUrl = result.nativeURL;
                     var imageUrl = '';
                      var message = '';
                      var timeAudio = $scope.msg.time;
                      var AudioTime = Date.parse(timeAudio);
                      var isDownload = true;
                     console.log(AudioTime);

                      var MessageQry = "Insert into GroupChat(message_id, room_id,sender_id, sender_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                      DB.query(MessageQry, [messageId,$scope.msg.room_id,$scope.msg.sender_id, $scope.msg.sender_name, audioUrl, videoUrl, imageUrl, documentUrl, message, AudioTime, isDownload]).then(function (result) {

                      });

                     SocketService.emit('new group message', $scope.msg);
                      $ionicScrollDelegate.scrollBottom();
                    }, function (error) {
                      console.log('Error', error);
                   }, function (progress) {
                      // PROGRESS HANDLING GOES HERE
                    });
                 
                  }
   
                  if(check=="jpg" || check=="png" || check=="jpeg"){
                    var resImage = imagePath.split('-');
                    var filename = resImage[1];
                    var url = $scope.url_prefix1+'public/uploads/file-'+filename;
                    var targetPath = cordova.file.externalRootDirectory+"StormChat/images/sent/file-"+ filename;
                     $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                      $scope.msg = {
                        'room_id': $scope.current_room_id,
                        'sender_id': $scope.usernumber,
                        'sender_name': $scope.current_user,
                        'users':$scope.new_user_list,
                        'image_url': imagePath,
                        'time': moment()
                      };
                      $scope.msg1 = {
                        'room_id': $scope.current_room_id,
                        'sender_id': $scope.usernumber,
                        'sender_name': $scope.current_user,
                        'image_url': result.nativeURL,
                        'users':$scope.new_user_list,
                        'isdownload':"true",
                        'time': moment()
                      };
                     $scope.messageList.push($scope.msg1);
                      var messageId = '';
                      var videoUrl = '';
                      var audioUrl = '';
                     var documentUrl = '';
                      var message = '';

                      var isDownload = true;
                     var timeImage = $scope.msg.time;
                      var ImageTime = Date.parse(timeImage);
                     var MessageQry = "Insert into GroupChat(message_id, room_id,sender_id, sender_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                     DB.query(MessageQry, [messageId,$scope.msg.room_id,$scope.msg.sender_id, $scope.msg.sender_name, audioUrl, videoUrl, $scope.msg1.image_url, documentUrl, message, ImageTime, isDownload]).then(function (result) {
                      
                      });
                      
                      $ionicScrollDelegate.scrollBottom();
                      SocketService.emit('new group message', $scope.msg);
                    }, function (error) {
                      console.log('Error', error);
                    }, function (progress) {
                      // PROGRESS HANDLING GOES HERE
                    });
                  }
                }
                if(Checktype=="video"){
                  var resVideo = imagePath.split('-');
                  var filename = resVideo[1];
                  var url = $scope.url_prefix1+'public/uploads/file-'+filename;
                  var targetPath = cordova.file.externalRootDirectory+"StormChat/videos/sent/file-"+ filename;
                  $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                    $scope.msg = {
                      'room_id': $scope.current_room_id,
                      'sender_id': $scope.usernumber,
                      'sender_name': $scope.current_user,
                      'users':$scope.new_user_list,
                      'video_url': imagePath,
                      'time': moment()
                    };
                    $scope.msg1 = {
                      'room_id': $scope.current_room_id,
                      'sender_id': $scope.usernumber,
                      'sender_name': $scope.current_user,
                      'video_url': result.nativeURL,
                      'users':$scope.new_user_list,
                      'isdownload':"true",
                      'time': moment()
                    };
                    $scope.messageList.push($scope.msg1);
                    var messageId = '';
                    var audioUrl = '';
                    var documentUrl = '';
                    var imageUrl = '';
                    var message = '';
                    var timeVideo = $scope.msg.time;
                    var VideoTime = Date.parse(timeVideo);
                    var isDownload = true;
                    var MessageQry = "Insert into GroupChat(message_id, room_id,sender_id, sender_name, audio_url, video_url, image_url,  document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    DB.query(MessageQry, [messageId,$scope.msg.room_id,$scope.msg.sender_id, $scope.msg.sender_name, audioUrl, $scope.msg1.video_url, imageUrl, documentUrl, message, VideoTime, isDownload]).then(function (result) {
                  
                    });
                    SocketService.emit('new group message', $scope.msg);
                   $ionicScrollDelegate.scrollBottom(); 
                  }, function (error) {
                      console.log('Error', error);
                  }, function (progress) {
                      // PROGRESS HANDLING GOES HERE
                  });
                }
                if(Checktype=="audio"){
                  var resAudio = imagePath.split('-');
                  var filename = resAudio[1];
                  var url = $scope.url_prefix1+'public/uploads/file-'+filename;
                  var targetPath = cordova.file.externalRootDirectory+"StormChat/audio/sent/file-"+ filename;
                  $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                     $scope.msg = {
                       'room_id': $scope.current_room_id,
                        'sender_id': $scope.usernumber,
                        'sender_name': $scope.current_user,
                        'users':$scope.new_user_list,
                        'audio_url':imagePath,
                        'time': moment()
                      };
                      $scope.msg1 = {
                       'room_id': $scope.current_room_id,
                        'sender_id': $scope.usernumber,
                        'sender_name': $scope.current_user,
                        'audio_url': result.nativeURL,
                        'users':$scope.new_user_list,
                        'isdownload':"true",
                       'time': moment()
                      };
                      $scope.messageList.push($scope.msg1);
                      var messageId = '';
                      var videoUrl = '';
                      var documentUrl = '';
                      var imageUrl = '';
                      var message = '';
                      var timeAudio = $scope.msg.time;
                     var AudioTime = Date.parse(timeAudio);
                      var isDownload = true;
                      var MessageQry = "Insert into GroupChat(message_id, room_id,sender_id, sender_name, audio_url, ideo_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";+
                      DB.query(MessageQry, [messageId,$scope.msg.room_id,$scope.msg.sender_id, $scope.msgsender_name, $scope.msg1.audio_url, videoUrl, imageUrl, documentUrl, message, AudioTime, isDownload]).then(function (result) {
                      });

                     SocketService.emit('new group message', $scope.msg);

                      $ionicScrollDelegate.scrollBottom();
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

        $scope.deleteMsg = function(data, type, id, msg){
          $cordovaDialogs.confirm('Delete this message !!', 'Are You Sure ?', ['Cancel','OK'])
          .then(function(buttonIndex) {
          // no button = 0, 'OK' = 1, 'Cancel' = 2
            var btnIndex = buttonIndex;
            if(btnIndex==1){
             $scope.checkData(data, type, id, msg);
            }
          });
        }
        $scope.checkData = function(data, type, id, msg){

          var resdata = data.split('-');
          var filename = resdata[1];
          if(type=='message'){
            var deleteQuery = "DELETE from GroupChat where message_id=?";
            DB.query(deleteQuery, [id]).then(function (result) {
              var index = $scope.messageList.indexOf(msg);
              $scope.messageList.splice(index,1);
            });

          }else if(type=='video'){
          if($scope.usernumber){
            $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/videos/sent", 'file-'+filename)
            .then(function (success) {
              var deleteQuery = "DELETE from GroupChat where message_id=?";
              DB.query(deleteQuery, [id]).then(function (result) {
                var index = $scope.messageList.indexOf(msg);
                $scope.messageList.splice(index,1);
              });
            }, function (error) {
              console.log(error);
            });
          }else{
            $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/videos/", 'file-'+filename)
          .then(function (success) {
            var deleteQuery = "DELETE from GroupChat where message_id=?";
            DB.query(deleteQuery, [id]).then(function (result) {
              var index = $scope.messageList.indexOf(msg);
              $scope.messageList.splice(index,1);
            });
            }, function (error) {
             console.log(error);
            });
          }
          }else if(type=='image'){
            if($scope.usernumber){
              $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/images/sent", 'file-'+filename)
              .then(function (success) {
                var deleteQuery = "DELETE from GroupChat where message_id=?";
                DB.query(deleteQuery, [id]).then(function (result) {
                  var index = $scope.messageList.indexOf(msg);
                  $scope.messageList.splice(index,1);
                });
                }, function (error) {
                  console.log(error);
                });
            }else{
              $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/images/", 'file-'+filename)
              .then(function (success) {
                var deleteQuery = "DELETE from GroupChat where message_id=?";
                DB.query(deleteQuery, [id]).then(function (result) {
                 var index = $scope.messageList.indexOf(msg);
                 $scope.messageList.splice(index,1);
              });
              }, function (error) {
                console.log(error);
              });
            }

          }else if(type=='audio'){
            if($scope.usernumber){
              $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/audio/sent", 'file-'+filename)
              .then(function (success) {
                var deleteQuery = "DELETE from GroupChat where message_id=?";
                DB.query(deleteQuery, [id]).then(function (result) {
                  var index = $scope.messageList.indexOf(msg);
                 $scope.messageList.splice(index,1);
                });
                }, function (error) {
                  console.log(error);
                });
            }else{
              $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/audio/", 'file-'+filename)
              .then(function (success) {
                var deleteQuery = "DELETE from GroupChat where message_id=?";
                DB.query(deleteQuery, [id]).then(function (result) {
                  var index = $scope.messageList.indexOf(msg);
                  $scope.messageList.splice(index,1);
                });
                }, function (error) {
                  console.log(error);
                });
            }

          }else{
            if($scope.usernumber){
              $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/documents/sent", 'file-'+filename)
              .then(function (success) {
                var deleteQuery = "DELETE from GroupChat where message_id=?";
                DB.query(deleteQuery, [id]).then(function (result) {
                  var index = $scope.messageList.indexOf(msg);
                  $scope.messageList.splice(index,1);
                });
                }, function (error) {
                  console.log(error);
                });
            }else{
              $cordovaFile.removeFile(cordova.file.externalRootDirectory+"StormChat/documents/", 'file-'+filename)
              .then(function (success) {
                var deleteQuery = "DELETE from GroupChat where message_id=?";
                DB.query(deleteQuery, [id]).then(function (result) {
                  var index = $scope.messageList.indexOf(msg);
                  $scope.messageList.splice(index,1);
                });
                }, function (error) {
                  console.log(error);
                });
            }

          }

        }

        $scope.downloadVideo=function(videoFile, messageId, msgdata){
          var resVideo = videoFile.split('-');
          var filename = resVideo[1];
          var url = $scope.url_prefix1+'public/uploads/file-'+filename;
          var targetPath = cordova.file.externalRootDirectory+"StormChat/videos/file-"+ filename;
          $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
            var isdownload = true;
            var nativeUrl = result.nativeURL;
            var updateQry = "UPDATE GroupChat SET isdownload = ?, video_url = ? WHERE message_id=?";
            DB.query(updateQry, [isdownload, result.nativeURL, messageId]).then(function (result) {
              var index = $scope.messageList.indexOf(msgdata);
              $scope.messageList[index].video_url = nativeUrl;
              $scope.messageList[index].isdownload="true";
              SocketService.emit('delete group file', {message_id: messageId, user_number: $scope.usernumber, file_path:'public/uploads/file-'+filename});
            });
          }, function (error) {
            console.log('Error', error);
          }, function (progress) {
           // PROGRESS HANDLING GOES HERE
          });
        }; 
        $scope.downloadAudio=function(AudioFile, messageId, msgdata){
          var resAudio = AudioFile.split('-');
          var filename = resAudio[1];
          var url = $scope.url_prefix1+'public/uploads/file-'+filename;
          var targetPath = cordova.file.externalRootDirectory+"StormChat/audio/file-"+ filename;
          $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
            var isdownload = true;
            var nativeUrl = result.nativeURL;
            var updateQry = "UPDATE GroupChat SET isdownload =?, audio_url = ?  WHERE message_id=?";
            DB.query(updateQry, [isdownload, result.nativeURL, messageId]).then(function (result) {
              var index = $scope.messageList.indexOf(msgdata);
              $scope.messageList[index].audio_url = nativeUrl
              $scope.messageList[index].isdownload="true";
              SocketService.emit('delete group file', {message_id: messageId, user_number: $scope.usernumber, file_path:'public/uploads/file-'+filename});
            });
          }, function (error) {
            console.log('Error', error);
          }, function (progress) {
           // PROGRESS HANDLING GOES HERE
          });
        }; 

        $scope.downloadImage=function(ImageFile, messageId, msgdata){
          console.log(messageId);
          console.log(msgdata);
          console.log(ImageFile);
          var resAudio = ImageFile.split('-');
          var filename = resAudio[1];
          var url = $scope.url_prefix1+'public/uploads/file-'+filename;
          var targetPath = cordova.file.externalRootDirectory+"StormChat/image/file-"+ filename;
          $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
            var isdownload = "true";
            var nativeUrl = result.nativeURL;
            var updateQry = "UPDATE GroupChat SET isdownload =?, image_url = ?  WHERE message_id=?";
            DB.query(updateQry, [isdownload, result.nativeURL, messageId]).then(function (result) {
              var index = $scope.messageList.indexOf(msgdata);
              console.log(index);
              $scope.messageList[index].image_url = nativeUrl;
              $scope.messageList[index].isdownload = "true";
              SocketService.emit('delete group file', {message_id: messageId, user_number: $scope.usernumber, file_path:'public/uploads/file-'+filename});

            });

          }, function (error) {
           console.log('Error', error);
          }, function (progress) {
            // PROGRESS HANDLING GOES HERE
          });
        }; 


        $scope.startTyping = function() {
          var data_server={
            'room_id': $scope.current_room_id,
            'sender_id': $scope.usernumber,
            'message':$scope.current_user+" is typing"
          }
          SocketService.emit('start group typing',data_server); //sending data to server
        };
        $scope.stopTyping = function() {
          var data={
            'room_id': $scope.current_room_id,
            'sender_id': $scope.usernumber,
            'message': ''
          }
          SocketService.emit('stop group typing',data); //sending data to server
        };
        SocketService.on('listen start group typing', function(msg){
          if(msg.sender_id != $scope.usernumber) {
            if(!(msg.sender_id in $scope.typistList))
            $scope.typistList.push(msg.sender_id);
            $scope.type_message = msg.message;
          }
        });
        SocketService.on('listen stop group typing', function(msg){
          $timeout(function() {
            if(msg.sender_id != $scope.usernumber) {
              $scope.typistList.push(msg.sender_id);
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
              'users': $scope.new_user_list,
              'time': moment()
            };
            var timeMsg = $scope.msg.time;
            var MsgTime = Date.parse(timeMsg);
            var messageId = '';
            var videoUrl = '';
            var audioUrl = '';
            var documentUrl = '';
            var imageUrl = "";

            var isDownload = false;
            $scope.messageList.push($scope.msg);
            var MessageQry = "Insert into GroupChat(message_id, room_id,sender_id, sender_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            DB.query(MessageQry, [messageId,$scope.msg.room_id,$scope.msg.sender_id, $scope.msg.sender_name, audioUrl, videoUrl, imageUrl, documentUrl, $scope.message, MsgTime, isDownload]).then(function (result) {

            });
            $scope.message = "";
            SocketService.emit('new group message', $scope.msg);
            $ionicScrollDelegate.scrollBottom();
          }
        };

        SocketService.on('group message created', function(msg){
          var messageID = msg._id;
          var roomID = msg.room_id;
          var senderID = msg.sender_id;
          var senderName = msg.sender_name;
          var Time = msg.time;
          var newDate = new Date(Time);
          var timestamptest = Date.parse(newDate);
          if(msg.sender_id==$scope.usernumber){
            if(msg.audio_url!=undefined || msg.video_url!=undefined || msg.document_url!=undefined || msg.image_url!=undefined || msg.message!=undefined){
              var updateQry = "UPDATE GroupChat SET message_id =? WHERE time=?";
              DB.query(updateQry, [msg._id, timestamptest]).then(function (result) {
                console.log("update");
                if(msg.audio_url){
                  SocketService.emit('delete group file', {message_id: msg._id, user_number: $scope.usernumber, file_path:msg.audio_url});
                }
                if(msg.video_url){
                  SocketService.emit('delete group file', {message_id: msg._id, user_number: $scope.usernumber, file_path:msg.video_url});
                }
                if(msg.document_url){
                  SocketService.emit('delete group file', {message_id: msg._id, user_number: $scope.usernumber, file_path:msg.document_url});
                }
                if(msg.image_url){
                  SocketService.emit('delete group file', {message_id: msg._id, user_number: $scope.usernumber, file_path:msg.image_url});
                }
                if(msg.message){
                  SocketService.emit('delete group chat message', {message_id: messageID, user_number: $scope.usernumber});
                }
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
          if(msg.sender_id != $scope.usernumber){
            msg.isdownload ="false";
            msg.message_id =messageID;
            $scope.messageList.push(msg);
             if(msg.message!=undefined && msg.message!=''){
                SocketService.emit('delete group chat message', {message_id: messageID, user_number: $scope.usernumber});
              }
            var isDownload = false;
            var MessageQry = "Insert into GroupChat(message_id, room_id,sender_id, sender_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
             DB.query(MessageQry, [messageID,roomID,senderID, senderName, audioUrl, videoUrl, imageUrl, documentUrl, message, Time, isDownload]).then(function (result) {
               console.log("message created");

               
            });
          }
          

        });



        $scope.getAllMsg = function(){
          var chatlist = "SELECT * from GroupChat where room_id=?";
          var results = DB.query(chatlist, [$scope.current_room_id]).then(function (result) {
          if(result.rows){
            var len = result.rows.length;
            $scope.messageList = [];
            for(var j=0;j<len;j++){
              $scope.messageList.push({"message_id":result.rows.item(j).message_id,"room_id":result.rows.item(j).room_id, "sender_id":result.rows.item(j).sender_id, "sender_name":result.rows.item(j).sender_name, "message":result.rows.item(j).message, "time":result.rows.item(j).time, "isdownload":result.rows.item(j).isdownload, "audio_url":result.rows.item(j).audio_url, "document_url":result.rows.item(j).document_url, "image_url":result.rows.item(j).image_url, "video_url":result.rows.item(j).video_url});  
            } 
          }else{
            console.log("insert All Ready List");
          }
          $ionicScrollDelegate.scrollBottom();
          });
        }

        SocketService.on('group data', function(msg){
          console.log("===msg====",msg);
            for(var i=0; i<msg.length; i++){
              var roomID = msg[i].room_id;
              var messageID = msg[i]._id;
              var senderID = msg[i].sender_id;
              var senderName= msg[i].sender_name;
              var Time= msg[i].time;
              var message = msg[i].message;
              var videoUrl = msg[i].video_url;
              var audioUrl = msg[i].audio_url;
              var imageUrl = msg[i].image_url;
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

              var MessageQry = "Insert into GroupChat(message_id, room_id, sender_id, sender_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
              DB.query(MessageQry, [messageID ,roomID, senderID, senderName, audioUrl, videoUrl, imageUrl, documentUrl,  message, Time, isDownload]).then(function (result) {
                console.log("insert", result);
                SocketService.emit('delete group chat message', {message_id: messageID, user_number: $scope.usernumber});
              });
            }
            $scope.getAllMsg();
          $ionicScrollDelegate.scrollBottom();
        });



        $scope.leaveGroupRoom = function(){
          $state.go('home');
        };

        $scope.$on('$destroy', function(){ 
	      SocketService.emit('leave group chat:room', {'room_id': $scope.current_room_id});
          SocketService.removeAllListeners('listen start typing');
          SocketService.removeAllListeners('listen stop typing');
          SocketService.removeAllListeners('group message created');
          SocketService.removeAllListeners('group data');
	    });

	    }catch(err){
	      console.log(err.message);
	    }
	});

})