(function(app) {
	app.controller('SalesOrderController', ['$scope','$rootScope','$timeout','$mdSidenav','$mdMenu','$state',
		'SalesOrderService', 
		function($scope,$rootScope,$timeout, $mdSidenav,$mdMenu, $state, SalesOrderService) {
		
		$scope.shipToArray = [
			{"label":"3000 - Smith Inc. LLC", value: "3000"}
		];

		$scope.soldToArray = [
			{"label":"3000 - Smith Inc. LLC", value: "3000"}
		];

		$scope.payerArray = [
			{"label":"3050 - Bush Holdings, Inc.", value: "3050"}
		];

		$scope.organizationArray = [
			{"label":"3000 - USA Philadelphia", value: "3000"}
		];

		$scope.channelArray = [
			{"label":"10 - Final customer sales", value: "10"}
		];

		$scope.divisionArray = [
			{"label":"00 - Cross-division ", value: "00"}
		];

		$scope.officeArray = [
			{"label":"3010 - Office Chicago", value: "3010"}
		];

		$scope.groupArray = [
			{"label":"311 - Group C1", value: "311"}
		];

		$scope.shipToSelected = "";
		$scope.shipTo2Selected = "";
		$scope.soldToSelected = "";
		$scope.payerSelected = "";
		$scope.organizarionSelected = "";
		$scope.channelSelected = "";
		$scope.divisionSelected = "";
		$scope.officeSelected = "";
		$scope.groupSelected = "";
		$scope.multiplier = 10;
		$scope.materialCatalog = [];
		$scope.log = "";

		function getExecutionTimeBetween2Dates(a, b){

		    // make checks to make sure a and b are not null
		    // and that they are date | integers types

		    diff = Math.abs(a - b);

		    ms = diff % 1000;
		    diff = (diff - ms) / 1000
		    ss = diff % 60;
		    diff = (diff - ss) / 60
		    mm = diff % 60;
		    diff = (diff - mm) / 60
		    hh = diff % 24;
		    days = (diff - hh) / 24

		    return "Execution time " + hh+"."+mm+"."+ss+"."+ms+" hrs.min.sec.msec";

		}

		$scope.changeShipTo = function(item){
			if(item != ""){
				var endpoint = "Meister.Demo.Po.Mat.Catalog";
				var json = '{"VENDOR":"' + item + '","PLANT":"' + item + '","PURORG":"' + item + '"}';
				$scope.log = "Executing Get Catalog<br/>" + $scope.log;
				var start = new Date();
				$scope.materialCatalogProgress = SalesOrderService.execute(endpoint, json);
				$scope.materialCatalogProgress.then(
		          function(result) { 
		          	var end = new Date();
		          	console.log("SalesOrderService.execute result",result);		        	  
		          	$scope.log = "Completed Get Catalog<br/>" + $scope.log;
		          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
		          	$scope.materialCatalog = result.data.Json;
		     	  },
		          function(errorPayload) {
		              console.log('SalesOrderService.execute failure', errorPayload);
		          }
		     	);
			}
		};

		
	}]);
})(meister);