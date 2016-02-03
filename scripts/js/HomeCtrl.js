/* Aprima Message Dashboard - UTD Senior Design Project
 By: Vince Beltran, Frankie Hampton, Devon Gilbert, and Steve Minnich

 Summary: This controller is optional to use if wanting to load data through single page first
* */
app.controller('HomeCtrl', function ($scope, $http, sharedData) {
    $http.get('http://localhost:3980/api/main').
        success(function(data){
            $scope.value = data;
        })
});
