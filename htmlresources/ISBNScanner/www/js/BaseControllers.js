var scanapp = angular.module('baseControllers', ['firebase'])

scanapp.constant('config', {
    appName: 'ISBN Scanner',
    appVersion: 2.0,
    firebaseURL: 'https://am-books.firebaseio.com/',
    googleISBNUrl: 'https://www.googleapis.com/books/v1/volumes?q=isbn:'
})

scanapp.factory('nfcService', function ($rootScope, $ionicPlatform) {

    var tag = {};

    return {
        tag: tag,

        clearTag: function () {
            angular.copy({}, this.tag);
        }
    };
})

scanapp.factory("ItemsOLD", function($firebaseArray) {
    var itemsRef = new Firebase("https://am-books.firebaseio.com/");
    return $firebaseArray(itemsRef);
})

scanapp.controller('AppCtrl', function($scope, $state, $http, nfcService, $timeout, $cordovaGeolocation, config, Auth) {

    console.log("[controllers.AppCtrl] START");
    
    $scope.navTitle='<img class="title-image" src="img/wave01.jpg" />';
    
    var mailgunUrl = "alastairmalkin.net";
    var mailgunApiKey = window.btoa("api:key-359464dcffcf0d37fd1e8fcd0a776ccb")
 
    $scope.sendEmail = function() {
        $http(
            {
                "method": "POST",
                "url": "https://api.mailgun.net/v3/" + mailgunUrl + "/messages",
                "headers": {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + mailgunApiKey
                },
                data: "from=" + "test@example.com" + "&to=alastair.malkin@gmail.com&subject=Hey&text=Some text"
            }
        ).then(function(success) {
            console.log("SUCCESS " + JSON.stringify(success)); 
        }, function(error) {
            console.log("ERROR " + JSON.stringify(error));
        });
    };
    
    $scope.isLoggedIn = false;
    
    $scope.loginFB = function (user) {
        
        console.log("[controllers.AppCtrl.loginFB] START");

        Auth.$authWithOAuthPopup('facebook')
        
        .then(function(authData) {
            console.log("[controllers.AppCtrl.loginFB] authData "+JSON.stringify(authData));
            console.log("[controllers.AppCtrl.loginFB] name "+authData[authData.provider].displayName);
            
            $scope.isLoggedIn = true;
            
            $state.go('tab.scan');
        });
        
    };
    
    $scope.logoutFB = function () {
        
        console.log("[controllers.AppCtrl.logoutFB] START");
        
        Auth.$unauth();
        
        $scope.isLoggedIn = false;
        $state.go('tab.scan');
    };
    
})

