
angular.module('app.controllers', ['firebase','ionic','app.services','app.routes','ngCordova',])
  
.controller('homePageCtrl', ['$scope', '$stateParams','Auth','$state','$cordovaMedia', '$ionicLoading',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,Auth,$state,$cordovaMedia,$ionicLoading) {
    //$scope.firebaseUser=Auth.currentUser;
    
     var user = firebase.auth().currentUser;
     $scope.firebaseUser=user;

     var userId = firebase.auth().currentUser.uid;
     var userProfile= firebase.database().ref('/users/' + userId);
     // $scope.userProfile=function(){
	 	userProfile.on('value', function(snapshot) {
			  $scope.nickname=snapshot.val().username;
			  $scope.life=snapshot.val().life;
			  $scope.star=snapshot.val().star;
			  $scope.energy=snapshot.val().energy;
			  $scope.url=snapshot.val().profile_picture;
	    });

	  $scope.play = function(src) {
		var media = $cordovaMedia.newMedia(src);
		media.play();

		//IOS
	 //    var iOSPlayOptions = {
		//     numberOfLoops: 2,
		//     playAudioWhenScreenIsLocked : false
		// }

		// media.play(iOSPlayOptions); // iOS only!
		//
	  };

}])
   
.controller('exploreCtrl', ['$scope', '$stateParams', '$state','$ionicPopup','TypeOfQuestion','grade',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state,$ionicPopup,TypeOfQuestion,grade) {
	$scope.start=function(){
    grade.current=5;
	TypeOfQuestion.currentType=TypeOfQuestion.type[0];
	var userId = firebase.auth().currentUser.uid;
    var userlife= firebase.database().ref('/users/'+ userId+'/life');
    userlife.once('value', function(snapshot,userlife){
        var templife=snapshot.val();
        if(templife>0){
        	$state.go('tabsController.question1');
        }
        else{
        	var alertPopup = $ionicPopup.alert({
			    title: 'Out of life!',
			    template: 'You are out of life, please wait.'
		   });

		   alertPopup.then(function(res) {
		     console.log('Thank you for not eating my delicious ice cream cone');
		   });
 		};
    });
		
	};
	$scope.w2eq=function(){
    grade.current=5;
	TypeOfQuestion.currentType=TypeOfQuestion.type[1];
	var userId = firebase.auth().currentUser.uid;
    var userlife= firebase.database().ref('/users/'+ userId+'/life');
    userlife.once('value', function(snapshot,userlife){
        var templife=snapshot.val();
        if(templife>0){
        	$state.go('tabsController.question1');
        }
        else{
        	var alertPopup = $ionicPopup.alert({
			    title: 'Out of life!',
			    template: 'You are out of life, please wait.'
		   });

		   alertPopup.then(function(res) {
		     console.log('Thank you for not eating my delicious ice cream cone');
		   });
 		};
    });
		
	};



}])
   
.controller('gachaPageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
      
.controller('menuCtrl', ['$scope', '$stateParams','$state','Auth', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state, Auth) {
    var user = firebase.auth().currentUser;
    $scope.firebaseUser=user;
    if(user){
    	$scope.hidden=false;
    }
    else{
    	$scope.hidden=true;
    }
	$scope.logout=function(){
	  Auth.$signOut();
      console.log("Signing out");
      $state.go('login');
	};


}])
   

.controller('loginCtrl', ['$scope', '$stateParams', '$firebaseAuth','$timeout','$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseAuth, $timeout, $state) {
    $scope.user = {};
	$scope.signIn = function(){
	console.log("$scope.user:" + JSON.stringify($scope.user));

	$scope.firebaseUser = null;
	$scope.error = null;
	var auth = $firebaseAuth();

	auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser){
      $scope.firebaseUser = firebaseUser;

      $timeout(function(){
        $state.go('tabsController.homePage');
      }, 2000);
	}).catch(function(error) {
		$scope.error = error;
	});
	};

}])
   
