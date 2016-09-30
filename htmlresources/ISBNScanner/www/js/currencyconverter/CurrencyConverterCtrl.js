var scanapp = angular.module('cqCurrencyConverterCtrl', [])

scanapp.controller('CurrencyConverterCtrl', function($scope, $http, $timeout, $cordovaGeolocation, $firebase, Auth, CountryDataService) { 
    
    console.log("[controllers.CurrencyConverterCtrl] START");
    
    $scope.showAmountFrom = false;
    $scope.showAmountTo = false;
    
    $scope.data = { "countries" : [], "search" : '' };
    
    var demo = function(data) {
        fx.rates = data.rates
        var rate = fx(1).from("GBP").to("USD")
        console.log("£1 = $" + rate.toFixed(4))
    }
    
    $.getJSON("http://api.fixer.io/latest", demo)
    
    $scope.searchA = function() {
        $("#countryFrom").show();
        CountryDataService.searchCountry($scope.data.searchA).then(
            function(matches) {
                $scope.data.countriesA = matches;
            }
        )
    }
    $scope.selectedCountryFrom = function(countryNameA) {
        // alert("countryName"+countryName.name);
        $scope.data.searchA = countryNameA.name;
        $scope.isoA = countryNameA.iso;
        console.log("ISO country A"+$scope.isoA);
        $("#countryFrom").hide();
        $("#country_from").removeClass();
        $("#country_fromFlag").addClass('flag flag-'+countryNameA.flag+'');
        $("#country_fromCurrency").html('<p style="padding-top:10px;padding-right:10px;">'+countryNameA.flag+'</p>');
        $("#country_from").hide();
        $scope.showAmountFrom = true;
    }

    $scope.searchB = function() {
        $("#countryTo").show();
        CountryDataService.searchCountry($scope.data.searchB).then(
            function(matches) {
                $scope.data.countriesB = matches;
            }
        )
    }
    $scope.selectedCountryTo = function(countryNameB) {
        // alert("countryName"+countryName.name);
        $scope.data.searchB = countryNameB.name;
        $scope.isoB = countryNameB.iso;
        console.log("ISO country B"+$scope.isoB);
        $("#countryTo").hide();
        $("#country_to").removeClass();
        $("#country_toFlag").addClass('flag flag-'+countryNameB.flag+'');
        $("#country_to").hide();
        $scope.showAmountTo = true;
    }
    
    
})