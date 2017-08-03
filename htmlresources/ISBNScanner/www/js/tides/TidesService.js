var scanapp = angular.module('ngTidesService', ['ionic'])

scanapp.factory('TidesService', function($q, $timeout, $http) {

    console.log("[controllers.TidesService] START");

    var tides = [];

    $http.get("data/tidesmock.json").success(function(data) {
        tides = data;
        console.log("in side http: " + tides)

        

    });

    var searchCountry = function(searchFilter) {

        console.log('Searching countries for ' + searchFilter);

        var deferred = $q.defer();

        var matches = countries.filter(function(country) {
            if (country.name.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1) return true;
        })

        $timeout(function() {

            deferred.resolve(matches);

        }, 100);

        return deferred.promise;

    };

    return {

        searchCountry: searchCountry

    }
});