.controller('signupCtrl', ['$scope', '$stateParams','$ionicModal', '$firebaseAuth', '$state', '$timeout', 'UserInfor',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicModal, $firebaseAuth, $state, $timeout,UserInfor) {
	$scope.user = {};
	$scope.signUp= function(){
	console.log("$scope.user:" + JSON.stringify($scope.user));
	$scope.firebaseUser = null;
	$scope.error = null;
	$scope.imageUrl='/img/male.jpg';
	$scope.database=firebase.database();
	var auth = firebase.auth();
	auth.createUserWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(firebaseUser){
		$scope.firebaseUser=firebaseUser;
		var uid=$scope.firebaseUser.uid;
		var nickname=$scope.user.nickname;
		var email=$scope.firebaseUser.email;
		var imageUrl=$scope.imageUrl;
        $scope.database.ref('users/' + uid).set({
		    username: nickname,
		    email: email,
		    profile_picture : imageUrl,
		    life: 5,
		    star: 1,
		    energy:30,
		    collections:{1:{"url":"/img/w1c1.jpg","description":"Fire"}}
           });
		$timeout(function(){
        $state.go('login');
      }, 2000);

	}).catch(function(error) {
	  $scope.error = error;
	});
	};

}])
   
.controller('collectionCtrl', ['$scope', '$stateParams','$firebaseArray', '$firebaseObject','Auth',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray,$firebaseObject,Auth) {

	var user = firebase.auth().currentUser;
     $scope.firebaseUser=user;
     $scope.url=[];
     $scope.description=[];

    var userId=firebase.auth().currentUser.uid;	
    var ref = firebase.database().ref('users/' + userId+'/').child("collections");
    $scope.collections = $firebaseArray(ref);
	// $scope.winACard=function(){
	//   // $add on a synchronized array is like Array.push() except it saves to the database!
	//     var num_temp=Math.floor((Math.random()*9)+1.0)
 //      	$scope.collections.$add({
 //        "url": $scope.urlOfCard,
 //        "description": $scope.description[num_temp]
 //        // timestamp: firebase.database.ServerValue.TIMESTAMP
 //      });

     // var userId = firebase.auth().currentUser.uid;
     // var userCollectionsArray= firebase.database().ref('/users/'+ userId+"/collections");

   //   userCollectionsArray.on('value',function(snapshot) {
   //   	 var numC=snapshot.numChildren();
   //   	 console.log(numC+"*****hi");

   //   	 for(i=1;i<=numC;i++){
   //       var userCards= firebase.database().ref('/users/' + userId+'/collections/'+i.toString());
   //       userCards.on('value', function(snapshot) {
			//   $scope.url.push(snapshot.val().url);
			//   console.log(snapshot.val().url);
			//   $scope.description.push(snapshot.val().description);
			// });
   //      }
   //      $scope.count=[];

	  //   for(i=0;i<numC;i++){
	  //    	$scope.count.push(i);
	  //   }
	  //    console.log($scope.url);
   //   });

}])
   
.controller('settingCtrl', ['$scope', '$stateParams','$state','Auth', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state, Auth) {
    var user = firebase.auth().currentUser;
    $scope.firebaseUser=user;
    if(user){
    	$scope.hidden=false;
    }
    else{
    	$scope.hidden=true;
    }
	$scope.logout=function(){
	  Auth.$signOut();
      console.log("Signing out");
      $state.go('login');
	};


}])
   
.service('grade',function(){
	this.current=5;
})
.service('TypeOfQuestion',function(){
	this.type=['easyQuestions','w2eq','w3eq'];
	this.currentType=this.type[0];
	this.typeCard={'easyQuestions':'academyCards','w2eq':'summerCards','w3eq':'shrineCards'}
})

// .factory("Cardcollections", ["$firebaseArray",
//   function($firebaseArray) {
//     // create a reference to the database where we will store our data
//     var ref = firebase.database().ref();

