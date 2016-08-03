var scanapp = angular.module('cqWeatherCtrl', [])

scanapp.controller('WeatherCtrl', function($scope, $http, nfcService, $timeout, $cordovaGeolocation, $firebase, Auth) { 
    
    console.log("[controllers.WeatherCtrl] START");
    
    Auth.$onAuth(function(authData) {
        if (authData === null) {
            console.log("Not logged in yet");
        } else {
            console.log("Logged in as", authData.uid);
        }
        $scope.authData = authData; // This will display the user's name in our view
    });
    
})