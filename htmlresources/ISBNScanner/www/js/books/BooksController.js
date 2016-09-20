
scanapp.factory("BookItems", function($firebaseArray, PreferencesService) {
    var preferences = PreferencesService.getPreferences();
    var firebase = preferences["firebase"];
    
    var itemsRef = new Firebase(firebase);
    return $firebaseArray(itemsRef);
})

scanapp.controller('BooksCtrl', function($scope, $http, BookItems, PreferencesService) {

    console.log("[controllers.BooksCtrl] START");
    
    if (window.ADB) {
        console.log("[controllers.BooksCtrl] Has ADB")
        // Track using trackingTitle, falling back to path if unavailable
        ADB.trackState("Books" || "/home/books/", {});
    }
    
    var preferences = PreferencesService.getPreferences();
    var firebase = preferences["firebase"];
    
    $scope.items = BookItems;
    
    $scope.removeBook = function(item) {
        
        console.log("[controllers.BooksCtrl] removeBook "+item.isbn);
        
        var bookRef = new Firebase(firebase+item.isbn);
        
        var onComplete = function(error) {
            if (error) {
                console.log('Synchronization failed');
            } else {
                console.log('Synchronization succeeded');
            }
        };
        bookRef.remove(onComplete);
        
    };
    
})