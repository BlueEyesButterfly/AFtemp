
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
   
.controller('exploreCtrl', ['$scope', '$stateParams', '$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state) {
	$scope.start=function(){
        $state.go('tabsController.question1');
	}


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
		    star: 3,
		    energy:30
           });
		$timeout(function(){
        $state.go('login');
      }, 2000);

	}).catch(function(error) {
	  $scope.error = error;
	});
	};

}])
   
.controller('collectionCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

	var user = firebase.auth().currentUser;
     $scope.firebaseUser=user;
     $scope.url=[];
     $scope.description=[];

     var userId = firebase.auth().currentUser.uid;

     var userCollectionsArray= firebase.database().ref('/users/'+ userId+'/collections');
     var arrarylength=Object.keys(userCollectionsArray).length;
     for(i=1;i<arrarylength;i++){
         var userCards= firebase.database().ref('/users/' + userId+'/collections/'+i.toString());
         userCards.on('value', function(snapshot) {
			  $scope.url.push(snapshot.val().url);
			  $scope.description.push(snapshot.val().description);
	    });
     }

     $scope.count=[];
     $scope.al=Object.keys($scope.description).length
     for(i=0;i<2;i++){
     	$scope.count.push(i);
     }


     // $scope.userProfile=function(){
	 	






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
   
.controller('question1Ctrl', ['$scope', '$stateParams', '$state','Auth','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state,Auth,$ionicPopup) {
	// $state.go($state.current, {}, {reload: true});

    var easyQuestions= firebase.database().ref('/easyQuestions/');
    $scope.initialId=Math.floor((Math.random()*(Object.keys(easyQuestions).length-1))+1.0);
    // $scope.len=Object.keys(easyQuestions).length;
    




    // $scope.getQuestions=function($scope){
	var question= firebase.database().ref('/easyQuestions/'+$scope.initialId.toString());
	//$scope.question="hello";
     // $scope.userProfile=function(){
	question.on('value', function(snapshot) {
	  $scope.listPref=snapshot.val().options;
	  $scope.question=snapshot.val().question;
	  $scope.answer=snapshot.val().answer;
	  for(i in $scope.listPref){
	  	console.log($scope.listPref[i]);
	  }

	});
	//$scope.initialId=$scope.initialId-1;


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
	     var confirmPopup = $ionicPopup.show({
	       title: 'Oops!',
	       template: 'Your answer is wrong!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
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

		//$state.go('tabsController.question2');
      //$scope.initialId=$scope.initialId-1;

   //     if($scope.initialId>0){
   //     	 var easyQuestions= firebase.database().ref('/easyQuestions/'+$scope.initialId.toString());

			// easyQuestions.on('value', function(snapshot) {
			//   $scope.listPref=snapshot.val().options;
			//   $scope.question=snapshot.val().question;
			//   $scope.answer=snapshot.val().answer;
			//   for(i in $scope.listPref){
			//   	console.log($scope.listPref[i]);
			//   }

			// });
			// $scope.checkItems = { };

			// $scope.print = function() {
			//     console.log($scope.checkItems);
			// };

			// $scope.save = function() {
			//     var array = [];
			//     for(i in $scope.checkItems) {
			//         console.log($scope.checkItems[i]);
			//         if($scope.checkItems[i] == true) {
			//             array.push(i);
			//         }
			//     }
			//     console.log(array);
			// };
            
   //     }
   //     else{

   //       $state.go('tabsController.question2');
   //     }
	}
	
}])
   
.controller('question2Ctrl', ['$scope', '$stateParams', '$state','Auth','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state,Auth,$ionicPopup) {

    var easyQuestions= firebase.database().ref('/easyQuestions/');
    $scope.initialId=Math.floor((Math.random()*(Object.keys(easyQuestions).length-1))+1.0);
    // Math.floor((Math.random() * 10) + 1);
	var question= firebase.database().ref('/easyQuestions/'+$scope.initialId.toString());
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
	     var confirmPopup = $ionicPopup.show({
	       title: 'Oops!',
	       template: 'Your answer is wrong!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
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

.controller('question3Ctrl', ['$scope', '$stateParams', '$state','Auth','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state,Auth,$ionicPopup) {

    var easyQuestions= firebase.database().ref('/easyQuestions/');
    $scope.initialId=Math.floor((Math.random()*(Object.keys(easyQuestions).length-1))+1.0);
    // Math.floor((Math.random() * 10) + 1);
	var question= firebase.database().ref('/easyQuestions/'+$scope.initialId.toString());
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
	     var confirmPopup = $ionicPopup.show({
	       title: 'Oops!',
	       template: 'Your answer is wrong!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
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

.controller('question4Ctrl', ['$scope', '$stateParams', '$state','Auth','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state,Auth,$ionicPopup) {

    var easyQuestions= firebase.database().ref('/easyQuestions/');
    $scope.initialId=Math.floor((Math.random()*(Object.keys(easyQuestions).length-1))+1.0);
    // Math.floor((Math.random() * 10) + 1);
	var question= firebase.database().ref('/easyQuestions/'+$scope.initialId.toString());
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
	     var confirmPopup = $ionicPopup.show({
	       title: 'Oops!',
	       template: 'Your answer is wrong!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
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

.controller('question5Ctrl', ['$scope', '$stateParams', '$state','Auth','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state,Auth,$ionicPopup) {

    var easyQuestions= firebase.database().ref('/easyQuestions/');
    $scope.initialId=Math.floor((Math.random()*(Object.keys(easyQuestions).length-1))+1.0);
    // Math.floor((Math.random() * 10) + 1);
	var question= firebase.database().ref('/easyQuestions/'+$scope.initialId.toString());
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
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.explore');
	         }

	       },
	       { text: '<b>Next Question</b>',
	         onTap: function(){
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('youWinACard');
	         }

	       }
	       ]
	     });
	}
	else{
	     var confirmPopup = $ionicPopup.show({
	       title: 'Oops!',
	       template: 'Your answer is wrong!',
	       buttons:[
	       { text: 'Quit',
	         onTap: function(){
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('tabsController.explore');
	         }

	       },
	       { text: '<b>Next Question</b>',
	         onTap: function(){
	         	$state.go($state.current, {}, {reload: true});
	         	$state.go('sorryYouLoose');
	         }

	       }
	       ]
	     });

	}
	}
	
}])
   
.controller('youWinACardCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('sorryYouLooseCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


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
 