//     return $firebaseArray(ref);
//   }
// ])
.controller('question1Ctrl', ['$scope', '$stateParams', '$state','Auth','$ionicPopup','grade','TypeOfQuestion',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state,Auth,$ionicPopup,grade,TypeOfQuestion) {

    var easyQuestions= firebase.database().ref('/'+TypeOfQuestion.currentType+'/');
    // var easyQuestions= firebase.database().ref('/w2eq/');
    $scope.initialId=Math.floor((Math.random()*(Object.keys(easyQuestions).length-1))+1.0);
    console.log(grade.current);
    console.log(TypeOfQuestion.currentType);
    // console.log($scope.initialId);
	var question= firebase.database().ref('/'+TypeOfQuestion.currentType+'/'+$scope.initialId.toString());
	question.on('value', function(snapshot) {
	  $scope.listPref=snapshot.val().options;
	  $scope.question=snapshot.val().question;
	  $scope.answer=snapshot.val().answer;
	  console.log($scope.answer);
	  for(i in $scope.listPref){
	  	console.log($scope.listPref[i]);
	  }

	});
	$scope.checkItems = { };
    $scope.print = function(item) {
        for(i in $scope.checkItems){
			$scope.checkItems[i]=false;
		};
    	$scope.checkItems[item]=true;
	    console.log($scope.checkItems);

	};

	$scope.submit=function(){

		var array = [];
	    for(i in $scope.checkItems) {
	        console.log($scope.checkItems[i]);
	        if($scope.checkItems[i] == true) {
	            array.push(i);
	        }
	    }
	    console.log(array);
	    if(array[0]==$scope.answer){

	     var confirmPopup = $ionicPopup.show({
	       title: 'Congratulation!',
	       template: 'Your answer is right!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
	            var userId = firebase.auth().currentUser.uid;
                var userlife= firebase.database().ref('/users/'+ userId+'/life');
                userlife.once('value', function(snapshot,userlife){
                    var templife=snapshot.val();
                    console.log(templife);
	                var updates={};  
	                updates['/users/'+ userId+'/life'] = templife-1;
					firebase.database().ref().update(updates);                   
                });
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.explore');		
	         }

	       },
	       { text: '<b>Next Question</b>',
	         onTap: function(){
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.question2');
	         }

	       }
	       ]
	     });
	}
	else{
		grade.current=grade.current-1;
	     var confirmPopup = $ionicPopup.show({
	       title: 'Oops!',
	       template: 'Your answer is wrong!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
	            var userId = firebase.auth().currentUser.uid;
                var userlife= firebase.database().ref('/users/'+ userId+'/life');
                userlife.once('value', function(snapshot,userlife){
                    var templife=snapshot.val();
                    console.log(templife);
	                var updates={};  
	                updates['/users/'+ userId+'/life'] = templife-1;
					firebase.database().ref().update(updates);                   
                });
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.explore');
	         }

	       },
	       { text: '<b>Next Question</b>',
	         onTap: function(){
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.question2');
	         }

	       }
	       ]
	     });

	}

	}
	
}])
   
.controller('question2Ctrl', ['$scope', '$stateParams', '$state','Auth','$ionicPopup','grade','TypeOfQuestion','grade',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state,Auth,$ionicPopup,grade,TypeOfQuestion,grade) {

    var easyQuestions= firebase.database().ref('/'+TypeOfQuestion.currentType+'/');
    $scope.initialId=Math.floor((Math.random()*(Object.keys(easyQuestions).length-1))+1.0);
    $scope.currentGrade=grade;
    console.log($scope.currentGrade.current);
    // Math.floor((Math.random() * 10) + 1);
	var question= firebase.database().ref('/'+TypeOfQuestion.currentType+'/'+$scope.initialId.toString());
	question.on('value', function(snapshot) {
	  $scope.listPref=snapshot.val().options;
	  $scope.question=snapshot.val().question;
	  $scope.answer=snapshot.val().answer;
	  for(i in $scope.listPref){
	  	console.log($scope.listPref[i]);
	  }

	});
	$scope.checkItems = { };
    $scope.print = function(item) {
        for(i in $scope.checkItems){
			$scope.checkItems[i]=false;
		};
    	$scope.checkItems[item]=true;
	    console.log($scope.checkItems);

	};

	$scope.submit=function(){

		var array = [];
	    for(i in $scope.checkItems) {
	        console.log($scope.checkItems[i]);
	        if($scope.checkItems[i] == true) {
	            array.push(i);
	        }
	    }
	    console.log(array);
	    if(array[0]==$scope.answer){

	     var confirmPopup = $ionicPopup.show({
	       title: 'Congratulation!',
	       template: 'Your answer is right!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
	            var userId = firebase.auth().currentUser.uid;
                var userlife= firebase.database().ref('/users/'+ userId+'/life');
                userlife.once('value', function(snapshot,userlife){
                    var templife=snapshot.val();
                    console.log(templife);
	                var updates={};  
	                updates['/users/'+ userId+'/life'] = templife-1;
					firebase.database().ref().update(updates);                   
                });
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.explore');
	         }

	       },
	       { text: '<b>Next Question</b>',
	         onTap: function(){
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.question3');
	         }

	       }
	       ]
	     });
	}
	else{
		grade.current=grade.current-1;
	     var confirmPopup = $ionicPopup.show({
	       title: 'Oops!',
	       template: 'Your answer is wrong!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
	            var userId = firebase.auth().currentUser.uid;
                var userlife= firebase.database().ref('/users/'+ userId+'/life');
                userlife.once('value', function(snapshot,userlife){
                    var templife=snapshot.val();
                    console.log(templife);
	                var updates={};  
	                updates['/users/'+ userId+'/life'] = templife-1;
					firebase.database().ref().update(updates);                   
                });
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.explore');
	         }

	       },
	       { text: '<b>Next Question</b>',
	         onTap: function(){
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.question3');
	         }

	       }
	       ]
	     });

	}
	}
	
}])

