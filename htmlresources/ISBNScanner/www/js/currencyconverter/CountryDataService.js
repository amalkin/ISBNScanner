var scanapp = angular.module('ngCountryDataService', ['ionic'])

scanapp.factory('CountryDataService', function($q, $timeout, $http) {

    var countries = [];

    $http.get("js/countrydata.json").success(function(data) {
        countries = data;
        console.log("in side http" + countries)

        countries = countries.sort(function(a, b) {

            var countryA = a.name.toLowerCase();
            var countryB = b.name.toLowerCase();

            if (countryA > countryB) return 1;
            if (countryA < countryB) return -1;
            return 0;
        });

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