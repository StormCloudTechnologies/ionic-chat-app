angular.module('AddGroupList.controllers', [])

.controller('AddGroupListCtrl', function($scope, $ionicLoading, $ionicPlatform, $state, localStorageService, APIService) {
  $ionicPlatform.ready(function(){
    try{

      $scope.group_name = localStorage.getItem("groupName");
      $scope.group_list = [];
      $scope.addMember = function(phone) {
          $scope.group_list.push(phone)
          console.log($scope.group_list);
      };
      $scope.createGroup = function() {
          APIService.setData({
              req_url: url_prefix + 'createGroup',
              data: {users: $scope.group_list, name: $scope.group_name}
          }).then(function(resp) {
              if(resp.data) {
                  $state.go('home');
              }
             },function(resp) {
                // This block execute in case of error.
          });
      }
     }catch(err){
      console.log(err.message);
    }
  });

})