(function(app) {
	app.controller('ReportingController', ['$scope','$rootScope','$timeout','$filter','$mdSidenav','$mdMenu','$mdMedia','$state',
		'$mdDialog','ReportingService',
		function($scope,$rootScope,$timeout, $filter, $mdSidenav,$mdMenu, $mdMedia, $state, $mdDialog, ReportingService ) {
		
		$scope.t_code_report_hint = "";
		$scope.report = {};
		$scope.reportSelected = [];
		$scope.loadingReports = false;

		$scope.params = [];
		$scope.paramsSelected = [];
		$scope.loadingParams = false;
		$scope.operations = ['EQ','BT','NE','GT','LT','GE','LE'];

		$scope.loadingReportSchedule = false;

		$scope.reportsFinder = function(){
			var endpoint = "Meister.SDK.Report.Finder";
			var json = '[{"HINT":"' + $scope.t_code_report_hint + '"}]';
			$scope.report = {};
			$scope.reportSelected = [];
			$scope.params = [];
			$scope.paramsSelected = [];
			$scope.loadingReports = true;
			$scope.reportsFinderProgress = ReportingService.execute(endpoint, json);
			$scope.reportsFinderProgress.then(
	          function(result) { 
	          	$scope.loadingReports = false;
	          	console.log("reportsFinder => result",result);		        	  
	          	var resultObject = result.data.Json[0].RESULTS;
	          	if(resultObject.length>0){
	          		$scope.report.columns = _.keys(resultObject[0].ENUMS[0]);
	          		$scope.report.rows = resultObject;
	          	} else {
	          		$scope.report = {};
	          	}
	          	console.log("Reports =>",$scope.report);
	          },
	          function(errorPayload) {
	          	$scope.loadingReports = false;
	              console.log('reportsFinder => failure', errorPayload);
	          }
	     	);
		};

		$scope.onReportSelected = function(){
			console.log("onReportSelected",$scope.reportSelected);
			$scope.loadParametersByReport();
		};

		$scope.loadParametersByReport = function(){
			$scope.params = [];
			$scope.paramsSelected = [];
			if($scope.reportSelected.length>0){
				var endpoint = "Meister.SDK.Report.Parameters";
				var json = '{"REP_TCODE":"' + $scope.reportSelected[0].ENUMS[0].NAME + '"}';
				$scope.loadingParams = true;
				$scope.paramsProgress = ReportingService.execute(endpoint, json);
				$scope.paramsProgress.then(
		          function(result) { 
		          	$scope.loadingParams = false;
		          	console.log("loadParametersByReport => result",result);
		          	$scope.params = result.data.Json[0].SELECTIONS.METADATA[0].PARAMETERS;
		          	_.forEach($scope.params,function(p){
		          		p.$edit = false;
		          		p.$selected = false;
		          		p.$operation = $scope.operations[0];
		          		if(p.$operation == 'EQ' || p.$operation == 'NE')
		          			p.$from = [];
		          		else
		          			p.$from = "";
		          		p.$to = "";
		          	});
		          },
		          function(errorPayload) {
		          	$scope.loadingReports = false;
		              console.log('loadParametersByReport => failure', errorPayload);
		          }
		     	);
			}
		};

		$scope.onParamSelected = function(p){
			p.$selected = true;
			console.log("onParamSelected",p);
		};

		$scope.onParamUnSelected = function(p){
			p.$selected = false;
			console.log("onParamUnSelected",p);
		};

		$scope.editParam = function(p){
			p.$edit = true;
			p.$paramEdit = angular.copy(p);
		};

		$scope.updateParam = function(p){
			p.$edit = false;
			p.$operation = p.$paramEdit.$operation;
			p.$from = p.$paramEdit.$from;
			p.$to = p.$paramEdit.$to;
			p.PARAMETER.NAME = p.$paramEdit.PARAMETER.NAME;
			delete p.$paramEdit;
		};

		$scope.cancelEditParam = function(p){
			p.$edit = false;
			delete p.$paramEdit;
		};

		$scope.changeOperation = function(p){
			console.log("changeOperation",p);
			if(p.$paramEdit.$operation == 'EQ' || p.$paramEdit.$operation == 'NE')
		        p.$paramEdit.$from = [];
		    else
		       p.$paramEdit.$from = "";
			p.$paramEdit.$to = "";
		};

		$scope.outputFrom = function(p){
			if(p.$operation == 'EQ' || p.$operation == 'NE'){
				var values = "";
				_.forEach(p.$from, function(v){
					values += v + ",";
				});
				if(values.length>0)
					return values.substring(0,values.length-1);
				else
					return values;
			} else
				return p.$from;
		};

		$scope.executeSchedule = function(){
			var endpoint = "Meister.SDK.Report.Scheduler";
			var json = '[{"columns_named":"X","parameters":[';
			_.forEach($scope.paramsSelected,function(param){
				if(param.$operation == 'EQ' || param.$operation == 'NE'){
					_.forEach(param.$from,function(p){
						json += '{"high":"' + p + '","kind":"S","low":"' + p + '","option":"' + param.$operation + '","selname":"' + param.PARAMETER.NAME + '","sign":"I"},';	
					});
				} else if(param.$operation == 'BT'){
					json += '{"high":"' + param.$to + '","kind":"S","low":"' + param.$from + '","option":"BT","selname":"' + param.PARAMETER.NAME + '","sign":"I"},';
				} else {
					json += '{"high":"' + param.$from + '","kind":"S","low":"' + param.$from + '","option":"' + param.$operation + '","selname":"' + param.PARAMETER.NAME + '","sign":"I"},';
				}
			});

			json = json.substring(0,json.length-1);
			json += '],"report":"' + $scope.reportSelected[0].ENUMS[0].NAME + '","username":"AROSENTHAL","variant":"","with_metadata":""}]';
			console.log("json",json);
			/*$scope.loadingReportSchedule = true;
			$scope.reportScheduleProgress = ReportingService.execute(endpoint, json);
			$scope.reportScheduleProgress.then(
	          function(result) { 
	          	$scope.loadingReportSchedule = false;
	          	console.log("executeSchedule => result",result);
	          },
	          function(errorPayload) {
	          	$scope.loadingReportSchedule = false;
	              console.log('executeSchedule => failure', errorPayload);
	          }
	     	);*/
			
		};

	}]);
})(meister);