scanapp.controller('ScanCtrl', function($scope, $http, nfcService, $timeout, $cordovaGeolocation, config, Auth, $window) { 

    console.log("[controllers.ScanCtrl] START");
    
    var firebaseURL = "https://am-books.firebaseio.com/"
    var googleISBNUrl = "https://www.googleapis.com/books/v1/volumes?q=isbn:"
    
    var resultISBN;
    var resultDiv;
    var resultISBNDiv;
    
    $scope.doRefresh = function() {
        
        console.log("[controllers.ScanCtrl] doRefresh");
        
        Auth.$unauth();
        
        Auth.$onAuth(function(authData) {
            if (authData === null) {
                console.log("Not logged in yet");
            } else {
                console.log("Logged in as", authData.uid);
            }
            $scope.authData = authData; // This will display the user's name in our view
        });

        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
        
        $window.location.reload(true)
        
    };
    
    var app = {
        sampleDataIndex: 0,
        initialize: function () {
            this.bind();
        },
        bind: function () {
            document.addEventListener('deviceready', app.deviceready, false);
        },
        deviceready: function () {
            document.getElementById('checkbox').addEventListener('change', app.toggleCheckbox, false);
            sample.addEventListener('click', app.showSampleData, false);
        }
    }
    
    if (window.ADB) {
        console.log("[controllers.ScanCtrl] Has ADB")
        // Track using trackingTitle, falling back to path if unavailable
        ADB.trackState("Scan" || "/home/scan/", {});
    }
    
    
    
    
    $scope.settings = {
        
    };
    
    document.querySelector("#saveFirebaseURL").addEventListener("touchend", saveFirebaseURL, false);
    
    function saveFirebaseURL() {
        
        console.log("[controllers.AccountCtrl] saveFirebaseURL")
        
    }
    
    $scope.saveFirebaseURL = function(settings) {
        console.log("[controllers.AccountCtrl] saveFirebaseURL: "+settings.firebaseURL)
        console.log("[controllers.AccountCtrl] saveFirebaseURL: "+config.firebaseURL)
    }
    
    
    
    
    $scope.search = {
        
    };
    
    document.querySelector("#searchISBN").addEventListener("touchend", searchISBN, false);
    
    function searchISBN() {
        
        console.log("[controllers.ScanCtrl] searchISBN")
        
    }
    
    $scope.searchISBN = function(search) {
        console.log("[controllers.ScanCtrl] searchISBN: "+search.searchISBN)
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
        resultDiv = document.querySelector("#results");
        console.log("[controllers.ScanCtrl.init] resultISBN: "+resultISBN);
        
        if(navigator.network.connection.type == Connection.NONE){
            console.log("[controllers.ScanCtrl.init] network NONE")
        }
        else {
            console.log("[controllers.ScanCtrl.init] network OK");
            
            startTracking();
        }
        
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
    
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
    }
    
    function startNFC() {
        
        console.log("[controllers.ScanCtrl] startNFC")
        
        nfc.addNdefListener (
            function (nfcEvent) {
                var tag = nfcEvent.tag,
                    ndefMessageJSON = tag.ndefMessage,
                    ndefMessage;

                // dump the raw json of the message
                // note: real code will need to decode
                // the payload from each record
                console.log("[controllers.ScanCtrl.addNdefListener] ndefMessageJSON: "+JSON.stringify(ndefMessageJSON));
                
                ndefMessage = nfc.bytesToString(ndefMessageJSON[0].payload).substring(3);
                console.log("[controllers.ScanCtrl.addNdefListener] ndefMessage: "+ndefMessage);
                
                if (ndefMessage.includes("Orange")) {
                    console.log("[controllers.ScanCtrl.addNdefListener] ndefMessage Orange: "+ndefMessage);
                }
                
                
                // assuming the first record in the message has
                // a payload that can be converted to a string.
                alert(nfc.bytesToString(ndefMessageJSON[0].payload).substring(3));
            },
            function () { // success callback
                 alert("Waiting for NDEF tag");
            },
            function (error) { // error callback
                 console.log("Error adding NDEF listener " + JSON.stringify(error));
            }
        );
        
        nfc.addTagDiscoveredListener(writeNFCTag, successWriteNFC, failWriteNFC);
        
    }
    
    function writeTag(writeNFCTag) {
        
        console.log("[controllers.ScanCtrl] successWriteNFC");
        
        var message = "I'm in Germany";
        
        nfc.write(
            message, 
            function () {
                console.log("[controllers.ScanCtrl] successWriteNFC");
            }, 
            function (reason) {
                
            }
        );

        
    }
    
    function successWriteNFC() {
        
        console.log("[controllers.ScanCtrl] successWriteNFC");
        
        
    }
    
    function failWriteNFC() {
        
        console.log("[controllers.ScanCtrl] failWriteNFC");
        
        
    }
    
    function writeTag(nfcEvent) {
        
        console.log("[controllers.ScanCtrl] writeTag");
        
        var mimeType = "Mime", //document.forms[0].elements["mimeType"].value,
            payload = "Some text", //document.forms[0].elements["payload"].value,
            record = ndef.mimeMediaRecord(mimeType, nfc.stringToBytes(payload));
        
    }
    
    function startNFCReader() {
        
        console.log("[controllers.ScanCtrl] startNFC");
        
        function win() {
            console.log("Listening for NDEF tags");
        }

        function fail() {
            alert('Failed to register NFC Listener');
        }

        nfc.addTagDiscoveredListener(writeTag, win, fail);
        
    }
    
    $scope.showBook = false;
    
    function startScan() {
        
        console.log("[controllers.ScanCtrl] startScan")

        cordova.plugins.barcodeScanner.scan(
            function (result) {
                console.log("[controllers.ScanCtrl.startScan] scan")
                var s = "ISBN: " + result.text + "<br/>";
                resultDiv.innerHTML = s;
                resultISBN = result.text;
                console.log("[controllers.ScanCtrl] resultISBN: "+resultISBN)
                console.log("[controllers.ScanCtrl] url: "+googleISBNUrl+resultISBN)
                
                $scope.showBook = true;
                
                $http({method: 'GET', url: googleISBNUrl+resultISBN}).success(function(data) {
                    $scope.bookdetails = [];
                    console.log("[controllers.ScanCtrl.startScan] length: "+data.items.length)
                    for ( var i = 0; i < data.items.length; i++) {
                        var obj = data.items[i];
                        console.log(obj);

                        var bookTitle, bookSubTitle, bookAuthor, bookImage

                        angular.forEach(obj.volumeInfo, function(value, key) {
                            console.log("[controllers.ScanCtrl.startScan] volumeInfo forEach: "+key+" - "+value)

                            if (key == "title") { 
                                bookTitle = value
                                console.log("[controllers.ScanCtrl.startScan] volumeInfo bookTitle: "+bookTitle)
                            }
                            if (key == "subtitle") { 
                                bookSubTitle = value
                                console.log("[controllers.ScanCtrl.startScan] volumeInfo bookSubTitle: "+bookSubTitle)
                            }
                            if (key == "authors") { 
                                bookAuthor = value
                                console.log("[controllers.ScanCtrl.startScan] volumeInfo bookSubTitle: "+bookAuthor)
                            }

                        });

                        angular.forEach(obj.volumeInfo.imageLinks, function(value, key) {
                            console.log("[controllers.ScanCtrl.startScan] volumeInfo.imageLinks forEach: "+key+" - "+value)
                            if (key == "smallThumbnail") { 
                                bookImage = value
                                console.log("[controllers.ScanCtrl.startScan] volumeInfo bookImage: "+bookImage)
                            }
                        });

                        var bookImageDetails = bookImage;
                        document.getElementById("resultsISBNImage").src = bookImageDetails;

                        var bookDetails = "<h2>" + bookTitle + "</h2>" +
                        "<p>" + bookSubTitle + "<br />" +
                        "<strong>" + bookAuthor + "</strong></p>";
                        document.getElementById("resultsISBN").innerHTML = bookDetails;                        
                        
                        // Get a reference to the presence data in Firebase.
                        var userListRef = new Firebase(firebaseURL);
                        console.log("Firebase: " + userListRef);

                        // Generate a reference to a new location for my user with push.
                        //var myUserRef = userListRef.push();
                        var myUserRef = new Firebase(firebaseURL + resultISBN);

                        myUserRef.once("value", function(snapshot) {
                            if (snapshot.exists()) {
                                console.log("[controllers.ScanCtrl] Firebase user exists: " );
                            }
                        });
                        
                        // Get a reference to my own presence status.
                        var connectedRef = new Firebase(firebaseURL + ".info/connected");
                        
                        myUserRef.set({ isbn: resultISBN, title: bookTitle, author: bookAuthor, thumbnail: bookImage });
                        
                        

                    }
                    
                    $scope.isVisible = function(name){
                        return true;// return false to hide this artist's albums
                    };
                });
                
                $scope.isVisible = function(name){
                    return true;// return false to hide this artist's albums
                };
                
            },
            function (error) {
                alert("Scanning failed: " + error);
            },
            {
                "preferFrontCamera" : true, // iOS and Android
                "showFlipCameraButton" : true, // iOS and Android
                "prompt" : "Place a barcode inside the scan area", // supported on Android only
                //"formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
            }
        );

    }
    
    function testInit() {
    
        $http({method: 'GET', url: '../lib/googlebook.json'}).success(function(data) {
            $scope.bookdetails = [];
            console.log("[controllers.myFunction] length: "+data.items.length)
            for ( var i = 0; i < data.items.length; i++) {
                var obj = data.items[i];
                console.log(obj);

                var bookTitle, bookSubTitle, bookAuthor, bookImage

                angular.forEach(obj.volumeInfo, function(value, key) {
                    console.log("[controllers.myFunction] volumeInfo forEach: "+key+" - "+value)

                    if (key == "title") { 
                        bookTitle = value
                        console.log("[controllers.myFunction] volumeInfo bookTitle: "+bookTitle)
                    }
                    if (key == "subtitle") { 
                        bookSubTitle = value
                        console.log("[controllers.myFunction] volumeInfo bookSubTitle: "+bookSubTitle)
                    }
                    if (key == "authors") { 
                        bookAuthor = value
                        console.log("[controllers.myFunction] volumeInfo bookSubTitle: "+bookAuthor)
                    }

                });

                angular.forEach(obj.volumeInfo.imageLinks, function(value, key) {
                    console.log("[controllers.myFunction] volumeInfo.imageLinks forEach: "+key+" - "+value)
                    if (key == "smallThumbnail") { 
                        bookImage = value
                        console.log("[controllers.myFunction] volumeInfo bookImage: "+bookImage)
                    }
                });

                var bookImageDetails = "<img src='"+bookImage+"'>";
                document.getElementById("resultsISBNImage").innerHTML = bookImageDetails;

                var bookDetails = "<h2>" + bookTitle + "</h2>" +
                "<p>" + bookSubTitle + "<br /><strong>" + bookAuthor + "</strong></p>";
                document.getElementById("resultsISBN").innerHTML = bookDetails;

                var bookKey, bookValue
                for ( var key in obj) {
                    bookKey = key;
                    bookValue = obj[key].toString();
                    console.log("key: "+bookKey);
                    console.log("value: "+bookValue);
                }
            }
            angular.forEach(data.items, function(value, key) {
                console.log("[controllers.myFunction] forEach: "+value)
            });
            $scope.isVisible = function(name){
                return true;// return false to hide this artist's albums
            };
        });
        
    }
    
})