.controller('question3Ctrl', ['$scope', '$stateParams', '$state','Auth','$ionicPopup','TypeOfQuestion','grade',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state,Auth,$ionicPopup,TypeOfQuestion,grade) {
    console.log(grade.current);
    var easyQuestions= firebase.database().ref('/'+TypeOfQuestion.currentType+'/');
    $scope.initialId=Math.floor((Math.random()*(Object.keys(easyQuestions).length-1))+1.0);
    // Math.floor((Math.random() * 10) + 1);
	var question= firebase.database().ref('/'+TypeOfQuestion.currentType+'/'+$scope.initialId.toString());
	question.on('value', function(snapshot) {
	  $scope.listPref=snapshot.val().options;
	  $scope.question=snapshot.val().question;
	  $scope.answer=snapshot.val().answer;
	  for(i in $scope.listPref){
	  	console.log($scope.listPref[i]);
	  }

	});
	$scope.checkItems = { };
    $scope.print = function(item) {
        for(i in $scope.checkItems){
			$scope.checkItems[i]=false;
		};
    	$scope.checkItems[item]=true;
	    console.log($scope.checkItems);

	};

	$scope.submit=function(){

		var array = [];
	    for(i in $scope.checkItems) {
	        console.log($scope.checkItems[i]);
	        if($scope.checkItems[i] == true) {
	            array.push(i);
	        }
	    }
	    console.log(array);
	    if(array[0]==$scope.answer){

	     var confirmPopup = $ionicPopup.show({
	       title: 'Congratulation!',
	       template: 'Your answer is right!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
	            var userId = firebase.auth().currentUser.uid;
                var userlife= firebase.database().ref('/users/'+ userId+'/life');
                userlife.once('value', function(snapshot,userlife){
                    var templife=snapshot.val();
                    console.log(templife);
	                var updates={};  
	                updates['/users/'+ userId+'/life'] = templife-1;
					firebase.database().ref().update(updates);                   
                });
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.explore');
	         }

	       },
	       { text: '<b>Next Question</b>',
	         onTap: function(){
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.question4');
	         }

	       }
	       ]
	     });
	}
	else{
		 grade.current=grade.current-1;
	     var confirmPopup = $ionicPopup.show({
	       title: 'Oops!',
	       template: 'Your answer is wrong!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
	            var userId = firebase.auth().currentUser.uid;
                var userlife= firebase.database().ref('/users/'+ userId+'/life');
                userlife.once('value', function(snapshot,userlife){
                    var templife=snapshot.val();
                    console.log(templife);
	                var updates={};  
	                updates['/users/'+ userId+'/life'] = templife-1;
					firebase.database().ref().update(updates);                   
                });
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.explore');
	         }

	       },
	       { text: '<b>Next Question</b>',
	         onTap: function(){
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.question4');
	         }

	       }
	       ]
	     });

	}
	}
	
}])

