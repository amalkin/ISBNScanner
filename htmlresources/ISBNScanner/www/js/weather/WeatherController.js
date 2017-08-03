
scanapp.factory("OpenWeatherConfig", function($firebaseArray, PreferencesService) {
    var preferences = PreferencesService.getPreferences();
    var firebase = preferences["firebase"];
    
    var itemsRef = new Firebase(firebase);

    var OpenWeatherPreferences = {
        key: "2c8d151f008f32f5e7065c2457329ec0",
        searchUrl: "http://api.openweathermap.org/data/2.5/weather?", //lat=35&lon=139&appid=b1b15e88fa797225412429c1c50c122a1
        units: ""
    }

    function _getOpenWeatherPreferences(){
        return OpenWeatherPreferences;
    }

    return {
        getOpenWeatherPreferences: function(){
            return _getOpenWeatherPreferences();
        }
    }
})

scanapp.controller('WeatherCtrl', function($scope, $cordovaGeolocation, $http, PreferencesService, OpenWeatherConfig) {

    console.log("[controllers.WeatherCtrl] START");
    
    if (window.ADB) {
        console.log("[controllers.WeatherCtrl] Has ADB")
        // Track using trackingTitle, falling back to path if unavailable
        ADB.trackState("Weather" || "/app/tab/weather", {});
    }
    
    var preferences = PreferencesService.getPreferences();
    var openWeatherPreferences = OpenWeatherConfig.getOpenWeatherPreferences();
    console.log("[controllers.WeatherCtrl] openWeatherPreferences: "+openWeatherPreferences.key)

    $scope.weatherData = {
        icon: '',
        main: '',
        city: '',
        description: '',
        lat:'',
        lon: '',
        temp: ''
    };
    
    $scope.loadWeather = function() {
        console.log("[controllers.WeatherCtrl] loadWeather");
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;

                var url = openWeatherPreferences.searchUrl + 'lat=' + lat + '&lon=' + lon +  '&appid=' + openWeatherPreferences.key;
                console.log("[controllers.WeatherCtrl] url: ", url);
                $http.get(url).success(function(data) {
                    console.log("[controllers.WeatherCtrl] icon: ", data.weather[0].icon);
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
    };
    
})