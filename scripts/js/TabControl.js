/*Summary: The TabCtrl Controller is implemented in order to be able to pull the message types
 * and define the time frames used by the visual representations of rtt. It requires sharedData from Service.js
 **/

app.controller('TabCtrl', function ($scope, $http, sharedData) {
    // Pull data from the webservice: messageTypes

    //$http.get('http://localhost:3980/api/main/messagetypes').
    //    success(function (data) {
    // When all of the data is loaded
    $scope.$on('listLoaded', function () {




        // How many message types there are
        $scope.$on('categoriesDone', function () {
            $scope.rttlength = sharedData.messageCategoriesLength;
            $scope.currentMessageCategory = sharedData.messageType;
            // Assign each message type to a place in the tabs array
            $scope.tabs = [];
            // Have a boolean for the active tab

            for (var i = 0; i < $scope.rttlength; i++) {

                // See which one should be active
                if ($scope.currentMessageCategory == sharedData.messageCategories[i]) {
                    $scope.tabs.push({title: sharedData.messageCategories[i], active: true});
                }
                else {
                    $scope.tabs.push({title: sharedData.messageCategories[i], active: false});

                }
            }
        });


        // 3 Possible Time Frames should be minutes, hours, days
        // Implement functionality to format times for links
        $scope.formattedTimes = [];
        $scope.radii = [];
        for (var m = 0; m < sharedData.times.length; m++) {
            var time = sharedData.times[m];

            if (time >= 24) {
                $scope.formattedTimes[m] = (time / 24) + ' d';

            }
            else if (time > 1) {
                $scope.formattedTimes[m] = time + ' hrs';
            }
            else {
                $scope.formattedTimes[m] = time + ' hr';
            }
            $scope.radii.push({time: $scope.formattedTimes[m], unformatted: sharedData.times[m]});
        }


    });

    //});
    // });
    // Update the current message category in sharedData with the selected Message from the drop down
    $scope.updateMessageType = function (message) {
        //sharedData.updateMessageType($scope.currentMessageCategory);
        sharedData.updateMessageType(message);
    };
    // Update the current time frame in sharedData with the selected Time Frame from the drop down
    $scope.updateTimeFrame = function (time) {
        sharedData.updateTimeFrame(time)
    };

});