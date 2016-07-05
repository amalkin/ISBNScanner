angular.module('starter.controllers', [])

.controller('ScanCtrl', function($scope, $http) {

    console.log("[controllers.ScanCtrl] START")
    
    var firebaseURL = "https://am-books.firebaseio.com/"
    
    if (window.ADB) {
        console.log("[controllers.ScanCtrl] Has ADB")
        // Track using trackingTitle, falling back to path if unavailable
        ADB.trackState("Scan" || "/home/scan/", {});
    }
    
    var googleISBNUrl = "https://www.googleapis.com/books/v1/volumes?q=isbn:"
    
    var resultISBN;
    var resultDiv;
    var resultISBNDiv;
    
    document.addEventListener("deviceready", init, false);
    function init() {
        console.log("[controllers.ScanCtrl.init] deviceready init")
        document.querySelector("#startScan").addEventListener("touchend", startScan, false);
        resultDiv = document.querySelector("#results");
        console.log("[controllers.ScanCtrl.init] resultISBN: "+resultISBN)
    }
    
    function startScan() {
        
        console.log("[controllers.DashCtrl] startScan")

        cordova.plugins.barcodeScanner.scan(
            function (result) {
                console.log("[controllers.ScanCtrl.startScan] scan")
                var s = "ISBN: " + result.text + "<br/>";
                resultDiv.innerHTML = s;
                resultISBN = result.text;
                console.log("[controllers.ScanCtrl] resultISBN: "+resultISBN)
                
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
            }
        );

    }
    
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
    
})

.controller('BooksCtrl', function($scope, $http, Items) {

    console.log("[controllers.BooksCtrl] START")
    
    if (window.ADB) {
        console.log("[controllers.BooksCtrl] Has ADB")
        // Track using trackingTitle, falling back to path if unavailable
        ADB.trackState("Books" || "/home/books/", {});
    }
    
    $scope.items = Items;
    
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

.controller('DashCtrl', function($scope, $http) {
    
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
        resultDiv = document.querySelector("#results");
        console.log("[controllers.DashCtrl] resultISBN: "+resultISBN)
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

.controller('ChatsCtrl', function($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
})

.factory("Items", function($firebaseArray) {
    var itemsRef = new Firebase("https://am-books.firebaseio.com/");
    return $firebaseArray(itemsRef);
});