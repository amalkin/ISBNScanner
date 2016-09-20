angular.module('ngISBNService', [])

.factory('ISBNScanService', function($localstorage, $http, $q, PreferencesService) {
    
    function _googleBookImage(isbnValue) {
        var deferred = $q.defer();
        
        try {
            var preferences = PreferencesService.getPreferences();
            var googleISBNUrl = preferences["googleISBNUrl"];
            var finalGoogleSearchURL = googleISBNUrl+isbnValue;

            $http.get(finalGoogleSearchURL)
                .success(
                    function(response){

                        deferred.resolve(response.items[0].volumeInfo.imageLinks.smallThumbnail);

                    }
                );
        
        } catch (err) {
            console.error('[ISBNScanService._getGoogleBook] There was an error on this page ' + err.message);
            deferred.reject(err);
        }

        return deferred.promise;
        
    }
    
    function _isbnSearch(isbnValue) {
        var deferred = $q.defer();
        
        console.log("[ISBNScanService._search]: "+isbnValue);
        
        try {
            console.log('[ISBNScanService._search] Starting...');
            
            var preferences = PreferencesService.getPreferences();
            var isbnAccessKey = preferences["isbnAccessKey"];
            var isbnURL = preferences["isbnURLJSON"];
            var googleISBNUrl = preferences["googleISBNUrl"];
            
            var finalISBNSearchURL = isbnURL.replace("+isbnAccessKey+",isbnAccessKey)+isbnValue;
            //console.log("finalISBNSearchURL: "+finalISBNSearchURL);
            
            $http.get(finalISBNSearchURL)
                .success(
                    function(response){
                        
                        deferred.resolve(response);
                        
                    }
                );
            
        } catch (err) {
            console.error('[ISBNScanService._search] There was an error on this page ' + err.message);
            deferred.reject(err);
        }

        return deferred.promise;
        
    }
    
    return {
        isbnSearch: function(isbnValue) {
            return _isbnSearch(isbnValue);
        },
        googleBookImage: function(isbnValue) {
            return _googleBookImage(isbnValue);
        }
    };
    
})

scanapp.factory('PreferencesService', function() {

    var preferences = {
        firebase: "https://am-books.firebaseio.com/",
        googleISBNUrl: "https://www.googleapis.com/books/v1/volumes?q=isbn:",
        isbnAccessKey: "3XEHXAJR",
        isbnURL: "http://isbndb.com/api/books.xml?access_key=+isbnAccessKey+&index1=isbn&results=details&value1=",
        isbnURLJSON: "http://isbndb.com/api/v2/json/+isbnAccessKey+/books?q="
    };

    function _getPreferences() {
      return preferences;
    }

    function _setPreferences(newModel) {
      preferences = newModel;
    }

    return {
         getPreferences: function() {
             return _getPreferences();
         },

        setPreferences: function(newModel){
            _setPreferences(newModel);
        }
    };
});