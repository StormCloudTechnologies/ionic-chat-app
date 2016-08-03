// Ionic Starter App
var url_prefix = 'http://52.36.75.89:9992/api/';
 // var url_prefix = 'http://localhost:9992/api/';
// var url_prefix = 'http://192.168.0.103:9992/api/';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('ChatApp', ['ionic', 'LocalStorageModule', 'btford.socket-io', 'angularMoment', 'Signup.controllers', 'Home.controllers', 'Room.controllers', 'Group.controllers', 'Status.controllers', 'AddStatus.controllers', 'Setting.controllers', 'AddGroup.controllers', 'AddGroupList.controllers', 'Account.controllers', 'Privacy.controllers', 'Security.controllers', 'ChangeNumber.controllers', 'Delete.controllers', 'Profile.controllers', 'AddName.controllers', 'EditProfile.controllers', 'Chats.controllers', 'Notification.controllers', 'About.controllers', 'Contact.controllers', 'GroupChat.controllers', 'GroupView.controllers', 'RoomView.controllers', 'ngCordova.plugins', 'APIModule', 'ionic-native-transitions'])


.run(function($ionicPlatform, localStorageService, $cordovaFile, $rootScope, DB, $cordovaSplashscreen, $ionicPopup, $cordovaDialogs, $location) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    DB.init();
    setTimeout(function() {
      $cordovaSplashscreen.hide();
      deferred.resolve();
    }, 3000);

     $ionicPlatform.registerBackButtonAction(function () {
        var hashvalue = $location.url();
        if(hashvalue=="/home"){
          // A confirm dialog
          $cordovaDialogs.confirm('Do you really want to exit !!', 'Are You Sure ?', ['Cancel','OK'])
            .then(function(buttonIndex) {
              // no button = 0, 'OK' = 1, 'Cancel' = 2
             var btnIndex = buttonIndex;
              if(btnIndex==1){
                ionic.Platform.exitApp();
              }
            });
        }else{
          navigator.app.backHistory();
        }
      }, 100);


     var testfolder=function(){
        
        
        // firstuser = $localstorage.get("firstuser");
        // if(firstuser=="0"){
        //   $state.go('app.Home');
        // }else{
        //   firstuser="";
        // }
        // var device = $cordovaDevice.getDevice();

       // var cordova = $cordovaDevice.getCordova();
    //alert("cordova"+JSON.stringify(cordova));
//alert("FILE"+JSON.stringify(cordova.file));
//    alert("DIR123"+JSON.stringify(cordova.file.dataDirectory));
        //var model = $cordovaDevice.getModel();

//        var platform = $cordovaDevice.getPlatform();

 //       var uuid = $cordovaDevice.getUUID();

   //     $scope.deviceID = $cordovaDevice.getUUID();
    $cordovaFile.getFreeDiskSpace().then(function (success) {
      if(success){
        $cordovaFile.checkDir(cordova.file.externalRootDirectory, "StormChat").then(function (success)
        {
          $cordovaFile.checkDir(cordova.file.externalRootDirectory, "StormChat/images").then(function (success)
          {
            
          }, function (error) {
            $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/images", false)
            .then(function (success) {
              //alert("CREATEImage Folder"+JSON.stringify(success));
            }, function (error) {
              //alert("CREATEImageserror"+JSON.stringify(error));
            });
          });
          $cordovaFile.checkDir(cordova.file.externalRootDirectory, "StormChat/documents").then(function (success)
          {
            
          }, function (error) {
            $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/documents", false)
            .then(function (success) {
              //alert("CREATEImage Folder"+JSON.stringify(success));
            }, function (error) {
              //alert("CREATEImageserror"+JSON.stringify(error));
            });
          });
          $cordovaFile.checkDir(cordova.file.externalRootDirectory, "StormChat/videos").then(function (success)
          {
            //downloadvideo();
          }, function (error) {
            $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/videos", false)
            .then(function (success) {
              //downloadvideo();
              //alert("CREATEImage Folder"+JSON.stringify(success));
            }, function (error) {
              //alert("CREATEImageserror"+JSON.stringify(error));
            });
          });
          $cordovaFile.checkDir(cordova.file.externalRootDirectory, "StormChat/audio").then(function (success)
          {
            //downloadvideo();
          }, function (error) {
            $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/audio", false)
            .then(function (success) {
              //downloadvideo();
              //alert("CREATEImage Folder"+JSON.stringify(success));
            }, function (error) {
              //alert("CREATEImageserror"+JSON.stringify(error));
            });
          });
        }, function (error) {
          // CREATE
          $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat", false)
          .then(function (success) {
            $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/images", false)
            .then(function (success) {
           //alert("CREATEImage Folder"+JSON.stringify(success));
            }, function (error) {
              //alert("CREATEImageserror"+JSON.stringify(error));
            });

            $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/documents", false)
            .then(function (success) {
              //alert("CREATEdocuments Folder"+JSON.stringify(success));
            }, function (error) {
            //  alert("CREATEdocumentserror"+JSON.stringify(error));
            });
            $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/videos", false)
            .then(function (success) {
              //downloadvideo();
              //alert("CREATEvideos Folder"+JSON.stringify(success));
            }, function (error) {
              //alert("CREATEvideoserror"+JSON.stringify(error));
            });
            $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/audio", false)
            .then(function (success) {
              //downloadvideo();
              //alert("CREATEvideos Folder"+JSON.stringify(success));
            }, function (error) {
              //alert("CREATEvideoserror"+JSON.stringify(error));
            });
              
          }, function (error) {
            //alert("CREATEerror"+JSON.stringify(error));
          });
        });
        $cordovaFile.checkDir(cordova.file.externalRootDirectory, "StormChat/videos").then(function (success)
        {
          $cordovaFile.checkDir(cordova.file.externalRootDirectory, "StormChat/videos/sent").then(function (success)
          {
            
          }, function (error) {
            $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/videos/sent", false)
            .then(function (success) {
              //alert("CREATEImage Folder"+JSON.stringify(success));
            }, function (error) {
              //alert("CREATEImageserror"+JSON.stringify(error));
            });
          });
          }, function (error) {
            // CREATE
            $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/videos", false)
            .then(function (success) {
              $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/videos/sent", false)
              .then(function (success) {
             //alert("CREATEImage Folder"+JSON.stringify(success));
              }, function (error) {
                //alert("CREATEImageserror"+JSON.stringify(error));
              });
            }, function (error) {
              //alert("CREATEerror"+JSON.stringify(error));
            });
          });
  
        $cordovaFile.checkDir(cordova.file.externalRootDirectory, "StormChat/documents").then(function (success)
          {
            $cordovaFile.checkDir(cordova.file.externalRootDirectory, "StormChat/documents/sent").then(function (success)
            {
              
            }, function (error) {
              $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/documents/sent", false)
              .then(function (success) {
                //alert("CREATEImage Folder"+JSON.stringify(success));
              }, function (error) {
                //alert("CREATEImageserror"+JSON.stringify(error));
              });
            });
            }, function (error) {
              // CREATE
              $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/documents", false)
              .then(function (success) {
                $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/documents/sent", false)
                .then(function (success) {
               //alert("CREATEImage Folder"+JSON.stringify(success));
                }, function (error) {
                  //alert("CREATEImageserror"+JSON.stringify(error));
                });
              }, function (error) {
                //alert("CREATEerror"+JSON.stringify(error));
              });
            });


            $cordovaFile.checkDir(cordova.file.externalRootDirectory, "StormChat/images").then(function (success)
              {
                $cordovaFile.checkDir(cordova.file.externalRootDirectory, "StormChat/images/sent").then(function (success)
                {
                  
                }, function (error) {
                  $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/images/sent", false)
                  .then(function (success) {
                    //alert("CREATEImage Folder"+JSON.stringify(success));
                  }, function (error) {
                    //alert("CREATEImageserror"+JSON.stringify(error));
                  });
                });
                }, function (error) {
                  // CREATE
                  $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/images", false)
                  .then(function (success) {
                    $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/images/sent", false)
                    .then(function (success) {
                   //alert("CREATEImage Folder"+JSON.stringify(success));
                    }, function (error) {
                      //alert("CREATEImageserror"+JSON.stringify(error));
                    });
                  }, function (error) {
                    //alert("CREATEerror"+JSON.stringify(error));
                  });
                });

            $cordovaFile.checkDir(cordova.file.externalRootDirectory, "StormChat/audio").then(function (success)
              {
                $cordovaFile.checkDir(cordova.file.externalRootDirectory, "StormChat/audio/sent").then(function (success)
                {
                  
                }, function (error) {
                  $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/audio/sent", false)
                  .then(function (success) {
                    //alert("CREATEImage Folder"+JSON.stringify(success));
                  }, function (error) {
                    //alert("CREATEImageserror"+JSON.stringify(error));
                  });
                });
                }, function (error) {
                  // CREATE
                  $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/audio", false)
                  .then(function (success) {
                    $cordovaFile.createDir(cordova.file.externalRootDirectory, "StormChat/audio/sent", false)
                    .then(function (success) {
                   //alert("CREATEImage Folder"+JSON.stringify(success));
                    }, function (error) {
                      //alert("CREATEImageserror"+JSON.stringify(error));
                    });
                  }, function (error) {
                    //alert("CREATEerror"+JSON.stringify(error));
                  });
                });
           
        }
        }, function (error) {
            //alert("Space"+JSON.stringify(error));
        });
      

  
       
      }
    
      testfolder();

    //  if (window.cordova) {
    //     cordova.plugins.diagnostic.isContactsAuthorized(function(status){
    //     if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
    //         console.log("Contacts use is authorized");
    //     }
    //     }, function(error){
    //         console.error(error);
    //     });
    // }

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
  });
})
.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
})
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.scrolling.jsScrolling(false);
})
.config(function($ionicNativeTransitionsProvider){
  $ionicNativeTransitionsProvider.setDefaultTransition({
    "direction"        : "default", // 'left|right|up|down', default 'left' (which is like 'next')
    "duration"         :  40, // in milliseconds (ms), default 400
    "slowdownfactor"   :    3, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
    "slidePixels"      :   20, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
    "iosdelay"         :  20, // ms to wait for the iOS webview to update before animation kicks in, default 60
    "androiddelay"     :  10, // same as above but for Android, default 70
    "winphonedelay"    :  20, // same as above but for Windows Phone, default 200,
    "fixedPixelsTop"   :    0, // the number of pixels of your fixed header, default 0 (iOS and Android)
    "fixedPixelsBottom":   60,  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
    "href" : 'page'
  });
})
.constant('DB_CONFIG', {
   name: 'StormChat3',
   tables: {
     Message: 
     {
        message_id: 'INTEGER',
        sender_id: 'INTEGER',
        sender_name: 'TEXT',
        receiver_id: 'INTEGER',
        receiver_name: 'TEXT',
        message: 'TEXT',
        image_url:'TEXT',
        video_url:'TEXT',
        audio_url:'TEXT',
        document_url:'TEXT',
        time: 'DATE',
        isdownload: 'TEXT'       
      },
      GroupChat: 
     {
        room_id: 'INTEGER',
        message_id: 'INTEGER',
        sender_id: 'INTEGER',
        sender_name: 'TEXT',
        image_url:'TEXT',
        video_url:'TEXT',
        audio_url:'TEXT',
        document_url:'TEXT',
        message: 'TEXT',
        time: 'DATE',
        isdownload: 'TEXT'      
      },
      Contact: 
     {
        id : 'INTEGER',
        displayName: 'TEXT',
        contactnumber: 'VARCHAR',
        photos: 'TEXT'
      },
      ChatList: 
     {
        sender_id: 'INTEGER',
        sender_name: 'TEXT',
        receiver_id: 'INTEGER',
        receiver_name: 'TEXT',
        message: 'TEXT',
        time: 'TEXT'      
      },
      GroupList: 
     {
        id: 'INTEGER',
        groupname: 'TEXT',
        member: 'TEXT',
        Creatname: 'TEXT',
        Creatnumber: 'TEXT',
        time: 'TEXT'      
      }
   }
})


