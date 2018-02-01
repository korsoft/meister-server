(function(app) {
	app.controller('ReportsController', ['$scope','$timeout','$mdSidenav','$state','$mdMedia','$mdMenu','$mdDialog','$stateParams', 
		'$mdToast','ReportService', 
		function($scope,$timeout, $mdSidenav,$state, $mdMedia, $mdMenu,$mdDialog, $stateParams,
			$mdToast, ReportService) {
		

		$scope.isMobileDevice = $mdMedia('xs');
		$scope.reports = [];
		$scope.report="";
		$scope.selected = [];

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
		     	  },
		          function(errorPayload) {
		              console.log('failureReportService.getListReport', errorPayload);
		          }
		     );	
		}

		$scope.gotoReportSummary = function(r){
			if(r.STATUS =="S")
	    		$state.go('reports-summary',{PKY:r.PKY, reportName:r.REPORT_NAME});
	    	else
	    		$mdToast.show(
			      $mdToast.simple()
			        .textContent('Report output is being prepared. Check back in a few minutes.')
			        .position('bottom' )
			        .hideDelay(3000)
			    );
	    };

	}]);
})(meister);