scanapp.controller('BooksCtrlOLD', function($scope, $http, Items) {

    console.log("[controllers.BooksCtrl] START")
    
    if (window.ADB) {
        console.log("[controllers.BooksCtrl] Has ADB")
        // Track using trackingTitle, falling back to path if unavailable
        ADB.trackState("Books" || "/home/books/", {});
    }
    
    $scope.items = Items;
    
    
    
    $scope.removeBook = function(item) {
        
        console.log("[controllers.BooksCtrl] removeBook "+item.isbn);
        
        var bookRef = new Firebase('https://am-books.firebaseio.com/9780099272779');
        
        var onComplete = function(error) {
            if (error) {
                console.log('Synchronization failed');
            } else {
                console.log('Synchronization succeeded');
            }
        };
        bookRef.remove(onComplete);
        
    };
    
    //$scope.addItem = function() {
    //    $scope.items.$add({
    //        "isbn": book.isbn,
    //        "title": book.title
    //    });
    //};
    
    //var bookListRef = new Firebase("https://am-books.firebaseio.com/");
    
    
    //bookListRef.on('child_added', function(snapshot) {
        //var book = snapshot.val();
        //$scope.items.$add({
        //    "isbn": book.isbn,
        //    "title": book.title
        //});
        //addBook(book.isbn, book.title);
    //});
    
    function addBook(isbn, title) {
        console.log("Adding book:", isbn, title);
        var bookRow = '<ion-item class="item-remove-animate item-avatar item-icon-right" type="item-text-wrap" href="#">'+
        '<img ng-src="{{chat.face}}">' +
        '<h2>'+isbn+'</h2>' +
        '<p>'+title+'</p>';
        var listBooksDiv = document.getElementById("listBooks");
        var newcontent = document.createElement('div');
        newcontent.innerHTML = bookRow;
        
        while (newcontent.firstChild) {
            listBooksDiv.appendChild(newcontent.firstChild);
        }
    };
    
    
    
})

