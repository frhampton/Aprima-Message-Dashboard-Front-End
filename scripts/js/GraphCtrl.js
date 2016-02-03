/*Summary: The LineGraphCtrl controller is used to display a line graph dynamically
 * for the user selected message type and time frame. It requires the googleApi.js and the sharedData and
 * and the ngGoogleCharts*/

'use strict';

app.controller('LineGraphCtrl', function ($scope, $http, sharedData) {

    // Wait until Service is ready
    $scope.$on('listLoaded', function () {
        //Makes initial call to Graph
        $scope.updateGraph();
    });

    // Update Graph is the function to calls the webservice for backend data and puts the line chart together
    $scope.updateGraph = function () {

        // the currentMessage Category and timeFrame is pulled from the service sharedData
        $scope.currentMessageCategory = sharedData.messageType;
        $scope.currentTimeFrame = sharedData.timeFrame;

        // The Timeframe is displayed in hours but we need to be able to send input to the backend in seconds
        // (Works only with hours)
        $scope.convertedTime = Math.floor($scope.currentTimeFrame * 3600);

        // Loads the Information for the Line Chart
        $http.get('http://localhost:3980/api/graph/' + $scope.currentMessageCategory + '/' + $scope.convertedTime).
            success(function (data) {

                $scope.dateTime = [];
                $scope.date = [];
                $scope.time = [];
                $scope.rtt = [];

                // Gives the amount of data points the graph needs
                $scope.graphLength = data.length;
                // Assign the number of messages to the service
                sharedData.updateNumOfMessages($scope.graphLength);

                // Array for chart rows
                $scope.chartRows = [];
                // Assign each row to chartRows (Place where I should make edits to x axis

                for (var m = $scope.graphLength - 1; m >= 0; m--) {


                    //// Format Time for shorter time frames
                        var Time = data[m].SuccessfulTransmissionTimestamp.split("-"); // pull time of rtt and split into date and time
                        $scope.time[m] = Time[1];// Assign second part dateTime to time


                   //// Format Date for longer time frames
                    var newDate = new Date(data[m].SuccessfulDT);
                    $scope.date[m] = (newDate.getMonth() + 1) + '/' + newDate.getDate() + '/' + newDate.getFullYear();
                    // Get rtt from webservice data
                    $scope.rtt[m] = parseInt(data[m].MessageRtt);// pull the rtt and format as integer

                    // If the current time frame is over a week, format rows as dates
                    if ($scope.currentTimeFrame < 168) {
                        // If the message triggered an alert, then make it red
                        if(data[m].AlertTriggered){
                            $scope.chartRows.push({c: [{v: $scope.time[m]}, {v: $scope.rtt[m]}, {v: '#FF0000'}]})
                        }
                        else {
                            $scope.chartRows.push({c: [{v: $scope.time[m]}, {v: $scope.rtt[m]}, {v: null}]})// format the chart row with data
                        }
                    }
                    else {
                        if(data[m].AlertTriggered){
                            $scope.chartRows.push({c: [{v: $scope.date[m]}, {v: $scope.rtt[m]}, {v:'#FF0000'}]})// format the chart row with data
                        }
                        else{
                            $scope.chartRows.push({c: [{v: $scope.date[m]}, {v: $scope.rtt[m]}, {v: null}]})// format the chart row with data
                        }
                    }
                    ;
                }
                var currentTime = new Date(sharedData.currentTime);

                // This Function was supposed to set up algorithm for setting horizontal ticks on graph

                //setTicks(currentTime);
                //function setTicks(currentTime){
                //    // Figure out the best way to divide up the increments
                //    var minutes = $scope.currentTimeFrame * 60; // should give you minutes
                //     // milliseconds per minute!
                //    var increments = minutes/12;
                //     $scope.ticks = [];
                //    // For loop set to have twelve ticks (per Aprima Requirement)
                //    for(var t = 0; t < 12; t++){
                //        $scope.ticks[t] = formatAMPM(new Date(currentTime - 60000* increments * (t+1)));
                //
                //    }
                //}


                // Create line chart and style
                var chart1 = {};
                chart1.type = "LineChart";
                chart1.cssStyle = "height:360px; width:750px;";
                chart1.data = {
                    "cols": [
                        {id: "time", label: "Time", type: "string"},
                        {id: "messageType-id", label: $scope.currentMessageCategory, type: "number"},
                        {role: "style", type: "string"}

                    ]
                    ,
                    "rows": $scope.chartRows


                };


                chart1.options = {
                    "isStacked": "true",
                    "fill": 20,

                    "displayExactValues": false,
                    "vAxis": {
                        "title": "Seconds", "gridlines": {"count": 6}
                    },
                    "hAxis": {
                        "title": "Time",
                        "gridlines": {"count": 12}


                        //"ticks": [ $scope.ticks[11],$scope.ticks[10], $scope.ticks[9], $scope.ticks[8],
                        //$scope.ticks[7], $scope.ticks[6], $scope.ticks[5], $scope.ticks[4], $scope.ticks[3], $scope.ticks[2],
                        //$scope.ticks[1], $scope.ticks[0]]
                    }

                };

                chart1.formatters = {};

                $scope.chart = chart1;

            });

    };


    // If the message category is changed by dropdown, change variable in controller
    // and update Graph
    $scope.$on('typeUpdated', function () {

        $scope.currentMessageCategory = sharedData.messageType;
        $scope.updateGraph();
    });
    // If the time frame is changed by dropdown, change variable in controller, format is
    // and update Graph
    $scope.$on('timeUpdated', function () {
        $scope.currentTimeFrame = sharedData.timeFrame;
        $scope.convertedTime = Math.floor($scope.currentTimeFrame * 3600);
        $scope.updateGraph();
    })

});
