

scanapp.controller('BLEDetailCtrl', function($scope, $stateParams, $http, PreferencesService, $ionicPopup, Devices, BLE) {

    console.log("[controllers.BLEDetailCtrl] START");
    
    if (window.ADB) {
        console.log("[controllers.BLEDetailCtrl] Has ADB")
        // Track using trackingTitle, falling back to path if unavailable
        ADB.trackState("Books" || "/home/bledetail/$stateParams.deviceId", {});
    }
    
    var preferences = PreferencesService.getPreferences();

    document.addEventListener('deviceready', initialize, false);

    function initialize() {

        BLE.connect($stateParams.deviceId).then(
            function(peripheral) {
                $scope.device = peripheral;
            }
        );

    }

    function success() {

        console.log("[controllers.success] SUCCESS "+$stateParams.deviceId);

    }

    function failure() {

        console.log("[controllers.failure] FAIL "+$stateParams.deviceId);

    }

    writeToDevice = function (dest,val){
        console.log("[controllers.writeToDevice] START "+$stateParams.deviceId);
        if ($scope.device == null) return;

        var data = new Uint8Array(3);
        data[0] = 0xFF; // red
        data[1] = 0x00; // green
        data[2] = 0xFF; // blue
        BLE.write($stateParams.deviceId, "ccc0", "ccc1", data.buffer, success, failure);

        //BLE.addQueue(BLE.stringToArrayBuffer(dest+val));
    };

    $scope.send = function(){
        writeToDevice("1","1");
    }

    $scope.unSend = function(){
        writeToDevice("1","0");
    }

    
})