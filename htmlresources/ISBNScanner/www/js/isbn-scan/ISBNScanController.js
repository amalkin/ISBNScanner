scanapp.run(function (formlyConfig) {
    formlyConfig.setType([{
        name: 'isbnscan',
        templateUrl: "isbnscan.html",
        controller: function ($scope, $rootScope, $localstorage) {

            $scope.btnClick = function () {
                console.log("[controllers.btnClick] START "+$scope.model.options.key);
                if ($rootScope.toggleIsbnScan) {
                    $rootScope.isbnScanConnect($scope.model.options.key).then(
                        function (results) {
                            $rootScope.toggleIsbnScan = !$rootScope.toggleIsbnScan;
                        },
                        function (errors) {
                            //$localstorage.setObject('insta_access_token', {});
                        }
                    );
                }else{
                    $rootScope.toggleIsbnScan = !$rootScope.toggleIsbnScan;
                    //$localstorage.setObject('insta_access_token', {});
                }
            }

            $rootScope.$watch('toggleIsbnScan', function(){
                $scope.toggleBtnLabel = $rootScope.toggleIsbnScan ? 'Searching' : 'Search';
            })
        }
    }]);
});

scanapp.controller('ISBNScanCtrl', function($scope, $rootScope, $q, PreferencesService, ISBNScanService, $http, nfcService, $timeout, $cordovaGeolocation, config, Auth, $window) {
    
    console.log("[controllers.ISBNScanCtrl] START");
    
    $scope.scanpreferences = {};
    
    $scope.scanpreferences.model = PreferencesService.getPreferences();
    
    PreferencesService.setPreferences($scope.scanpreferences.model);
    
    console.log(JSON.stringify(PreferencesService.getPreferences()));
    
    $scope.scanpreferences.options = {};
    
    $scope.scanpreferences.fields = [
        {
            key: 'isbnscan',
            type: 'isbnscan',
            templateOptions: {
                placeholder: 'Manually enter an ISBN number',
                label: "ISBNScan"
            }
        }
    ];
    
    $scope.bookdetails = {};

    $scope.scanpreferences.originalFields = angular.copy($scope.scanpreferences.fields);
    
    $rootScope.isbnScanConnect = function (isbnValue) {
        var deferred = $q.defer();
        
        console.log("isbnScanConnect START ");
        console.log("isbnScanConnect: "+isbnValue);

        var preferences = PreferencesService.getPreferences();
        var firebase = preferences["firebase"];
        
        if (isbnValue && isbnValue != null && isbnValue != "") {
            
            addISBN(isbnValue);
            
            addISBNImage(isbnValue);
            
        } else {
            alert("ISBN url is empty!!!");
            deferred.reject(false);
        }

        return deferred.promise;
    }
    
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", init, false);
    } else {
        //init();
    }
    
    function init() {
        console.log("[controllers.ScanCtrl.init] deviceready init")
        document.querySelector("#startScan").addEventListener("touchend", startScan, false);
        document.querySelector("#startNFC").addEventListener("touchend", startNFC, false);
        
        if(navigator.network.connection.type == Connection.NONE){
            console.log("[controllers.ScanCtrl.init] network NONE")
        }
        else {
            console.log("[controllers.ScanCtrl.init] network OK");
            
            startTracking();
        }
        
    }
    
    function addISBNImage(isbnValue) {
        var deferred = $q.defer();
        
        console.log("[controllers.ScanCtrl.addISBNImage] START");

        var preferences = PreferencesService.getPreferences();
        var firebase = preferences["firebase"];
        
        ISBNScanService.googleBookImage(isbnValue).then(
            function (response) {
                console.log("googleBookImage: "+response);
                
                console.log("googleBookImage: "+firebase + isbnValue);

                var FBBookUserRef = new Firebase(firebase + isbnValue);
                FBBookUserRef.update({ bookImage: response });

            },
            function (error) {
                // handle errors here
                console.error(error);
                deferred.reject(false);
            }
        );
        
    }
    
    function addISBN(isbnValue) {
        var deferred = $q.defer();
        
        console.log("[controllers.ScanCtrl.addISBN] START");

        var preferences = PreferencesService.getPreferences();
        var firebase = preferences["firebase"];
        
        ISBNScanService.isbnSearch(isbnValue).then(
            function (response) {

                for ( var i = 0; i < response.data.length; i++) {
                    var obj = response.data[i];
                    console.log(obj);

                    bookTitle = obj.title;
                    bookSummary = obj.summary;
                    bookAuthor = obj.author_data[0].name;
                    bookIsbn13 = obj.isbn13;

                    $scope.showBook = true;

                    console.log("[ISBNScanService.isbnScanConnect] "+bookTitle);
                    console.log("[ISBNScanService.isbnScanConnect] "+bookSummary);
                    console.log("[ISBNScanService.isbnScanConnect] "+bookAuthor);
                    console.log("[ISBNScanService.isbnScanConnect] isbn13: "+bookIsbn13);   

                    var bookDetails = "<h2>" + bookTitle + "</h2>" +
                    "<p>" + bookSummary + "<br />" +
                    "<strong>" + bookAuthor + "</strong></p>";
                    document.getElementById("resultsISBN").innerHTML = bookDetails;

                    var FBBookUserRef = new Firebase(firebase + isbnValue);
                    FBBookUserRef.set({ isbn: isbnValue, title: bookTitle, summary: bookSummary, author: bookAuthor, bookIsbn13: bookIsbn13 });

                }

                deferred.resolve(true);
            },
            function (error) {
                // handle errors here
                console.error(error);
                deferred.reject(false);
            }
        );
        
    }
    
    function startTracking() {
        
        console.log("[controllers.ScanCtrl.startTracking] network OK");
        
        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };
        
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var lgt = position.coords.longitude;
            
            console.log("[controllers.ScanCtrl.startTracking] lat/lgt: "+lat+" / "+lgt);
            
        });
        
    }
    
    function startScan() {
        
        console.log("[controllers.ScanCtrl] startScan")
        
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                console.log("[controllers.ScanCtrl.startScan] scan")
                
                resultISBN = result.text;
                console.log("[controllers.ScanCtrl] resultISBN: "+resultISBN)
                
                addISBN(resultISBN);
                
            },
            
            function (error) {
                alert("Scanning failed: " + error);
            },
            {
                "preferFrontCamera" : false, // iOS and Android
                "showFlipCameraButton" : true, // iOS and Android
                "prompt" : "Place a barcode inside the scan area", // supported on Android only
                //"formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
            }
        );
        
        
    }
    
})