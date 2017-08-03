

scanapp.controller('BleCtrl', function($scope, $http, PreferencesService, $ionicPopup, Devices, BLE) {

    console.log("[controllers.BleCtrl] START");
    
    if (window.ADB) {
        console.log("[controllers.BleCtrl] Has ADB")
        // Track using trackingTitle, falling back to path if unavailable
        ADB.trackState("Books" || "/home/ble/", {});
    }
    
    var preferences = PreferencesService.getPreferences();

    document.addEventListener('deviceready', initialize, false);

    function initialize() {

        ble.isEnabled(
            function() {
                console.log("Bluetooth is enabled");
            },
            function() {
                $ionicPopup.alert({
                title: 'WARNING!',
                template: 'Bluetooth is not enabled!'
            });
        });

    }

    // keep a reference since devices will be added
    $scope.devices = Devices.all();

    var success = function () {
        if ($scope.devices.length < 1) {
            // a better solution would be to update a status message rather than an alert
            alert("Didn't find any Bluetooth Low Energy devices.");
        }
    };

    var failure = function (error) {
        alert(error);
    };

    // pull to refresh
    $scope.onRefresh = function() {
        BLE.scan().then(
            success, failure
        ).finally(
            function() {
                $scope.$broadcast('scroll.refreshComplete');
            }
        )
    }

    // initial scan
    BLE.scan().then(success, failure);
    
    
})