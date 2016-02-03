/*Summary: sharedData is a factory service used to be able to share data amongst all of the controllers in the app
 * At the moment, it is storing message category and time frame*/
app.factory('sharedData', function ($rootScope) {
    var service = {};
    service.messageType = '';
    service.currentTime = new Date("2015-01-28 08:00:00.000");
    service.timeFrame = 0;
    service.times = [];
    service.messageCategories = [];
    service.messageCategoriesLength = 0;
    service.messageNum =0;
    // Function used to alert all of the controllers that the initialized lists are finished
    service.listLoaded = function () {
        $rootScope.$broadcast("listLoaded");

    };
    // Update the number of messages in the time frame
    service.updateNumOfMessages = function (value){
        service.messageNum = value;
        $rootScope.$broadcast('NumberOfMessagesDone');
    };
    // Function lets controllers know categories are done loading
    service.categoriesFinished = function () {
        $rootScope.$broadcast("categoriesDone");
    };
    // Function used to update the message category based on user selection
    service.updateMessageType = function (value) {
        this.messageType = value;
        $rootScope.$broadcast("typeUpdated");
    };
    // Function used to update the time frame based on user selection
    service.updateTimeFrame = function (value) {
        this.timeFrame = value;
        $rootScope.$broadcast("timeUpdated");
    };
    // function used to add times to shared data time array
    service.addTimes = function (value) {
        service.times[service.times.length] = value;
        $rootScope.$broadcast("timeAdded");
    };
    // Function used to add message categories into shared data messageCategory array
    service.addCategories = function (value) {
        service.messageCategories[service.messageCategories.length] = value;
        service.messageCategoriesLength += 1;
        $rootScope.$broadcast("typeAdded")
    };
    return service;

});