.factory('DB', function ($q, DB_CONFIG) {
 
 var self = this;
 
 self.db = null;

 self.init = function () {

   if (window.sqlitePlugin)
       self.db = window.sqlitePlugin.openDatabase({ name: DB_CONFIG.name });
   else if (window.openDatabase)
       self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);

   for (var tableName in DB_CONFIG.tables) {
     //if (window.CP.shouldStopExecution(2)) {
       //  break;
     //}
     var defs = [];
     var columns = DB_CONFIG.tables[tableName];
     for (var columnName in columns) {
         //if (window.CP.shouldStopExecution(1)) {
             //break;
         //}
         var type = columns[columnName];
         defs.push(columnName + ' ' + type);
     }
     //window.CP.exitedLoop(1);
     var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + defs.join(', ') + ')';
     self.query(sql);
   }
   //window.CP.exitedLoop(2);
 };
 self.insertAll = function (tableName, data) {
   var columns = [], bindings = [];
   for (var columnName in DB_CONFIG.tables[tableName]) {
     //if (window.CP.shouldStopExecution(3)) {
         //break;
     //}
     columns.push(columnName);
     bindings.push('?');
   }
   //window.CP.exitedLoop(3);
   var sql = 'INSERT INTO ' + tableName + ' (' + columns.join(', ') + ') VALUES (' + bindings.join(', ') + ')';
   for (var i = 0; i < data.length; i++) {
     var values = [];
     for (var j = 0; j < columns.length; j++) {
         values.push(data[i][columns[j]]);
     }
     self.query(sql, values);
   }
 };
 self.query = function (sql, bindings) {
   console.log("===bindings====",bindings);
   bindings = typeof bindings !== 'undefined' ? bindings : [];
   var deferred = $q.defer();
   self.db.transaction(function (transaction) {
     transaction.executeSql(sql, bindings, function (transaction, result) {
         deferred.resolve(result);
     }, function (transaction, error) {
         deferred.reject(error);
     });
   });
   return deferred.promise;
 };
 self.fetchAll = function (result) {
   var output = [];
   for (var i = 0; i < result.rows.length; i++) {
       output.push(result.rows.item(i));
   }
   return output;
 };
 return self;
})
.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
})
.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
})
.factory('$localstorage', ['$window', function($window) {
  return {
  set: function(key, value) {
   $window.localStorage[key] = value;
  },
  get: function(key, defaultValue) {
   return $window.localStorage[key] || defaultValue;
  },
  setObject: function(key, value) {
   $window.localStorage[key] = JSON.stringify(value);
  },
  getObject: function(key) {
   return JSON.parse($window.localStorage[key] || '{}');
  }
  }
}])

