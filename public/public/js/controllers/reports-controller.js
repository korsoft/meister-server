(function(app) {
	app.controller('ReportsController', ['$scope','$timeout','$mdSidenav','$state','$mdMedia','$mdMenu','$mdDialog','$stateParams', 
		'$mdToast','ReportService', 
		function($scope,$timeout, $mdSidenav,$state, $mdMedia, $mdMenu,$mdDialog, $stateParams,
			$mdToast, ReportService) {
		

		$scope.isMobileDevice = $mdMedia('xs');
		$scope.reports = [];
		$scope.list_reports = [];
		$scope.report="";
		$scope.selected = [];

		$scope.init = function(){
			$scope.promise = ReportService.getReports();
			$scope.promise2 = ReportService.getListReports();
	    	
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
		              console.log('failureReportService.getReports', errorPayload);
		          }
		     );	

	    	$scope.promise2.then(
		          function(result) { 
		          	console.log("ReportService.getListReports",result);
		          	$scope.list_reports = result.data;
		          	/*angular.forEach(result.data.d.results, function(r, key) {
		          		var obj= eval("(" + r.Json + ")");
		          		$scope.list_reports.push(obj);
		          	});*/		        	  
		          
		     	  },
		          function(errorPayload) {
		              console.log('failureReportService.getListReports', errorPayload);
		          }
		     );	
		}

		$scope.schedule = function(ev, r){
			console.log("schedule",r);
			$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.title('Schedule Report successfull')
					.textContent('Schedule Report success')
					.ok('Ok')
					.targetEvent(ev)
					).then(function(){
					    $scope.promise = ReportService.schedule(r);
	    	
				    	$scope.promise.then(
					          function(result) { 
					          console.log("ReportService.schedule", result); 
					          $scope.init();    	  
					    },
					    function(errorPayload) {
					        console.log('ReportService.schedule', errorPayload);
					    }
		     );	
		});
		};

		$scope.gotoReportSummary = function(r){
			if(r.STATUS =="F")
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