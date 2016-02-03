/*Summary: This javascript file is where the angular module 'app' is initialized and
 * if there is anything needed to include, then it is also initialized*/
var app = angular.module('myApp', ['smart-table', 'googlechart', 'ui.bootstrap']);

/*InitializeCtrl is used to load the message categories and times into the sharedData service */
app.controller('initializeCtrl', function ($scope, $http, sharedData) {
    var initialize = function () {

        $http.get('http://localhost:3980/api/main/messagetypes').
            success(function (data) {
                // How many message types there are
                $scope.rttlength = data.length;
                // Assign each message type to a place in the sharedData array
                for (var i = 0; i < $scope.rttlength; i++) {
                    sharedData.addCategories(data[i]);
                }
                if (sharedData.messageType == '') {
                    sharedData.updateMessageType(sharedData.messageCategories[0]);
                }
                sharedData.categoriesFinished();

            });
        // Add times to sharedData array
        // Assign time frames
        $scope.times = [];
        $scope.times[0] = 1;
        $scope.times[1] = 8;
        $scope.times[2] = 24;
        $scope.times[3] = 168;
        $scope.times[4] = 720;

        for (var t = 0; t < $scope.times.length; t++) {
            sharedData.addTimes($scope.times[t]);
        }
        if (sharedData.timeFrame == 0) {
            sharedData.updateTimeFrame(sharedData.times[1]);
        }
        sharedData.listLoaded();

    };
    // If there is a storing of the message category or message type in the web browser
    // Then use those to set the message type and time frame in the service.
    // this is mostly used for selecting a bar from the summary bar graph
    if (localStorage.getItem('messageCategory') == null || localStorage.getItem('timeFrame') == null) {
        initialize();
    }
    else {
        var type = localStorage.getItem('messageCategory');
        var time = localStorage.getItem('timeFrame');
        sharedData.updateMessageType(type);
        sharedData.updateTimeFrame(time);
        initialize();
    }


});