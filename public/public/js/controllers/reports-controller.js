(function(app) {
	app.controller('ReportsController', ['$scope','$timeout','$mdSidenav','$state','$mdMedia','$mdMenu','$mdDialog','$stateParams', 'ReportService', 
		function($scope,$timeout, $mdSidenav,$state, $mdMedia, $mdMenu,$mdDialog, $stateParams, ReportService) {
		

		$scope.isMobileDevice = $mdMedia('xs');
		$scope.reports = [];

		$scope.init = function(){
			$scope.promise = ReportService.getListReport();
	    	
	    	$scope.promise.then(
		          function(result) { 
		          	  console.log("ReportService.getListReport",result);
		     	  },
		          function(errorPayload) {
		              console.log('failureReportService.getListReport', errorPayload);
		          }
		     );	
		}

	}]);
})(meister);