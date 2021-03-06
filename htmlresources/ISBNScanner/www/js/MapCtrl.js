var scanapp = angular.module('cqMapCtrl', [])

scanapp.controller('MapCtrl', function($scope, $http, nfcService, $timeout, $cordovaGeolocation, $firebase, Auth) { 
    
    console.log("[controllers.MapCtrl] START");
    
    Auth.$onAuth(function(authData) {
        if (authData === null) {
            console.log("Not logged in yet");
        } else {
            console.log("Logged in as", authData.uid);
        }
        $scope.authData = authData; // This will display the user's name in our view
    });
    
})