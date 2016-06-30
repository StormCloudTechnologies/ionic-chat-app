// Ionic Starter App
var url_prefix = 'http://52.36.75.89:9992/api/';
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('ChatApp', ['ionic', 'LocalStorageModule', 'btford.socket-io', 'angularMoment', 'Signup.controllers', 'Home.controllers', 'Room.controllers', 'Group.controllers', 'Status.controllers', 'AddStatus.controllers', 'Setting.controllers', 'AddGroup.controllers', 'AddGroupList.controllers', 'ngCordova.plugins', 'APIModule'])

.run(function($ionicPlatform, localStorageService) {
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
  });
})
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
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/signup');

   // var islogin = localStorageService.getItem("userLogin")
   //  if(islogin=="1"){
   //    $urlRouterProvider.otherwise('/rooms');
   //  }
   //  else{
   //    $urlRouterProvider.otherwise('/login');
   //  }

});
