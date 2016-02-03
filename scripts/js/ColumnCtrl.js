/*Aprima Message Dashboard - UTD Senior Design Project
By: Vince Beltran, Frankie Hampton, Devon Gilbert, and Steve Minnich

Summary: This controller is used to gather the data for the Column Graph in Summary.html and build the characteristics
of the graph.
*/

'use strict';


app.controller('ColumnCtrl', function ($scope, $http, sharedData) {
    $scope.$on('listLoaded', function () {

        // Wait for the message categories to be open
        $scope.$on('categoriesDone', function () {
            // Call the webservice and pull the data
            $http.get('http://localhost:3980/api/summary').
                success(function (data) {
                    // Categories length from sharedData
                    $scope.categorieslength = sharedData.messageCategoriesLength;
                    // Assign each message type to a place in the tabs array
                    $scope.categories = [];
                    for (var i = 0; i < $scope.categorieslength; i++) {
                        //$scope.categories.push({title: sharedData.messageCategories[i]});
                        $scope.categories[i] = sharedData.messageCategories[i];

                    }

                    // column and row arrays
                    $scope.chartRows = [];
                    $scope.chartCols = [];
                    // Go ahead and push type to chart columns
                    $scope.chartCols.push({id: "messageType", label: "Message Category", type: "string"});

                    // Get the formatted Times
                    $scope.formattedTimes = [];
                    // Array for the times in Seconds
                    $scope.unformattedTimes = [];
                    for (var m = 0; m < sharedData.times.length; m++) {
                        $scope.unformattedTimes[m] = sharedData.times[m] * 3600;
                        var time = sharedData.times[m];
                        // If the number of hours is over 24, list as days
                        if (time >= 24) {
                            $scope.formattedTimes[m] = (time / 24) + ' d';

                        }
                        // If the number of hours is greater than one, list hrs
                        else if (time > 1) {
                            $scope.formattedTimes[m] = time + ' hrs';
                        }
                        // If the number of hours is one, list as hr
                        else {
                            $scope.formattedTimes[m] = time + ' hr';
                        }
                        // Push each time into the chart columns
                        $scope.chartCols.push({
                            id: $scope.formattedTimes[m],
                            label: $scope.formattedTimes[m],
                            type: "number"
                        })
                    }


                    $scope.rtts = [];
                    for (var i = 0; i < $scope.categories.length; i++) { // For each message category
                        $scope.rtts[i] = [];
                        for (var j = 0; j < $scope.unformattedTimes.length; j++) {// For each time frame
                            $scope.rtts[i][j] = data[(i * $scope.unformattedTimes.length + j)].MessageRtt;
                        }
                    }


                    // Create the rows for each message type
                    function createRows() {

                        for (var i = 0; i < $scope.rtts.length; i++){
                            // If there is an alert triggered for one of the message types, then
                            // add exclamation points to it
                            if(data[i * $scope.unformattedTimes.length + 1].AlertTriggered){
                                // This is done knowing that we should only have 5 time frames
                                $scope.chartRows.push({
                                    c: [{v: '!!! ' + $scope.categories[i] + ' !!!'}, {v: $scope.rtts[i][0]}, {v: $scope.rtts[i][1]},
                                        {v: $scope.rtts[i][2]}, {v: $scope.rtts[i][3]}, {v: $scope.rtts[i][4]}]
                                });
                            }
                            else {
                                // This is done knowing that we should only have 5 time frames
                                $scope.chartRows.push({
                                    c: [{v: $scope.categories[i]}, {v: $scope.rtts[i][0]}, {v: $scope.rtts[i][1]},
                                        {v: $scope.rtts[i][2]}, {v: $scope.rtts[i][3]}, {v: $scope.rtts[i][4]}]
                                });
                            }


                        }
                    }

                    // Call rows to be created and chart to be prepared
                    createRows();
                    createChart();
                    // Prepare the chart to be drawn
                    function createChart() {
                        // Create line chart and style
                        var columnChart = {};
                        columnChart.type = "ColumnChart";
                        columnChart.cssStyle = "height:400px; width:1300px;";
                        columnChart.data = {
                            "cols": $scope.chartCols


                            ,
                            "rows": $scope.chartRows


                        };

                        // The column chart customizable options
                        columnChart.options = {
                            "isStacked": "false",
                            "fill": 20,

                            "displayExactValues": true,
                            "vAxis": {
                                "title": "Seconds", "gridlines": {"count": 6}
                            },
                            "hAxis": {
                                "title": "Average Round-Trip Time"

                            }

                        };

                        columnChart.formatters = {};

                        $scope.chart = columnChart;


                    }

                    // Have a way to select a bar and be redirected to roundTripTime.html
                    $scope.messageSelect = function (selectedItem) {


                        sharedData.updateMessageType($scope.categories[selectedItem.row]);
                        sharedData.updateTimeFrame(sharedData.times[selectedItem.column]);
                        // store the messageCategory and message timeframe in the web browser
                        localStorage.setItem('messageCategory', $scope.categories[selectedItem.row]);
                        localStorage.setItem('timeFrame', sharedData.times[selectedItem.column - 1]);
                        window.open("roundTripTime.html", "_self");

                    }
                });
        });
    })
});