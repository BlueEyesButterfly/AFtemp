angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.factory("Auth",["$firebaseAuth",
	function($firebaseAuth){
	return $firebaseAuth();
}])

.factory("UserInfor", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the database where we will store our data
    var ref = firebase.database().ref();

    return $firebaseArray(ref);
  }
])

.service('BlankService', [function(){

}]);

