(function(app) {
	app.factory('SalesOrderService',
    ['$http','SERVER_BASE_URL',
    function ($http,SERVER_BASE_URL) {
        var service = {};

        service.execute = function(endpoint, json){
            return $http.get(SERVER_BASE_URL + '/demo/execute?Endpoint=' + endpoint + '&Json=' + json);
        }

        return service;
    }]);
})(meister);