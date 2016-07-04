// Ionic Starter App
var url_prefix = 'http://52.36.75.89:9992/api/';
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('ChatApp', ['ionic', 'LocalStorageModule', 'btford.socket-io', 'angularMoment', 'Signup.controllers', 'Home.controllers', 'Room.controllers', 'Group.controllers', 'Status.controllers', 'AddStatus.controllers', 'Setting.controllers', 'AddGroup.controllers', 'AddGroupList.controllers', 'Account.controllers', 'Privacy.controllers', 'Security.controllers', 'ChangeNumber.controllers', 'Delete.controllers', 'Profile.controllers', 'AddName.controllers', 'EditProfile.controllers', 'Chats.controllers', 'Notification.controllers', 'About.controllers', 'Contact.controllers', 'ngCordova.plugins', 'APIModule'])

.run(function($ionicPlatform, localStorageService, $rootScope, DB) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
   
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    DB.init();
  });
})
.constant('DB_CONFIG', {
 name: 'StormChat',
 tables: {
   Message: 
   {
      room_id: 'INTEGER',
      sender_id: 'INTEGER',
      sender_name: 'TEXT',
      receiver_id: 'INTEGER',
      receiver_name: 'TEXT',
      message: 'TEXT',
      time: 'TEXT'      
    },
    Contact: 
   {
      id : 'INTEGER',
      displayName: 'TEXT',
      contactnumber: 'VARCHAR',
      photos: 'TEXT',
      addresses: 'TEXT',
      nickname: 'TEXT',
      note: 'TEXT',
      organizations: 'TEXT',
      emails: 'TEXT'      
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
// .directive('headerShrink', function($document) {
//   var fadeAmt;

//   var shrink = function(header, content, amt, max) {
//     amt = Math.min(max, amt);
//     fadeAmt = 1 - amt / max;
//     ionic.requestAnimationFrame(function() {
//       header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
//       for(var i = 0, j = header.children.length; i < j; i++) {
//         header.children[i].style.opacity = fadeAmt;
//       }
//     });
//   };

//   return {
//     restrict: 'A',
//     link: function($scope, $element, $attr) {
//       var starty = $scope.$eval($attr.headerShrink) || 0;
//       var shrinkAmt;

//       var amt;

//       var y = 0;
//       var prevY = 0;
//       var scrollDelay = 0.4;

//       var fadeAmt;
      
//       var header = $document[0].body.querySelector('.bar-header');
//       var tabs = $document[0].body.querySelector('div.tabs');
//       var headerHeight = header.offsetHeight;
      
//       function onScroll(e) {
//         var scrollTop = e.detail.scrollTop;

//         if(scrollTop >= 0) {
//           y = Math.min(headerHeight / scrollDelay, Math.max(0, y + scrollTop - prevY));
//         } else {
//           y = 0;
//         }
//         console.log(scrollTop);

//         ionic.requestAnimationFrame(function() {
//           fadeAmt = 1 - (y / headerHeight);
//           header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + -y + 'px, 0)';
//           tabs.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + y + 'px, 0)';
//           for(var i = 0, j = header.children.length; i < j; i++) {
//             header.children[i].style.opacity = fadeAmt;
//             tabs.children[i].style.opacity = fadeAmt;
//           }
//         });

//         prevY = scrollTop;
//       }

//       $element.bind('scroll', onScroll);
//     }
//   }
// })
.directive('input', function($timeout) {
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

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
  })

  .state('home', {
    url: '/home',
    // cache: false,
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  })

  .state('room', {
    url: '/room',
    templateUrl: 'templates/room.html',
     controller: 'RoomCtrl'
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
