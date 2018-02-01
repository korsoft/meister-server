(function(app) {
	app.controller('ReportSummaryController', ['$scope','$state','$mdMedia','$mdDialog','$stateParams','ReportService', 
		function($scope,$state, $mdMedia,$mdDialog, $stateParams, ReportService) {
		


		$scope.data = {};
		$scope.chartType ="bar";
		
		$scope.isMobileDevice = $mdMedia('xs');

		$scope.chartData = [];
		$scope.labels = [];


		$scope.init = function(){
			console.log($stateParams.PKY);
			$scope.promise = ReportService.getDetails($stateParams.PKY);
	    	
	    	$scope.promise.then(
		          function(result) { 
		            	$scope.data = result.data;
			    		$scope.generateChart();
		          },
		          function(errorPayload) {
		              console.log('failure loading report details', errorPayload);
		          }
		     );

		}

		$scope.gotoReports = function(){
			$state.go('reports');
		};
		
		$scope.generateChart = function(){
			var report = ReportService.buildDataForGraphicReports($scope.data);
			$scope.chartData = report.data;
			$scope.labels = report.labels;
		}
	}]);
})(meister);