(function(app) {
	app.controller('ReportSummaryController', ['$scope','$state','$mdMedia','$mdDialog','$stateParams','$timeout','ReportService', 
		function($scope,$state, $mdMedia,$mdDialog, $stateParams,$timeout, ReportService) {
		


		$scope.data = [];
		$scope.chartType ="bar";
		
		$scope.isMobileDevice = $mdMedia('xs');

		$scope.chartData = [];
		$scope.labels = [];
		$scope.report_name = "";
		$scope.filterDate="";
		$scope.chartOptions ={
			onClick: function(e) {
			 
		      var element = this.getElementAtEvent(e);
		      if (element.length) {
		         var index = element[0]._index;
		         
		         $timeout(function(){
		         	$scope.filterDate=$scope.labels[index];
		         })
		         console.log( $scope.filterDate);
		      }
		    }
		};


		$scope.init = function(){
			console.log($stateParams.PKY);
			$scope.report_name = $stateParams.reportName;
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

		$scope.removeFilters= function (){
			$scope.filterDate="";
		}

	}]);
})(meister);