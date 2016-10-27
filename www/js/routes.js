angular.module('app.routes', ['firebase','ionic','app.services','app.controllers',])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider      

    .state('tabsController.homePage', {
    url: '/homePage',
    views: {
      'tab1': {
        templateUrl: 'templates/homePage.html',
        controller: 'homePageCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }

      }

    }
  })

  .state('tabsController.explore', {
    url: '/explorePage',
    views: {
      'tab2': {
        templateUrl: 'templates/explore.html',
        controller: 'exploreCtrl',
        resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": ["Auth", function(Auth) {
          // $requireSignIn returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
          }]
        }
      }
    }
  })

  .state('tabsController.gachaPage', {
    url: '/gachaPage',
    views: {
      'tab3': {
        templateUrl: 'templates/gachaPage.html',
        controller: 'gachaPageCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true,
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
        "currentAuth": ["Auth", function(Auth) {
          // $requireSignIn returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireSignIn();
        }]
     }
  })

  .state('login', {
    url: '/login',
    cache:false,
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/page6',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('tabsController.collection', {
    url: '/collectionPage',
    views: {
      'tab5': {
        templateUrl: 'templates/collection.html',
        controller: 'collectionCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      }
    }
  })

  .state('tabsController.setting', {
    url: '/settingPage',
    views: {
      'tab6': {
        templateUrl: 'templates/setting.html',
        controller: 'settingCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      }
    }
  })

  .state('tabsController.question1', {
    url: '/fire/question1',
    views: {
      'tab2': {
        templateUrl: 'templates/question1.html',
        controller: 'question1Ctrl'
      }
    }
  })

  .state('tabsController.question2', {
    url: '/fire/question2',
    views: {
      'tab2': {
        templateUrl: 'templates/question2.html',
        controller: 'question2Ctrl'
      }
    }
  })

  .state('tabsController.question3', {
    url: '/fire/question3',
    views: {
      'tab2': {
        templateUrl: 'templates/question3.html',
        controller: 'question3Ctrl'
      }
    }
  })

    .state('tabsController.question4', {
    url: '/fire/question4',
    views: {
      'tab2': {
        templateUrl: 'templates/question4.html',
        controller: 'question4Ctrl'
      }
    }
  })

    .state('tabsController.question5', {
    url: '/fire/question5',
    views: {
      'tab2': {
        templateUrl: 'templates/question5.html',
        controller: 'question5Ctrl'
      }
    }
  })

  .state('youWinACard', {
    url: '/fire/cardAwardpage',
    templateUrl: 'templates/youWinACard.html',
    controller: 'youWinACardCtrl'
  })

  .state('sorryYouLoose', {
    url: '/fireLosePage',
    templateUrl: 'templates/sorryYouLoose.html',
    controller: 'sorryYouLooseCtrl'
  })
  .state('intro', {
    url: '/intro',
    templateUrl: 'templates/intro.html',
    controller: 'introCtrl'
  })

$urlRouterProvider.otherwise('/intro')
// $urlRouterProvider.otherwise('/login');

  

});