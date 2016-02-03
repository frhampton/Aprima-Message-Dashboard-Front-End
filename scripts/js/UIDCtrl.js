/* Summary: The UIDCtrl Controller is used to access the UID from the service and grab the info from the webservice
 * based on that ID. It then gets that data shown by the MessageUID.html */


app.controller('UIDCtrl', function ($scope, $http, sharedData) {
    // Get the UID that is stored in the Web Browser
    $scope.UID = localStorage.getItem('UID');
    // Use UID to retrieve data about message from Web Service
    $http.get('http://localhost:3980/api/uid/' + $scope.UID).
        success(function (data) {
            $scope.MessageCategory = data.MessageCategory;
           $scope.EnqueuedTimestamp = data.EnqueuedTimestamp;
            $scope.LastModifiedDate = data.LastModifiedDate;
            $scope.MessageID = data.MessageID;
            $scope.MessageRtt = data.MessageRtt;
            $scope.MessageStatusCode = data.MessageStatusCode;
            $scope.MessageName = data.Name;
            $scope.NextSendAttempt = data.NextSendAttempt;
            $scope.NumberOfTrans = data.NumberOfTransmissionAttempts;
            $scope.Reprocess = data.Reprocess;
            $scope.RetryMinutes = data.RetryMinutes;
            $scope.ServerDBName = data.ServerDBName;
            $scope.Status = data.Status;
            $scope.SuccessfulTransmissionTimestamp = data.SuccessfulTransmissionTimestamp;
        })
});