scanapp.controller('ScanCtrlOLD', function($scope, $http) {
    
    var isbnAccessKey = "3XEHXAJR";
    
    var isbnURL = "http://isbndb.com/api/books.xml?access_key="+isbnAccessKey+"&index1=isbn&results=details&value1=";
    var isbnJSONURL = "http://isbndb.com/api/v2/json/"+isbnAccessKey+"/books?q="
    
    console.log("[controllers.DashCtrl] START")
    
    var resultISBN;
    var resultDiv;
    var resultISBNDiv;
    
    parser = new DOMParser();
    
    $http.get("../lib/book.xml").success(function(data) {
        
        var x, i, xmlDoc, txt;
        
        var xmlContent = data;
        console.log("[controllers.http.get] xmlContent: "+xmlContent)
        
        //xmlDoc = parser.parseFromString(xmlContent,"text/xml");
        
        //x = xmlDoc.documentElement.childNodes;
        //for (i = 0; i < x.length ;i++) {
            //txt += x[i].nodeName + ": " + x[i].childNodes[0].nodeValue + "<br>";
        //    var theNodeName = x[i].nodeName
        //    console.log("[controllers.http.get] x[i].nodeName: "+theNodeName)
        //    if (theNodeName=='BookList') {
        //        console.log("[controllers.http.get] BookList: "+theNodeName)
        //        var bookListChildren = 
        //    }
        //}
        
        $http({method: 'GET', url: '../lib/googlebook.json'}).success(function(data) {
            $scope.bookdetails = [];
            console.log("[controllers.myFunction] length: "+data.items.length)
            for ( var i = 0; i < data.items.length; i++) {
                var obj = data.items[i];
                console.log(obj);
                
                angular.forEach(obj.volumeInfo, function(value, key) {
                    console.log("[controllers.myFunction] volumeInfo forEach: "+value)
                });
                angular.forEach(obj.volumeInfo.imageLinks, function(value, key) {
                    console.log("[controllers.myFunction] volumeInfo.imageLinks forEach: "+value)
                });
                
                var bookKey, bookValue
                for ( var key in obj) {
                    bookKey = key;
                    bookValue = obj[key].toString();
                    console.log("key: "+bookKey);
                    console.log("value: "+bookValue);
                }
            }
            angular.forEach(data.items, function(value, key) {
                console.log("[controllers.myFunction] forEach: "+value)
            });
            $scope.isVisible = function(name){
                return true;// return false to hide this artist's albums
            };
        });
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                //myFunction(xhttp);
            }
        };
        xhttp.open("GET", "../lib/book.xml", true);
        xhttp.send();
        
        function myFunction(xml) {
            console.log("[controllers.myFunction] myFunction: ")
            
            var xmlDoc = xml.responseXML;
            
            var Title = xmlDoc.getElementsByTagName('Title').item(0).firstChild.data;
            var TitleLong = xmlDoc.getElementsByTagName('TitleLong').item(0).firstChild.data;
            var AuthorsText = xmlDoc.getElementsByTagName('AuthorsText').item(0).firstChild.data;
            var PublisherText = xmlDoc.getElementsByTagName('PublisherText').item(0).firstChild.data;
            
            console.log("[controllers.myFunction] Title: "+Title)
            console.log("[controllers.myFunction] TitleLong: "+TitleLong)
            console.log("[controllers.myFunction] AuthorsText: "+AuthorsText)
            console.log("[controllers.myFunction] PublisherText: "+PublisherText)
            
            var bookDetails =  "Title: " + Title + "<br/>" +
            "Authors: " + AuthorsText;
            document.getElementById("resultsISBN").innerHTML = bookDetails;
            
            
            var bookList = xmlDoc.getElementsByTagName('BookList')[0];
            
            if (bookList.hasChildNodes()) {
                for (var i=0; i < bookList.childNodes.length; ++i) {
                    console.log("[controllers.myFunction] bookList: "+bookList.childNodes[i].nodeName)
                    var bookData = bookList.childNodes[i];
                    for (var j=0; j < bookData.childNodes.length; ++j) {
                        var bookDataValue = bookData.childNodes[j];
                        //console.log("[controllers.myFunction] bookDataValue: "+bookDataValue.childNodes[0].nodeValue)
                        //console.log("[controllers.myFunction] bookDataggg: "+bookDataValue.childNodes[j].nodeValue)
                    }
                    
                }
            }
        }

    });
    
    
    

    document.addEventListener("deviceready", init, false);
    function init() {
        console.log("[controllers.DashCtrl] deviceready init")
        document.querySelector("#startScan").addEventListener("touchend", startScan, false);
        document.querySelector("#startNFC").addEventListener("touchend", startNFC, false);
        resultDiv = document.querySelector("#results");
        console.log("[controllers.DashCtrl] resultISBN: "+resultISBN)
    }
    
    function startNFC() {
        
        console.log("[controllers.DashCtrl] startNFC")
        
        nfc.addNdefListener (
            function (nfcEvent) {
                var tag = nfcEvent.tag,
                    ndefMessage = tag.ndefMessage;

                // dump the raw json of the message
                // note: real code will need to decode
                // the payload from each record
                 console.log(JSON.stringify(ndefMessage));

                // assuming the first record in the message has
                // a payload that can be converted to a string.
                 console.log(nfc.bytesToString(ndefMessage[0].payload).substring(3));
            },
            function () { // success callback
                 console.log("Waiting for NDEF tag");
            },
            function (error) { // error callback
                 console.log("Error adding NDEF listener " + JSON.stringify(error));
            }
        );
        
    }
    
    function startScan() {
        
        console.log("[controllers.DashCtrl] startScan")

        cordova.plugins.barcodeScanner.scan(
            function (result) {
                console.log("[controllers.DashCtrl] scan")
                var s = "Result: " + result.text + "<br/>" +
                "Format: " + result.format + "<br/>" +
                "Cancelled: " + result.cancelled;
                resultDiv.innerHTML = s;
                resultISBN = result.text;
                console.log("[controllers.DashCtrl] resultISBN: "+resultISBN)
                
                //$http.get(isbnURL+resultISBN).success(function(data) {
                //    console.log("[controllers.http.get] data: "+data)
                    
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            myFunction(xhttp);
                        }
                    };
                    xhttp.open("GET", isbnURL+resultISBN, true);
                    xhttp.send();

                    function myFunction(xml) {
                        console.log("[controllers.myFunction] myFunction: ")

                        var xmlDoc = xml.responseXML;
            
                        var Title = xmlDoc.getElementsByTagName('Title').item(0).firstChild.data;
                        var TitleLong = xmlDoc.getElementsByTagName('TitleLong').item(0).firstChild.data;
                        var AuthorsText = xmlDoc.getElementsByTagName('AuthorsText').item(0).firstChild.data;
                        var PublisherText = xmlDoc.getElementsByTagName('PublisherText').item(0).firstChild.data;

                        console.log("[controllers.myFunction] Title: "+Title)
                        console.log("[controllers.myFunction] TitleLong: "+TitleLong)
                        console.log("[controllers.myFunction] AuthorsText: "+AuthorsText)
                        console.log("[controllers.myFunction] PublisherText: "+PublisherText)
                        
                        var bookDetails =  "Title: " + Title + "<br/>" +
                        "Authors: " + AuthorsText;
                        document.getElementById("resultsISBN").innerHTML = bookDetails;


                        //var bookList = xmlDoc.getElementsByTagName('BookList')[0];

                        //if (bookList.hasChildNodes()) {
                        //    for (var i=0; i < bookList.childNodes.length; ++i) {
                        //        console.log("[controllers.myFunction] bookList: "+bookList.childNodes[i].nodeName)
                        //        var bookData = bookList.childNodes[i];
                        //        for (var j=0; j < bookData.childNodes.length; ++j) {
                        //            var bookDataValue = bookData.childNodes[i];
                        //            console.log("[controllers.myFunction] bookDataggg: "+bookDataValue.childNodes[j].nodeValue)
                        //        }

                        //    }
                        //}
                        
                    }
                    
                //});
                
            },
            function (error) {
                alert("Scanning failed: " + error);
            }
        );

    }
})

scanapp.controller('ChatsCtrl', function($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

scanapp.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

scanapp.controller('AccountCtrl', function($scope, config, AdobeCampaignService) {
    
    console.log("[controllers.AccountCtrl] Start: ")
    
    $scope.settings = {
        enableFriends: true,
        enableNotifications: true
    };
    
    document.querySelector("#saveFirebaseURL").addEventListener("touchend", saveFirebaseURL, false);
    
    function saveFirebaseURL() {
        
        console.log("[controllers.AccountCtrl] saveFirebaseURL")
        
    }
    
    $scope.saveFirebaseURL = function(settings) {
        console.log("[controllers.AccountCtrl] saveFirebaseURL: "+settings.firebaseURL)
        console.log("[controllers.AccountCtrl] saveFirebaseURL: "+config.firebaseURL)
    }
    
    $scope.toggleChange = function() {
        var value = $scope.settings.enableNotifications;
        console.log('EnableNotifications ' + value);
        
        if(value == true){
            //AdobeCampaignService.registerNotifications();
        }else{
            //AdobeCampaignService.unregisterNotifications();
        }
     };
    
});