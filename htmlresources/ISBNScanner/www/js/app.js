// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var scanapp = angular.module('starter', [
    'ionic', 
    'baseControllers', 
    'cqHomeCtrl', 
    'cqMapCtrl', 
    'formly', 
    'cqAccountCtrl', 
    'ngAdobeCampaign', 
    'starter.services', 
    'firebase', 
    'ionic.utils',
    'ngCordova', 
    'ngISBNService',
    'cqCurrencyConverterCtrl',
    'ngCountryDataService'
])

.constant('FirebaseUrl', 'https://am-books.firebaseio.com/')

.service('rootRef', ['FirebaseUrl', Firebase])

.run(ApplicationRun)

.config(ApplicationConfig);

function ApplicationRun($ionicPlatform, $rootScope, $state) {
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

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        if (error === 'AUTH_REQUIRED') {
            $state.go('login');
        }
    });

}
ApplicationRun.$inject = ['$ionicPlatform', '$rootScope', '$state'];

function AuthDataResolver(Auth) {
    return Auth.$requireAuth();
}
AuthDataResolver.$inject = ['Auth'];

function ApplicationConfig($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
    
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
    
    

    // State to represent Login View
    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'AppCtrl',
        resolve: {
            // controller will not be loaded until $waitForAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
                function (Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
            }]
        }
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html',
                controller: 'HomeCtrl'
            }
        }
    })

    .state('tab.scan', {
        url: '/scan',
        views: {
            'tab-scan': {
                templateUrl: 'templates/tab-scan.html',
                controller: 'ISBNScanCtrl'
            }
        }
    })

    .state('tab.books', {
        url: '/books',
        views: {
            'tab-books': {
                templateUrl: 'templates/tab-books.html',
                controller: 'BooksCtrl'
            }
        }
    })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    })

    .state('tab.search', {
        url: '/search',
        views: {
            'tab-map': {
                templateUrl: 'templates/tab-search.html',
                controller: 'SearchCtrl'
            }
        }
    })
    
    
    

    .state('app.home', {
        url: '/home',
        views: {
            'tab-map': {
                templateUrl: 'templates/tab-home.html',
                controller: 'HomeCtrl'
            }
        }
    })
    
    .state('app.map', {
        url: '/map',
        views: {
            'menuContent': {
                templateUrl: 'templates/tab-map.html',
                controller: 'MapCtrl'
            }
        }
    })
    
    .state('app.preferences', {
        url: '/preferences',
        views: {
            'menuContent': {
                templateUrl: 'templates/tab-preferences.html',
                controller: 'PreferencesCtrl'
            }
        }
    })
    
    .state('app.currencyconverter', {
        url: '/currencyconverter',
        views: {
            'menuContent': {
                templateUrl: 'templates/tab-currencyconverter.html',
                controller: 'CurrencyConverterCtrl'
            }
        }
    })
    
    
    
    
    

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-scan.html',
                controller: 'ScanCtrl'
            }
        }
    })


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');
}


