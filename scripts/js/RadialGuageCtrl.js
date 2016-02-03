/*Summary: The RadialGaugeCtrl Controller is used to pull data from the webservice based on the message category
 * and time frame that the user selected. It requires ng-radial-gauge.dir, d3-serv.js, and sharedData to be able to function
 * */
app.controller('RadialGaugeCtrl', function ($scope, $http, sharedData) {


// Wait until Service is ready
    $scope.$on('listLoaded', function () {
        // Wait until the Service gets the number of messages from the Graph Controller
        $scope.$on('NumberOfMessagesDone',function(){
            // Assign the number of messages from the Service to a variable in $scope
            $scope.numberOfMessages = sharedData.messageNum;
            //Makes initial call to gauge
            $scope.updateRadialGauge();
        })

    });

// Update RadialGauge is the function to calls the webservice for backend data and puts the radial gauge together
    $scope.updateRadialGauge = function () {

        // the currentMessage Category and timeFrame is pulled from the service sharedData
        $scope.currentMessageCategory = sharedData.messageType;
        $scope.currentTimeFrame = sharedData.timeFrame;
        // The Timeframe is displayed in hours but we need to be able to send input to the backend in seconds
        // (Works only with hours)
        $scope.convertedTime = Math.floor($scope.currentTimeFrame * 3600);

        $scope.formatTime = function() {
            if ($scope.currentTimeFrame > 24) {
                $scope.formattedTime = ($scope.currentTimeFrame / 24) + ' days';

            }
            else if($scope.currentTimeFrame == 24){
                $scope.formattedTime = '1 Day'
            }
            else if ($scope.currentTimeFrame > 1) {
                $scope.formattedTime = $scope.currentTimeFrame + ' hours';
            }
            else {
                $scope.formattedTime = $scope.currentTimeFrame + ' hour';
            }
        }


        // Get RTT information from webservice
        $http.get('http://localhost:3980/api/rtt/' + $scope.currentMessageCategory + '/' + $scope.convertedTime).
            success(function (data) {
                // This is the rtt
                $scope.value = data;
                // These are the limits for min and max on gauge
                $scope.upperLimit = 60;
                $scope.lowerLimit = 0;
                $scope.unit = "";
                $scope.precision = 2;
                $scope.ranges = [

                    {
                        min: 0,
                        max: 20,
                        color: '#8DCA2F'
                    },
                    {
                        min: 20,
                        max: 40,
                        color: '#FDC702'
                    },

                    {
                        min: 40,
                        max: 60,
                        color: '#C50200'
                    }
                ];
            });
    };

    // If the message category is changed by dropdown, change variable in controller
    // and update RadialGauge
    $scope.$on('typeUpdated', function () {

        $scope.currentMessageCategory = sharedData.messageType;
        $scope.updateRadialGauge();
    });

    // If the time frame is changed by dropdown, change variable in controller, format is
    // and update RadialGauge
    $scope.$on('timeUpdated', function () {
        $scope.currentTimeFrame = sharedData.timeFrame;
        $scope.convertedTime = Math.floor($scope.currentTimeFrame * 3600);
        $scope.formatTime();
        $scope.updateRadialGauge();
    })


});
