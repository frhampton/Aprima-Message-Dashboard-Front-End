/*The directive stRatio allows for column width editing inside of smart table
 * Note: Also used in TypeTableCtrl.js*/
app.directive('stRatio', function () {
    return {
        link: function (scope, element, attr) {
            var ratio = +(attr.stRatio);

            element.css('width', ratio + '%');

        }
    };
});

/* Summary: The SummaryTableCtrl Controller is used in the summary page of the app to display data pulled from the
 * webservice in a clean smart table. Requires smart-table.debug.js, stTable.js, and stTable.js*/
app.controller('SummaryTableCtrl', function ($scope, $http) {

    // The update Table function loads the information from the webservice and puts it into a table form
    $scope.updateTable = function () {


        // Load the Information for Summary Table
        $http.get('http://localhost:3980/api/table/').
            success(function (data) {
                // Arrays for each column of data
                $scope.MessageType = [];
                $scope.SuccessTimeStamp = [];
                $scope.MessageStatus = [];
                $scope.NextSend = [];
                $scope.LastTransAttempt = [];
                $scope.UID = [];

                // Number of rows needed
                $scope.tableLength = data.length;
                // Formatted rows will be put here
                $scope.rowCollection = [];

                // For each row in the returned table data, format the row and push it to the row collection
                for (var j = 0; j < $scope.tableLength; j++) {


                    if (data[j].Status != 'Success') {
                        $scope.MessageType[j] = '!!! ' + data[j].MessageCategory + ' !!!';
                    }
                    else {
                        $scope.MessageType[j] = data[j].MessageCategory;
                    }

                    $scope.SuccessTimeStamp[j] = data[j].SuccessfulTransmissionTimestamp;
                    $scope.MessageStatus[j] = data[j].Status;
                    $scope.NextSend[j] = data[j].NextSendAttempt;
                    $scope.LastTransAttempt[j] = data[j].LastTransmissionAttempt;
                    $scope.UID[j] = data[j].MessageID;


                    $scope.rowCollection.push({
                            TransmissionType: $scope.MessageType[j],
                            SuccessfulTransmissionTimestamp: $scope.SuccessTimeStamp[j],
                            Status: $scope.MessageStatus[j],
                            NextSendAttempt: $scope.NextSend[j],
                            LastTransmissionAttempt: $scope.LastTransAttempt[j],
                            MessageID: $scope.UID[j]
                        }
                    )

                }


            });


    };
    // Update Table function call
    $scope.updateTable();

    // Create Function to call html page and display message data from table row click
    $scope.UIDCall = function (messageID) {
        localStorage.setItem( 'UID', messageID);
        window.open("MessageUID.html");
    };


});