.controller('question4Ctrl', ['$scope', '$stateParams', '$state','Auth','$ionicPopup','TypeOfQuestion','grade',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state,Auth,$ionicPopup,TypeOfQuestion,grade) {
    console.log(grade.current);
    var easyQuestions= firebase.database().ref('/'+TypeOfQuestion.currentType+'/');
    $scope.initialId=Math.floor((Math.random()*(Object.keys(easyQuestions).length-1))+1.0);
    // Math.floor((Math.random() * 10) + 1);
	var question= firebase.database().ref('/'+TypeOfQuestion.currentType+'/'+$scope.initialId.toString());
	question.on('value', function(snapshot) {
	  $scope.listPref=snapshot.val().options;
	  $scope.question=snapshot.val().question;
	  $scope.answer=snapshot.val().answer;
	  for(i in $scope.listPref){
	  	console.log($scope.listPref[i]);
	  }

	});
	$scope.checkItems = { };
    $scope.print = function(item) {
        for(i in $scope.checkItems){
			$scope.checkItems[i]=false;
		};
    	$scope.checkItems[item]=true;
	    console.log($scope.checkItems);

	};

	$scope.submit=function(){

		var array = [];
	    for(i in $scope.checkItems) {
	        console.log($scope.checkItems[i]);
	        if($scope.checkItems[i] == true) {
	            array.push(i);
	        }
	    }
	    console.log(array);
	    if(array[0]==$scope.answer){

	     var confirmPopup = $ionicPopup.show({
	       title: 'Congratulation!',
	       template: 'Your answer is right!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
	            var userId = firebase.auth().currentUser.uid;
                var userlife= firebase.database().ref('/users/'+ userId+'/life');
                userlife.once('value', function(snapshot,userlife){
                    var templife=snapshot.val();
                    console.log(templife);
	                var updates={};  
	                updates['/users/'+ userId+'/life'] = templife-1;
					firebase.database().ref().update(updates);                   
                });
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.explore');
	         }

	       },
	       { text: '<b>Next Question</b>',
	         onTap: function(){
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.question5');
	         }

	       }
	       ]
	     });
	}
	else{
		 grade.current=grade.current-1;
	     var confirmPopup = $ionicPopup.show({
	       title: 'Oops!',
	       template: 'Your answer is wrong!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
	            var userId = firebase.auth().currentUser.uid;
                var userlife= firebase.database().ref('/users/'+ userId+'/life');
                userlife.once('value', function(snapshot,userlife){
                    var templife=snapshot.val();
                    console.log(templife);
	                var updates={};  
	                updates['/users/'+ userId+'/life'] = templife-1;
					firebase.database().ref().update(updates);                   
                });
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.explore');
	         }

	       },
	       { text: '<b>Next Question</b>',
	         onTap: function(){
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.question5');
	         }

	       }
	       ]
	     });

	}
	}
	
}])

.controller('question5Ctrl', ['$scope', '$stateParams', '$state','Auth','$ionicPopup','TypeOfQuestion','grade',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state,Auth,$ionicPopup,TypeOfQuestion,grade) {
    console.log(grade.current);
    var easyQuestions= firebase.database().ref('/'+TypeOfQuestion.currentType+'/');
    $scope.initialId=Math.floor((Math.random()*(Object.keys(easyQuestions).length-1))+1.0);
    // Math.floor((Math.random() * 10) + 1);
	var question= firebase.database().ref('/'+TypeOfQuestion.currentType+'/'+$scope.initialId.toString());
	question.on('value', function(snapshot) {
	  $scope.listPref=snapshot.val().options;
	  $scope.question=snapshot.val().question;
	  $scope.answer=snapshot.val().answer;
	  for(i in $scope.listPref){
	  	console.log($scope.listPref[i]);
	  }

	});
	$scope.checkItems = { };
    $scope.print = function(item) {
        for(i in $scope.checkItems){
			$scope.checkItems[i]=false;
		};
    	$scope.checkItems[item]=true;
	    console.log($scope.checkItems);

	};

	$scope.submit=function(){

		var array = [];
	    for(i in $scope.checkItems) {
	        console.log($scope.checkItems[i]);
	        if($scope.checkItems[i] == true) {
	            array.push(i);
	        }
	    }
	    console.log(array);
	    if(array[0]==$scope.answer){

	     var confirmPopup = $ionicPopup.show({
	       title: 'Congratulation!',
	       template: 'Your answer is right!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
	            var userId = firebase.auth().currentUser.uid;
                var userlife= firebase.database().ref('/users/'+ userId+'/life');
                userlife.once('value', function(snapshot,userlife){
                    var templife=snapshot.val();
                    console.log(templife);
	                var updates={};  
	                updates['/users/'+ userId+'/life'] = templife-1;
					firebase.database().ref().update(updates);                   
                });
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.explore');
	         }

	       },
	       { text: '<b>See your grade</b>',
	         onTap: function(){
	         	$state.go($state.current, {}, {reload: true});
	            if(grade.current<5){
	         		$state.go('sorryYouLoose');
	            }
	            else if(grade.current==5){
	            	$state.go('youWinACard');
	            }
	            else{
	            	console.log("Error!!!!!");
	            }
	         }

	       }
	       ]
	     });
	}
	else{
		 grade.current=grade.current-1;
	     var confirmPopup = $ionicPopup.show({
	       title: 'Oops!',
	       template: 'Your answer is wrong!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
	            var userId = firebase.auth().currentUser.uid;
                var userlife= firebase.database().ref('/users/'+ userId+'/life');
                userlife.once('value', function(snapshot,userlife){
                    var templife=snapshot.val();
                    console.log(templife);
	                var updates={};  
	                updates['/users/'+ userId+'/life'] = templife-1;
					firebase.database().ref().update(updates);                   
                });
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.explore');
	         }

	       },
	       { text: '<b>See your grade</b>',
	         onTap: function(){
	         	// $state.go($state.current, {}, {reload: true});
	         	$state.go('sorryYouLoose');

	         }

	       }
	       ]
	     });

	}
	}
	
}])
   
