
scanapp.factory("TidesConfig", function($firebaseArray, PreferencesService) {
    var preferences = PreferencesService.getPreferences();

    var WorldTidesPreferences = {
        key: "ca94e228-e1bb-4edf-abd9-af779796d88c",
        searchUrl: "https://www.worldtides.info/api?", //lat=35&lon=139&appid=b1b15e88fa797225412429c1c50c122a1
        lat: "50.8499",
        long: "0.4662"
    }

    function _getWorldTidesPreferences(){
        return WorldTidesPreferences;
    }

    return {
        getWorldTidesPreferences: function(){
            return _getWorldTidesPreferences();
        }
    }
})

scanapp.controller('TidesCtrl', function($scope, $http, $timeout, $cordovaGeolocation, $firebase, TidesConfig) { 
    
    console.log("[controllers.TidesCtrl] START");

    onLoad();
    
    function onLoad(){
        console.log("[controllers.TidesCtrl] onLoad");
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    function onDeviceReady(){
        console.log("[controllers.TidesCtrl] onDeviceReady");

        if (window.ADB) {
            console.log("[controllers.TidesCtrl] Has ADB")
            // Track using trackingTitle, falling back to path if unavailable
            ADB.trackState("Tides" || "/app/tab/tides", {});
        }
        
        var preferences = PreferencesService.getPreferences();
        var openWorldTidesPreferences = TidesConfig.getWorldTidesPreferences();
        console.log("[controllers.TidesCtrl] openWorldTidesPreferences: "+openWorldTidesPreferences.key)

        $scope.tidesData = {
            icon: '',
            main: '',
            city: '',
            description: '',
            lat:'',
            lon: '',
            temp: ''
        };


        console.log("[controllers.TidesCtrl] loadTides, url: "+openWorldTidesPreferences.searchUrl + 'lat=' + lat + '&lon=' + lon +  '&appid=' + openWorldTidesPreferences.key);
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;

                var url = openWorldTidesPreferences.searchUrl + 'lat=' + lat + '&lon=' + lon +  '&appid=' + openWorldTidesPreferences.key;
                console.log("[controllers.TidesCtrl] url: ", url);
                $http.get(url).success(function(data) {
                    console.log("[controllers.TidesCtrl] icon: ", data.weather[0].icon);
                    //$scope.weatherData.icon = OpenWeatherConfig.imgUrl + data.weather[0].icon + '.png';
                    $scope.weatherData.main = data.weather[0].main;
                    $scope.weatherData.city = data.name;
                    $scope.weatherData.description = data.weather[0].description;
                    $scope.weatherData.lat = data.coord.lat;
                    $scope.weatherData.lon = data.coord.lon;
                    $scope.weatherData.temp = data.main.temp;
                    $scope.state = true;
                });
            }, function(err) {
        });



    }
    
    
})