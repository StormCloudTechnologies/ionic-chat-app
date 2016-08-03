angular.module('EditProfile.controllers', [])

.controller('EditProfileCtrl', function($scope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService, $ionicModal, $cordovaFileTransfer, $ionicPopup, $cordovaCamera, $localstorage) {
  $ionicPlatform.ready(function(){
    try{
    	$scope.imagePath = '';
    	$scope.url_prefix1 = 'http://192.168.0.103:9992/';
      // $scope.url_prefix1 = 'http://52.36.75.89:9992/';
      $scope.userName = localStorageService.get('username');
      $scope.usernumber = localStorageService.get('usernumber');

    	$scope.uploadImage = function(){
          myPopup = $ionicPopup.show({
            template:'<input type="submit" ng-click="cameraOpen()" class="button button-block button-positive" value="Camera" ><input type="submit" ng-click="galleryOpen()" class="button button-block button_color_dark button-positive" value="Gallery" >',
            title: '<h4>Choose Options</h4>',
            scope: $scope,
            buttons: [
              { text: 'Cancel',
                type:'button-assertive'
               },
            ]
          });
          myPopup.then(function(res) {});
         };

         $scope.cameraOpen = function(){
          try{
            myPopup.close();
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



       
        $scope.galleryOpen = function(){
          try{
            myPopup.close();
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
                     $scope.imagePath = obj.path;
                     console.log($scope.imagePath);
                     $localstorage.set("UserImage", $scope.imagePath );
                     $ionicLoading.hide();
                      // var res = imagePath.split(".");
                      // var check = res[1];
                      // var resImage = imagePath.split('-');
                      // var filename = resImage[1];
                      // var url = $scope.url_prefix1+'public/uploads/file-'+filename;
                      // var targetPath = cordova.file.externalRootDirectory+"StormChat/images/sent/file-"+ filename;
                      // $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                      //   $scope.msg = {
                      //       'sender_id': $scope.usernumber,
                      //       'sender_name': $scope.current_user,
                      //       'receiver_id': $scope.current_friend_number,
                      //       'receiver_name': $scope.current_chat_friend,
                      //       'image_url': result.nativeURL,
                      //       'time': moment()
                      //    };
                      //   $scope.messageList.push($scope.msg);
                      //   var messageId = '';
                      //   var videoUrl = '';
                      //   var audioUrl = '';
                      //   var documentUrl = '';
                      //   var message = '';
                     
                      //   var isDownload = "true";
                      //   var timeImage = $scope.msg.time;
                      //   var ImageTime = Date.parse(timeImage);
                      
                      //   var MessageQry = "Insert into Message(message_id,sender_id, sender_name, receiver_id, receiver_name, audio_url, video_url, image_url, document_url, message, time, isdownload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)";
                      //  DB.query(MessageQry, [messageId ,$scope.usernumber, $scope.current_user, $scope.current_friend_number, $scope.current_chat_friend, audioUrl, videoUrl, $scope.msg.image_url, documentUrl,  message, ImageTime, isDownload]).then(function (result) {
                           
                      //    });

                          
                      //     $ionicScrollDelegate.scrollBottom();

                      //     SocketService.emit('new message', $scope.msg);
                      // }, function (error) {
                      //     console.log('Error', error);
                      // }, function (progress) {
                      //     // PROGRESS HANDLING GOES HERE
                      // });
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

        

    $ionicModal.fromTemplateUrl('templates/profileview.html', {
		    scope: $scope,
		    animation: 'slide-in'
		}).then(function(profileview) {
		    $scope.profileview = profileview;
		});
		$scope.openModalprofileview = function() {
		    $scope.profileview.show();
		};
		$scope.closeModalprofileview = function() {
		    $scope.profileview.hide();
		};

		$scope.editName = $localstorage.get('editName');
    $scope.userName = $scope.editName;
    $scope.UserImage = $localstorage.get("UserImage");
     // $scope.UserImage = "img/profile.png";
  	$scope.userProfileDone = function(){
       console.log('done');
       APIService.setData({
            req_url: url_prefix + 'updateContact',
            data: {phone:$scope.usernumber, username: $scope.userName , image_url: $scope.UserImage}
        }).then(function(resp) {
          console.log(resp);
            if(resp.data) {
              $localstorage.set("userStatus", resp.data.status);
              localStorageService.set('username', resp.data.username);
              $state.go('home');
            }
           },function(resp) {
            console.log('error',resp);
        });
  	}

     }catch(err){
      console.log(err.message);
    }
  });

})