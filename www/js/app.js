var url_prefix = 'http://52.36.75.89:9992/api/';
//var url_prefix = 'http://localhost:9992/api/';

angular.module('ChatApp', ['ionic', 'LocalStorageModule', 'btford.socket-io', 'angularMoment', 'Login.controllers', 'Home.controllers', 'Room.controllers', 'ngCordova', 'APIModule'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
     

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
  });
})
.directive('fakeStatusbar', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="fake-statusbar"><div class="pull-left">Carrier</div><div class="time">3:30 PM</div><div class="pull-right">50%</div></div>'
  }
})
.directive('headerShrink', function($document) {
  var fadeAmt;

  var shrink = function(header, content, amt, max) {
    amt = Math.min(44, amt);
    fadeAmt = 1 - amt / 44;
    ionic.requestAnimationFrame(function() {
      header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
      for(var i = 0, j = header.children.length; i < j; i++) {
        header.children[i].style.opacity = fadeAmt;
      }
    });
  };

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var starty = $scope.$eval($attr.headerShrink) || 0;
      var shrinkAmt;
      
      var header = $document[0].body.querySelector('.bar-header');
      var headerHeight = header.offsetHeight;
      
      $element.bind('scroll', function(e) {
        var scrollTop = null;
        if(e.detail){
          scrollTop = e.detail.scrollTop;
        }else if(e.target){
          scrollTop = e.target.scrollTop;
        }
        if(scrollTop > starty){
          // Start shrinking
          shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
          shrink(header, $element[0], shrinkAmt, headerHeight);
        } else {
          shrink(header, $element[0], 0, headerHeight);
        }
      });
    }
  }
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

// .directive('searchBar', [function () {
//   return {
//     scope: {
//       ngModel: '='
//     },
//     require: ['?ngModel'],
//     restrict: 'E',
//     replace: true,
//     template:'<div class="searchBar">'+
//               '<div class="searchTxt" ng-show="ngModel.show">'+
//                   '<div class="bgdiv"></div>'+
//                   '<div class="bgtxt">'+
//                     '<input type="text" placeholder="Procurar..." ng-model="ngModel.txt">'+
//                   '</div>'+
//                 '</div>'+
//                 '<i class="icon pullSearch text-white placeholder-icon" ng-click="ngModel.txt=\'\';ngModel.show=!ngModel.show"></i>'+
//             '</div>',
    
//     compile: function (element, attrs) {
//       var icon=attrs.icon
//           || (ionic.Platform.isAndroid() && 'ion-android-search')
//           || (ionic.Platform.isIOS()     && 'ion-ios7-search')
//           || 'ion-search';
//       angular.element(element[0].querySelector('.icon')).addClass(icon);
      
//       return function($scope, $element, $attrs, ctrls) {
//         var navBarCtrl = ctrls[0];
//         $scope.navElement = $attrs.side === 'right' ? navBarCtrl.rightButtonsElement : navBarCtrl.leftButtonsElement;
        
//       };
//     },
//     controller: ['$scope','$ionicNavBarDelegate', function($scope,$ionicNavBarDelegate){
//       var title, definedClass;
//       $scope.$watch('ngModel.show', function(showing, oldVal, scope) {
//         if(showing!==oldVal) {
//           if(showing) {
//             if(!definedClass) {
//               var numicons=$scope.navElement.children().length;
//               angular.element($scope.navElement[0].querySelector('.searchBar')).addClass('numicons'+numicons);
//             }
            
//             title = $ionicNavBarDelegate.getTitle();
//             $ionicNavBarDelegate.setTitle('');
//           } else {
//             $ionicNavBarDelegate.setTitle(title);
//           }
//         } else if (!title) {
//           title = $ionicNavBarDelegate.getTitle();
//         }
//       });
//     }]
//   };
// }])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.platform.android.navBar.alignTitle('left');
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('rooms', {
    url: '/rooms',
    templateUrl: 'templates/rooms.html',
    controller: 'HomeController'
  })

  .state('room', {
    url: '/room',
    templateUrl: 'templates/room.html',
     controller: 'RoomController'
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