.directive('textarea', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function(scope, element, attr) {
      element.bind('focus', function(e) {
        if (scope.onFocus) {
          $timeout(function() {
            scope.onFocus();
          });
        }
      });
      element.bind('blur', function(e) {
        if (scope.onBlur) {
          $timeout(function() {
            scope.onBlur();
          });
        }
      });
      element.bind('keydown', function(e) {
        if (e.which == 13) {
          if (scope.returnClose) element[0].blur();
          if (scope.onReturn) {
            $timeout(function() {
              scope.onReturn();
            });
          }
        }
      });
    }
  }
})


.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
  })

  .state('home', {
    url: '/home',
    cache: false,
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  })

  .state('room', {
    url: '/room',
   templateUrl: 'templates/room.html',
     controller: 'RoomCtrl'
  })
  .state('groupChat', {
    url: '/groupChat',
    templateUrl: 'templates/groupChat.html',
     controller: 'GroupChatCtrl'
  })
  .state('group', {
    url: '/group',
    templateUrl: 'templates/group.html',
     controller: 'GroupCtrl'
  })
  .state('status', {
    url: '/status',
    templateUrl: 'templates/status.html',
     controller: 'StatusCtrl'
  })
  .state('addstatus', {
    url: '/addstatus',
    templateUrl: 'templates/addstatus.html',
     controller: 'AddStatusCtrl'
  })
  .state('setting', {
    url: '/setting',
    templateUrl: 'templates/setting.html',
     controller: 'SettingCtrl'
  })
  .state('addgroup', {
    url: '/addgroup',
    cache: false,
    templateUrl: 'templates/addgroup.html',
     controller: 'AddGroupCtrl'
  })
  .state('addgrouplist', {
    url: '/addgrouplist',
    templateUrl: 'templates/addgrouplist.html',
     controller: 'AddGroupListCtrl'
  })
  .state('account', {
    url: '/account',
    templateUrl: 'templates/account.html',
     controller: 'AccountCtrl'
  })
  .state('privacy', {
    url: '/privacy',
    templateUrl: 'templates/privacy.html',
     controller: 'PrivacyCtrl'
  })
  .state('security', {
    url: '/security',
    templateUrl: 'templates/security.html',
     controller: 'SecurityCtrl'
  })
  .state('changenumber', {
    url: '/changenumber',
    templateUrl: 'templates/changenumber.html',
     controller: 'ChangeNumberCtrl'
  })
  .state('delete', {
    url: '/delete',
    templateUrl: 'templates/delete.html',
     controller: 'DeleteCtrl'
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'templates/profile.html',
     controller: 'ProfileCtrl'
  })
  .state('addname', {
    url: '/addname',
    templateUrl: 'templates/addname.html',
     controller: 'AddNameCtrl'
  })
  .state('editprofile', {
    url: '/editprofile',
    cache: false,
    templateUrl: 'templates/editprofile.html',
     controller: 'EditProfileCtrl'
  })
  .state('chats', {
    url: '/chats',
    templateUrl: 'templates/chats.html',
     controller: 'ChatsCtrl'
  })
  .state('notification', {
    url: '/notification',
    templateUrl: 'templates/notification.html',
     controller: 'NotificationCtrl'
  })
  .state('about', {
    url: '/about',
    templateUrl: 'templates/about.html',
     controller: 'AboutCtrl'
  })
  .state('contact', {
    url: '/contact',
    templateUrl: 'templates/contact.html',
     controller: 'ContactCtrl'
  })
  .state('roomview', {
    url: '/roomview',
    templateUrl: 'templates/roomview.html',
     controller: 'RoomViewCtrl'
  })
  .state('groupview', {
    url: '/groupview',
    templateUrl: 'templates/groupview.html',
     controller: 'GroupViewCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/signup');

   var islogin = localStorage.getItem("isslogin")
    if(islogin=="1"){
      $urlRouterProvider.otherwise('/home');
    }
    else{
      $urlRouterProvider.otherwise('/signup');
    }

});
