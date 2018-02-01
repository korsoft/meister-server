(function(app) {
	app.controller('ReportsController', ['$scope','$timeout','$mdSidenav','$state','$mdMedia','$mdMenu','$mdDialog','$stateParams', 'ReportService', 
		function($scope,$timeout, $mdSidenav,$state, $mdMedia, $mdMenu,$mdDialog, $stateParams, ReportService) {
		

		$scope.isMobileDevice = $mdMedia('xs');
		$scope.reports = [];
		$scope.report="";

		$scope.init = function(){
			$scope.promise = ReportService.getListReport();
	    	
	    	$scope.promise.then(
		          function(result) { 
		          	var firts=true;
		          	angular.forEach(result.data.d.results, function(r, key) {
		          		var obj= angular.fromJson(r.Json);
		          		$scope.reports.push(obj);
		          		if(firts)
		          		{
		          			$scope.report = obj.REPORT_NAME;
		          			firts=false;
		          		}
					 
					});		  
					console.log($scope.reports);        	  
		     	  },
		          function(errorPayload) {
		              console.log('failureReportService.getListReport', errorPayload);
		          }
		     );	
		}

	}]);
})(meister);