// .service('TypeOfQuestion',function(){
// 	this.type=['easyQuestions','w2eq','w3eq'];
// 	this.currentType=this.type[0];
// 	this.typeCard={'easyQuestions':'academyCards';'w2eq':'summerCards','w3eq':'shrineCards'}
// })

.controller('youWinACardCtrl', ['$scope', '$stateParams', '$state', 'TypeOfQuestion', 'Auth', '$firebaseArray', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, TypeOfQuestion, Auth, $firebaseArray) {
    var groupOfCard=TypeOfQuestion.typeCard[TypeOfQuestion.currentType]
    console.log(groupOfCard);
    var cards= firebase.database().ref('/'+groupOfCard+'/');
    // var easyQuestions= firebase.database().ref('/w2eq/');
    $scope.initialId=Math.floor((Math.random()*(Object.keys(cards).length-1))+1.0);
    console.log($scope.initialId);
    console.log(TypeOfQuestion.currentType);
    // console.log($scope.initialId);
	var question= firebase.database().ref('/'+groupOfCard+'/'+$scope.initialId.toString());
	question.on('value', function(snapshot) {
	  $scope.urlOfCard=snapshot.val().url;
	  console.log($scope.urlOfCard);
	});
    var userId=firebase.auth().currentUser.uid;
    $scope.description=["Fire","Water","Wind","ligtning","ligting","Life","Power","Earth","Gold","Stone"]
	// $scope.urlOfCard='img/w10c1.jpg';
	

	
    var ref = firebase.database().ref('users/' + userId+'/').child("collections");
    $scope.collections = $firebaseArray(ref);
	$scope.winACard=function(){
	  // $add on a synchronized array is like Array.push() except it saves to the database!
	    var num_temp=Math.floor((Math.random()*9)+1.0)
      	$scope.collections.$add({
        "url": $scope.urlOfCard,
        "description": $scope.description[num_temp]
        // timestamp: firebase.database.ServerValue.TIMESTAMP
      });
	  //   firebase.database().ref('users/' + userId+'/collections').set({
	  //   username: name,
	  //   email: email,
	  //   profile_picture : imageUrl
	  // });
	   $state.go('tabsController.explore');
	}

}])
   
.controller('sorryYouLooseCtrl', ['$scope', '$stateParams','grade', '$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,grade,$state) {
	console.log(grade.current);
	$scope.finalGrade=grade.current;
	console.log($scope.finalGrade);
    $scope.backToExplore=function(){
      $state.go('tabsController.explore');
   }

}])


.controller('introCtrl', ['$scope', '$state','$stateParams', '$ionicSlideBoxDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state,$stateParam,$ionicSlideBoxDelegate) {

	$scope.startApp = function(){
        var user = firebase.auth().currentUser;
        if(user){
        	$state.go('tabsController.homePage');
        }
        else{
        	$state.go('login');
        }
		
	};
	$scope.next = function() {
	    $ionicSlideBoxDelegate.next();
	};
	$scope.previous = function() {
	   $ionicSlideBoxDelegate.previous();
	};
	  // Called each time the slide changes
	$scope.slideChanged = function(index) {
	   $scope.slideIndex = index;
	};

}])
 