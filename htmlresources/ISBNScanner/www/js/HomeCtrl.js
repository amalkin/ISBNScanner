var scanapp = angular.module('cqHomeCtrl', [])

scanapp.controller('HomeCtrl', function($scope, $http, nfcService, $interval, $timeout, $cordovaGeolocation, $firebase, Auth) { 
    
    console.log("[controllers.HomeCtrl] START");

    $scope.showTargetMessage = true;

    //https://publish84.adobedemo.com/content/dam/we-retail/en/products/apparel/gloves/Classic%20Leather.jpg
    //https://cdn.shopify.com/s/files/1/1060/1564/products/Harry-Potter-Color-Changing-Cup-Magic-Mug-Marauders-Map-Coffee-Mug-Magical-Mug-Marauder-s-Map-4_large.jpg?v=1447979388
    var serverURL = "https://publish84.adobedemo.com";
    var assetPath = "/content/dam/we-retail/en/products";

    var theUsers = ['Magic cup', 'Wireless Charging kit', 'Watch', 'VW Polo', 'Lenovo', 'iPad', 'iPhone', 'Amazon Echo', 'Carrot'];
    
    var theProducts = [
        { 'user': 'Frank', 'product': 'Magic cup', 'location': 'Stockholm, Sweden', 'time': '16/08/2017 13:05:10', 'likes': '1', 'comments': '2', 'image': '/apparel/gloves/Classic%20Leather.jpg' },
        { 'user': 'Jane', 'product': 'Wireless Charging kit', 'location': 'Leipgig, Germany', 'time': '16/08/2017 13:05:10', 'likes': '1', 'comments': '2', 'image': '/apparel/gloves/Comfort%20Gel.jpg' },
        { 'user': 'Burt', 'product': 'Watch', 'location': 'Newcastle, UK', 'time': '16/08/2017 13:05:10', 'likes': '1', 'comments': '2', 'image': '/apparel/shirts/Eton.jpg' },
        { 'user': 'Alastair', 'product': 'VW Polo', 'location': 'Paris, France', 'time': '16/08/2017 13:05:10', 'likes': '1', 'comments': '2', 'image': '/apparel/shirts/Devi.jpg' },
        { 'user': 'Mike', 'product': 'Lenovo', 'location': 'Nice, France', 'time': '16/08/2017 13:05:10', 'likes': '1', 'comments': '2', 'image': '/apparel/shirts/Rios.jpg' },
        { 'user': 'Gurs', 'product': 'iPad', 'location': 'Milan, Italy', 'time': '16/08/2017 13:05:10', 'likes': '1', 'comments': '2', 'image': '/activities/water-sports/Pufferfish Blue.jpg' },
        { 'user': 'Sven', 'product': 'iPhone', 'location': 'London, UK', 'time': '16/08/2017 13:05:10', 'likes': '1', 'comments': '2', 'image': '/activities/water-sports/Swim Goggles Yellow.jpg' },
        { 'user': 'Jean', 'product': 'Amazon Echo', 'location': 'Hastings, UK', 'time': '16/08/2017 13:05:10', 'likes': '1', 'comments': '2', 'image': '/activities/water-sports/Swim Goggles Yellow.jpg' },
    ];
    var randomNumber = Math.floor(Math.random() * theProducts.length);
    $scope.purchasedUser = theProducts[randomNumber].user;
    $scope.purchasedProduct = theProducts[randomNumber].product;

    var c=0;
    var timer = $interval(function(){
        console.log("[controllers.HomeCtrl] timer");
        var randomProductNumber = Math.floor(Math.random() * theProducts.length);
        //$scope.randomNumberTimer="This DIV is refreshed "+c+" time. And randomProduct: "+theProducts[randomProductNumber].user;
        $scope.randomNumberTimer="Product: "+theProducts[randomProductNumber].product;
        $scope.purchasedUser = theProducts[randomProductNumber].user;
        $scope.purchasedProduct = theProducts[randomProductNumber].product;
        c++;
    },5000);

    
    $scope.showError = false;
    $scope.doFade = false;
    $scope.purchaseMessage = ' has just purchased';
    $scope.opacity = 0;

    var tt=0;
    var randomProductNameNumber = Math.floor(Math.random() * theProducts.length);
    $scope.randomProductUser=theProducts[randomProductNameNumber].user;
    $scope.randomProductName=theProducts[randomProductNameNumber].product;
    $scope.randomProductLocation=theProducts[randomProductNameNumber].location;
    $scope.randomProductImage=serverURL+assetPath+theProducts[randomProductNameNumber].image;
    var timer = $interval(function(){
        console.log("[controllers.HomeCtrl] targetRefresh");
        randomProductNameNumber = Math.floor(Math.random() * theProducts.length);
        $scope.randomProductUser=theProducts[randomProductNameNumber].user;
        $scope.randomProductName=theProducts[randomProductNameNumber].product;
        $scope.randomProductLocation=theProducts[randomProductNameNumber].location;
        $scope.randomProductImage=serverURL+assetPath+theProducts[randomProductNameNumber].image;
        $scope.targetRefresh = "";
        $scope.targetRefresh = "elementToFadeInAndOut";
    },20000);

    $timeout(function(){
        console.log("[controllers.HomeCtrl] timeouter");
        $scope.showError = true;
        $scope.doFade = true;
    }, 200);
    
    /* Auth.$onAuth(function(authData) {
        if (authData === null) {
            console.log("Not logged in yet");
        } else {
            console.log("Logged in as", authData.uid);
        }
        $scope.authData = authData; // This will display the user's name in our view
    }); */
    
})