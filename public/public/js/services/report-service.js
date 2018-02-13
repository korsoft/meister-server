(function(app) {
	app.factory('ReportService',
    ['$http','SERVER_BASE_URL',
    function ($http,SERVER_BASE_URL) {
        var service = {};

        service.getReports = function(){
            return $http.get(SERVER_BASE_URL + '/reports');
        };

        service.getListReports = function(){
            return $http.get(SERVER_BASE_URL + '/list_reports');
        };


        service.getDetails = function(pki){
        	return $http.get(SERVER_BASE_URL + '/reports/detail/' + pki);
        };

        service.schedule = function(reportName){
            return $http.get(SERVER_BASE_URL + '/reports/schedule/' + reportName);
        };

        service.buildDataForGraphicReports = function(data){
        	var groupsByDate = _.groupBy(data, function(item){ return item.PstngDate; });
        	var report = {
        		labels: [],
        		data: []
        	}
        	_.each(groupsByDate, function(item,key){
        		report.labels.push(key);
        		var sum = 0;
        		_.each(item, function(row){
        			sum += Number(row.Quantity.replace("-",""));
        		});
        		report.data.push(sum);
        	});
        	return report;
        };



        return service;
    }]);
})(meister);