
angular.module('app.controllers', ['firebase','ionic','app.services','app.routes','ngCordova',])
  
.controller('homePageCtrl', ['$scope', '$stateParams','Auth','$state','$cordovaMedia', '$ionicLoading','safeApply',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,Auth,$state,$cordovaMedia,$ionicLoading,safeApply) {
    //$scope.firebaseUser=Auth.currentUser;
    
     var user = firebase.auth().currentUser;
     $scope.firebaseUser=user;

     var userId = firebase.auth().currentUser.uid;
     var userProfile= firebase.database().ref('/users/'+ userId);
     // $scope.userProfile=function(){
 	userProfile.on('value', function(snapshot) {
 		safeApply($scope, function() {
		  $scope.nickname=snapshot.val().username;
		  $scope.life=snapshot.val().life;
		  $scope.star=snapshot.val().star;
		  $scope.energy=snapshot.val().energy;
		  $scope.url=snapshot.val().profile_picture;
		});
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
   
.controller('exploreCtrl', ['$scope', '$stateParams', '$state','$ionicPopup','TypeOfQuestion','grade','sharedQuestionType',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state,$ionicPopup,TypeOfQuestion,grade,sharedQuestionType) {
	$scope.start=function(x){
    grade.setCurrent(5);
	TypeOfQuestion.currentType=TypeOfQuestion.type[x];
	sharedQuestionType.setProperty(TypeOfQuestion.type[x]);
	console.log(x);
	console.log(TypeOfQuestion.currentType);
	var userId = firebase.auth().currentUser.uid;
    var userlife= firebase.database().ref('/users/'+ userId+'/life');
    userlife.once('value', function(snapshot,userlife){
        var templife=snapshot.val();
        if(templife>0){
        	$state.go('tabsController.question1');
        	//$state.go('question1');
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

.factory('safeApply', [function($rootScope) {
    return function($scope, fn) {
        var phase = $scope.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if (fn) {
                $scope.$eval(fn);
            }
        } else {
            if (fn) {
                $scope.$apply(fn);
            } else {
                $scope.$apply();
            }
        }
    }
}])
   
.controller('gachaPageCtrl', ['$scope', '$stateParams', '$firebaseArray','safeApply','$ionicPopup','$timeout','$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$firebaseArray,safeApply,$ionicPopup,$timeout,$state) {
     
     $scope.cardImage="img/circle_s.png";
     $scope.summon=function(x){
        // var ref_cardGroup=firebase.database().ref('nsCards/');
        var ref_cardGroup=firebase.database().ref(x);
        var cards=$firebaseArray(ref_cardGroup);
        //random choose a card from nsCards
        var num_card=Math.floor((Math.random()*19)+1.0);
        // $scope.cardImage=cards[num_card].url;
        //var ref2=firebase.database().ref('nsCards/'+JSON.stringify(num_card)+'/');
        var ref2=firebase.database().ref(x+JSON.stringify(num_card)+'/');
        ref2.on("value", function(snapshot) {
		  // This isn't going to show up in the DOM immediately, because
		  // Angular does not know we have changed this in memory.
		  // $scope.data = snapshot.val();
		  // To fix this, we can use $scope.$apply() to notify Angular that a change occurred.
		  safeApply($scope, function() {
		  	//obtain the url of this chosen card
		    $scope.cardImageTemp = snapshot.val().url;
		    console.log(snapshot.val().url);
		    var userId=firebase.auth().currentUser.uid;	
		    //add this card to user's collections
			$scope.description=["Fire","Water","Wind","Lightning","Light","Life","Power","Earth","Gold","Stone"]
		    var ref = firebase.database().ref('users/' + userId+'/').child("collections");
		    $scope.collections = $firebaseArray(ref);
		    var num_temp=Math.floor((Math.random()*9)+1.0)
	      	// $scope.collections.$add({
	       //  "url": $scope.cardImage,
	       //  "description": $scope.description[num_temp]
	       //  // timestamp: firebase.database.ServerValue.TIMESTAMP
	      	// });
	     //  	if(x=='nsCards/'){
		    //     var alertPopup = $ionicPopup.alert({
				  //   title: 'Congratulation!',
				  //   template: 'You get a new card! Your Energy minus 3 points.'
			   // });
		    //      alertPopup.then(function() {
		    //      	//reassigned the cardImage to default
	     //             $timeout(function(){
				  //       $scope.cardImage="img/circle_s.png";
				  //   }, 2000);
			        
			   // });
	     //   }
	     //   else{
	     //   	    var alertPopup = $ionicPopup.alert({
				  //   title: 'Congratulation!',
				  //   template: 'You get a new card! Your Energy minus 5 points.'
			   // });
		    //      alertPopup.then(function() {
		    //      	//reassigned the cardImage to default
	     //             $timeout(function(){
				  //       $scope.cardImage="img/circle_s.png";
				  //   }, 2000);
			        
			   // });
	     //   }
	         // substract the energy point of user
	         var userEngy= firebase.database().ref('/users/'+ userId+'/energy');
                userEngy.once('value', function(snapshot){
                    var tempEngy=snapshot.val();
                    console.log(tempEngy);
	                var updates={};
	                if(x=='nsCards/'){
	                	if(tempEngy>=3){
	                		updates['/users/'+ userId+'/energy'] = tempEngy-3;
	                		$scope.cardImage = $scope.cardImageTemp;
	                	    $scope.collections.$add({
					        "url": $scope.cardImage,
					        "description": $scope.description[num_temp]
					        // timestamp: firebase.database.ServerValue.TIMESTAMP
					      	});
			                var alertPopup = $ionicPopup.alert({
						    title: 'Congratulation!',
						    template: 'You get a new card! Your Energy minus 3 points.'
				   			});
				         	alertPopup.then(function() {
				         	//reassigned the cardImage to default
				                $timeout(function(){
							        $scope.cardImage="img/circle_s.png";
							    }, 2000);
					        
						   });
	                	}
	                	else{
	                		var alertPopup = $ionicPopup.alert({
							    title: 'Sorry!',
							    template: 'You do not have enough Energy points.'
						   });
	                	}
	                	
	                } 
	                else{
	                	if(tempEngy>=5){
	                		updates['/users/'+ userId+'/energy'] = tempEngy-5;
	                		$scope.cardImage = $scope.cardImageTemp;
	                	    $scope.collections.$add({
					        "url": $scope.cardImage,
					        "description": $scope.description[num_temp]
					        // timestamp: firebase.database.ServerValue.TIMESTAMP
					      	});
	        	       	    var alertPopup = $ionicPopup.alert({
							    title: 'Congratulation!',
							    template: 'You get a new card! Your Energy minus 5 points.'
						     });
					         alertPopup.then(function() {
					         	//reassigned the cardImage to default
				                 $timeout(function(){
							        $scope.cardImage="img/circle_s.png";
							    }, 2000);
						        
						   });
	                	}
	                	else{
	                		var alertPopup = $ionicPopup.alert({
							    title: 'Sorry!',
							    template: 'You do not have enough Energy points.'
						   });
	                	}
	                	
	                }
	                
					firebase.database().ref().update(updates);                   
                });



		  });
		});



     };
     $scope.shop=function(){
     	$state.go('tabsController.shop');
     }

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
   
.controller('aboutUsCtrl', ['$scope', '$stateParams', '$firebaseAuth','$timeout','$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseAuth, $timeout, $state) {

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
   
.controller('collectionCtrl', ['$scope', '$stateParams','$firebaseArray', '$firebaseObject','Auth','showCardImage','$state','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray,$firebaseObject,Auth,showCardImage,$state,$ionicPopup) {

	var user = firebase.auth().currentUser;
    $scope.firebaseUser=user;
    $scope.url=[];
    $scope.description=[];
    $scope.energyPoint={"Fire":3,"Water":3,"Wind":3,"Lightning":5,"Light":5,"Life":8,"Power":5,"Earth":3,"Gold":8,"Stone":3}
    $scope.lifePoint={"Fire":1,"Water":1,"Wind":1,"Lightning":1,"Light":2,"Life":3,"Power":2,"Earth":2,"Gold":3,"Stone":1}
    var userId=firebase.auth().currentUser.uid;	
    var ref = firebase.database().ref('users/' + userId+'/').child("collections");
    $scope.collections = $firebaseArray(ref);

    $scope.showCard=function(x){
    	showCardImage.setCardImage(x);
    	$state.go('tabsController.showCard');
    };
    $scope.exchangeForEnergy=function(x){
        console.log($scope.energyPoint[x.description]);
        var userId=firebase.auth().currentUser.uid;
        var userEnergy= firebase.database().ref('/users/'+ userId+'/energy');
        userEnergy.once('value', function(snapshot,userlife){
            var tempEngy=snapshot.val();
            console.log(tempEngy);
            var updates={};  
            updates['/users/'+ userId+'/energy'] = tempEngy+$scope.energyPoint[x.description];
			firebase.database().ref().update(updates);                   
        });
    	$scope.collections.$remove(x).then(function(ref) {
		  ref.key === x.$id; // true
		});

		var alertPopup = $ionicPopup.alert({
		    title: 'Exchange succeeded!',
		    template: 'You gained '+JSON.stringify($scope.energyPoint[x.description])+ " Energy Points!"
	   });
    };
    $scope.exchangeForLife=function(x){
        console.log($scope.lifePoint[x.description]);
        var userId=firebase.auth().currentUser.uid;
        var userlife= firebase.database().ref('/users/'+ userId+'/life');
                userlife.once('value', function(snapshot,userlife){
                    var templife=snapshot.val();
                    console.log(templife);
	                var updates={};  
	                updates['/users/'+ userId+'/life'] = templife+$scope.lifePoint[x.description];
					firebase.database().ref().update(updates);                   
                });
    	$scope.collections.$remove(x).then(function(ref) {
		  ref.key === x.$id; // true
		});
		var alertPopup = $ionicPopup.alert({
		    title: 'Exchange succeeded!',
		    template: 'You gained '+JSON.stringify($scope.lifePoint[x.description])+ " Life Points!"
	   });
    };
}])

.controller('shopCtrl', ['$scope', '$stateParams','$firebaseArray', 'Auth','showCardImage','$state','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray,Auth,showCardImage,$state,$ionicPopup) {

	// var user = firebase.auth().currentUser;
 //    $scope.firebaseUser=user;
 //    var userId=firebase.auth().currentUser.uid;	
    // var ref = firebase.database().ref('users/' + userId+'/').child("collections");
    var ref = firebase.database().ref().child("sCards");
    $scope.goods = $firebaseArray(ref);


    $scope.showCard=function(x){
    	showCardImage.setCardImage(x);
    	$state.go('tabsController.showCardInShop');
    };
    $scope.buyWithEnergy=function(x){
        var userId=firebase.auth().currentUser.uid;
        var userEnergy= firebase.database().ref('/users/'+ userId+'/energy');
        userEnergy.once('value', function(snapshot,userlife){
            var tempEngy=snapshot.val();
            if(tempEngy>x.price){
            console.log(tempEngy);
            console.log(x.price);
            var updates={};  
            updates['/users/'+ userId+'/energy'] = tempEngy-x.price;
			firebase.database().ref().update(updates); 
			var ref_collections = firebase.database().ref('users/' + userId+'/').child("collections");
		    var collections=$firebaseArray(ref_collections);
		    collections.$add({
		        "url": x.url,
		        "description": x.description
		    });
		    var alertPopup = $ionicPopup.alert({
				    title: 'Buy a New Card!',
				    template: 'It cost you '+JSON.stringify(x.price)+' Energy Points.'+' You can find the new card in your collections.'
			});   
		   }
		   else{
		   	    var alertPopup = $ionicPopup.alert({
				    title: 'Sorry!',
				    template: 'You do not have enough energy points.'
				});  
		   }                 
        });

    };
}])

.controller('showCardCtrl', ['$scope', '$stateParams','$firebaseArray', '$firebaseObject','Auth','showCardImage',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray,$firebaseObject,Auth,showCardImage) {
    $scope.urlOfCard=showCardImage.getCardImage();

}])

.controller('showCardInShopCtrl', ['$scope', '$stateParams','$firebaseArray', '$firebaseObject','Auth','showCardImage',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray,$firebaseObject,Auth,showCardImage) {
    $scope.urlOfCard=showCardImage.getCardImage();

}])
   
.controller('settingCtrl', ['$scope', '$stateParams','$state','Auth','$ionicPopup', '$firebaseArray','safeApply',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state, Auth,$ionicPopup,$firebaseArray,safeApply) {
    

    	// var ref_usename = firebase.database().ref('users/' + userId+'/username')
	    // ref_usename.on('value', function(snapshot,userlife){
		   //  safeApply($scope, function() {	    
		   //  	$scope.user_name=snapshot.val();
		   //  	console.log($scope.user_name+"**inside");
		   //  });

	    // });


	    var userId = firebase.auth().currentUser.uid;   
	    var user = firebase.auth().currentUser;
	    $scope.firebaseUser=user;
	    if(user){
	    	$scope.hidden=false;
	    }
	    else{
	    	$scope.hidden=true;
	    };

	    //console.log($scope.user_name+"out");
	    //$scope.k={nickname:$scope.user_name};
	    $scope.k={nickname:"e.g nick"};
	    $scope.user = {
	    	url:[
		    	"img/male.jpg",
		    	"img/female.jpg"
	    	]
	    };
       

    
    
    $scope.test = function(){
    	console.log($scope.user.url);
    	if($scope.user.url=="female"){
    		$scope.icon="img/female.jpg";
    	}
    	else{
    		$scope.icon="img/male.jpg";
    	}
    	console.log($scope.icon);
    	console.log($scope.k.nickname);
    	// $scope.kn=$scope.k.nickname;
    	// console.log($scope.k.nickname);
    }

    

    $scope.updateUser=function(){
    	var userId = firebase.auth().currentUser.uid;
        var userlife= firebase.database().ref('/users/'+ userId+'/username');
        userlife.once('value', function(snapshot,userlife){
            var updates_1={};  
            updates_1['/users/'+ userId+'/username'] = $scope.k.nickname;
			firebase.database().ref().update(updates_1);                   
        });
        var userIcon= firebase.database().ref('/users/'+ userId+'/profile_picture');
        userIcon.once('value', function(snapshot,userlife){
            var updates_2={};  
            updates_2['/users/'+ userId+'/profile_picture'] = $scope.icon;
			firebase.database().ref().update(updates_2);                   
        });
        var alertPopup = $ionicPopup.alert({
		    title: 'Update!',
		    template: 'User information is updated successfully.'
	   });

    };

    $scope.aboutUs=function(){
    	$state.go('aboutUs');
    };
	$scope.logout=function(){
	  Auth.$signOut();
      console.log("Signing out");
      $state.go('login');
	};


}])

.service('showCardImage',function(){
	var cardImage="";
    return {
    getCardImage: function () {
        return cardImage;
    },
    setCardImage: function(value) {
        cardImage = value;
    }
	};
})   
.service('grade',function(){
	var current=5;
    return {
    getCurrent: function () {
        return current;
    },
    setCurrent: function(value) {
        current = value;
    }
};
})

// .service('TypeOfQuestion',function(){
// 	this.type=['easyQuestions','w2eq','w3eq'];
// 	this.currentType=this.type[0];
// 	this.typeCard={'easyQuestions':'academyCards','w2eq':'summerCards','w3eq':'shrineCards'}
// })
.service('TypeOfQuestion',function(){
    this.currentType='easyQuestions';    
	this.type=['easyQuestions','w2eq','w3eq','w4eq','w5eq','w6eq','w7eq','w8eq','w9eq','w10eq','w11eq','w12eq','w13eq','w14eq','w15eq','w16eq'];
	this.typeCard={'easyQuestions':'academyCards','w2eq':'summerCards','w3eq':'shrineCards','w4eq':'lolitaCards','w5eq':'hallowCards','w6eq':'ChrismCards','w7eq':'magicCards','w8eq':'summonCards','w9eq':'swordCards','w10eq':'nyearCards','w11eq':'wworldCards','w12eq':'devilsCards','w13eq':'weaponCards','w14eq':'princeCards','w15eq':'monsterCards','w16eq':'spaceCards'}

})

.service('sharedQuestionType',function(){
	var property = 'easyQuestions';

        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
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
    // $state.go($state.current, {}, {reload: true});

    var easyQuestions= firebase.database().ref('/'+TypeOfQuestion.currentType+'/');
    // var easyQuestions= firebase.database().ref('/w2eq/');
    $scope.initialId=Math.floor((Math.random()*(Object.keys(easyQuestions).length-1))+1.0);
    console.log(grade.getCurrent());
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
		
		grade.setCurrent(grade.getCurrent()-1);
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
    // $scope.currentGrade=grade;
    // console.log($scope.currentGrade.current);
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
		grade.setCurrent(grade.getCurrent()-1);
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
    console.log(grade.getCurrent());
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
		 grade.setCurrent(grade.getCurrent()-1);
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
    console.log(grade.getCurrent());
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
		 grade.setCurrent(grade.getCurrent()-1);
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
    console.log(grade.getCurrent());
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
	            if(grade.getCurrent()<5){
	         		$state.go('sorryYouLoose');
	            }
	            else if(grade.getCurrent()==5){
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
		 grade.setCurrent(grade.getCurrent()-1);
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

.controller('youWinACardCtrl', ['$scope', '$stateParams', '$state', 'TypeOfQuestion', 'Auth', '$firebaseArray','sharedQuestionType', 'safeApply',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, TypeOfQuestion, Auth, $firebaseArray,sharedQuestionType,safeApply) {
    var questionType=sharedQuestionType.getProperty();
    var groupOfCard=TypeOfQuestion.typeCard[questionType];
    console.log("QuestionType:"+questionType);
    console.log("CardType:"+groupOfCard);
    var cards= firebase.database().ref('/'+groupOfCard+'/');
    // var easyQuestions= firebase.database().ref('/w2eq/');
    $scope.initialId=Math.floor((Math.random()*(Object.keys(cards).length-1))+1.0);
    console.log($scope.initialId);
    console.log(TypeOfQuestion.currentType);
    // console.log($scope.initialId);
	var question= firebase.database().ref('/'+groupOfCard+'/'+$scope.initialId.toString());
	question.on('value', function(snapshot) {
		safeApply($scope, function() {
		    $scope.urlOfCard=snapshot.val().url;
	  		console.log($scope.urlOfCard);
		});
	});
	console.log($scope.urlOfCard);
    var userId=firebase.auth().currentUser.uid;
    $scope.description=["Fire","Water","Wind","Lightning","Light","Life","Power","Earth","Gold","Stone"]
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
	console.log(grade.getCurrent());
	$scope.finalGrade=grade.getCurrent();
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
 