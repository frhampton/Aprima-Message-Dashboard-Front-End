/* Summary: The TypeTableCtrl Controller is used in the Round Trip Time page of the app to display data pulled from the
 * webservice in a clean smart table based on message category
 * and time frame selected by user. Requires smart-table.debug.js, stTable.js, and stTable.js*/
app.controller('TypeTableCtrl', function ($scope, $http, sharedData) {

// Wait until Service is ready
    $scope.$on('listLoaded', function () {
        //Makes initial call to Table
        $scope.updateTable();
    });

    $scope.updateTable = function () {

        //  // the currentMessage Category is pulled from the service sharedData
        $scope.currentMessageCategory = sharedData.messageType;

        // Load the Information for Table based on Current Activity
        $http.get('http://localhost:3980/api/table/' + $scope.currentMessageCategory).
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

                    // Hold On to the uid for rows
                    $scope.UID[j] = data[j].MessageID;


                    $scope.rowCollection.push({
                        TransmissionType: $scope.MessageType[j],
                        SuccessfulTransmissionTimestamp: $scope.SuccessTimeStamp[j],
                        Status: $scope.MessageStatus[j],
                        NextSendAttempt: $scope.NextSend[j],
                        LastTransmissionAttempt: $scope.LastTransAttempt[j],
                        MessageID: $scope.UID[j]
                    })
                }

            });


    };


    // Create Function to call html page and display message data from table row click
    $scope.UIDCall = function (messageID) {

        localStorage.setItem( 'UID', messageID);
        window.open("MessageUID.html");
    };

    // If the message category is changed by dropdown, change variable in controller
    // and update table
    $scope.$on('typeUpdated', function () {

        $scope.currentMessageCategory = sharedData.messageType;
        $scope.updateTable();
    })
});