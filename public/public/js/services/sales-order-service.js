(function(app) {
	app.factory('SalesOrderService',
    ['$http','SERVER_BASE_URL',
    function ($http,SERVER_BASE_URL) {
        var service = {};

        service.execute = function(endpoint, json){
            return $http.get(SERVER_BASE_URL + '/demo/execute?Endpoint=' + endpoint + '&Json=' + json);
        }

        service.buildSalesHistoryDataForGraphicReports = function(data){
        	var salesHistoryGroupBy18LastMonths = _.groupBy(data, 
			         function(item){ 
			          	var parts = item.DELIVERY_DATE.split("-");
			          	return parts[0]+"-"+parts[1]; 
			          }
			         );
			
			console.log("salesHistoryGroupBy18LastMonths",salesHistoryGroupBy18LastMonths);
        	var months = [];
        	var date = moment();
        	for(var i=0;i<18;i++){
        		months.push(date.format("YYYY-MM"));
        		date = date.subtract(1, 'months');
        	}
        	months = months.reverse();
        	console.log("months",months);

        	var report = {
        		labels: [],
        		data: []
        	}

        	_.each(months, function(m){
        		report.labels.push(m);
        		var sum = 0;
        		if(salesHistoryGroupBy18LastMonths[m]){
	        		_.each(salesHistoryGroupBy18LastMonths[m], function(row){
	        			sum += row.NET_VALUE;
	        		});
        		} 
        		report.data.push(sum);
        		
        	});
        	return report;
        };

        return service;
    }]);
})(meister);