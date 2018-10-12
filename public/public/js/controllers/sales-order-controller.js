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

		$scope.orderArray = [
			{"label":"20168", value: "20168"},
			{"label":"New SO", value: "NEW"}
		];

		$scope.shipToSelected = "";
		$scope.shipTo2Selected = "";
		$scope.soldToSelected = "";
		$scope.payerSelected = "";
		$scope.organizationSelected = "";
		$scope.channelSelected = "";
		$scope.divisionSelected = "";
		$scope.officeSelected = "";
		$scope.groupSelected = "";
		$scope.multiplier = 10;
		$scope.materialCatalog = [];
		$scope.salesOrder = [];
		$scope.log = "";
		$scope.materialSelected = [];
		$scope.salesOrderSelected = [];
		$scope.orderSelected = "0";
		$scope.tabSelected = 0;
		$scope.ats = {};
		$scope.notes = [];

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
			console.log("changeShipTo",item);
			if(item && item != ""){
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

		$scope.addLines = function(){
			$scope.salesOrder = [];
			var endpoint = "Meister.Demo.RL.SD.Update";
			var json = '{"ORDERNO":"'+  $scope.orderSelected + '","REPEAT":"' + $scope.multiplier + 
				'","MATERIAL":"' + $scope.materialSelected.MATERIAL + 
				'","QTY":"1","UOM":"'+ $scope.materialSelected.UOM+'"}';
				console.log("endpoint",endpoint);
				console.log("json",json);

				$scope.log = "Executing Add Lines Operation<br/>" + $scope.log;
				var start = new Date();
				$scope.readOrderProgress = SalesOrderService.execute(endpoint, json);
				$scope.readOrderProgress.then(
		          function(result) { 
		          	var end = new Date();
		          	console.log("SalesOrderService.execute result",result);		        	  
		          	$scope.log = "Completed Add Lines Operation<br/>" + $scope.log;
		          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
		          	$scope.changeOrder($scope.orderSelected);
		     	  },
		          function(errorPayload) {
		              console.log('SalesOrderService.execute failure', errorPayload);
		          }
		     	);
		};

		$scope.onSelectMaterialRow = function(){
			console.log("onSelectMaterialRow",$scope.materialSelected);
			$scope.calculateATS()
		};

		$scope.onSelectSalesOrderRow = function(){
			console.log("onSelectSalesOrderRow",$scope.salesOrderSelected);
		};

		$scope.getListNotesByOrder = function(){
			console.log("Calculate getListNotesByOrder",$scope.orderSelected);
			$scope.salesOrder = [];
			var endpoint = "Meister.Demo.PP.Read.Notes";
			var json = '{"ORDERNO":"'+ $scope.orderSelected +'"}';
			console.log("endpoint",endpoint);
			console.log("json",json);

			$scope.log = "Executing Read Notes<br/>" + $scope.log;
				var start = new Date();
				$scope.getListNotesProgress = SalesOrderService.execute(endpoint, json);
				$scope.getListNotesProgress.then(
		          function(result) { 
		          	var end = new Date();
		          	console.log("SalesOrderService.execute result",result);		        	  
		          	$scope.log = "Completed Read Notes<br/>" + $scope.log;
		          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
		          	$scope.notes = result.data.Json
		     	  },
		          function(errorPayload) {
		              console.log('SalesOrderService.execute failure', errorPayload);
		          }
		     	);
		};

		$scope.calculateATS = function(){
			console.log("Calculate ATS",$scope.materialSelected[0]);
			$scope.salesOrder = [];
			var endpoint = "Meister.Demo.RL.Stock";
			var json = '{"MATERIAL":"'+$scope.materialSelected[0].MATERIAL+'","PLANT":"'+$scope.materialSelected[0].PLANT+'"}';
				console.log("endpoint",endpoint);
				console.log("json",json);

				$scope.log = "Executing Calculate ATS<br/>" + $scope.log;
				var start = new Date();
				$scope.calculateATSProgress = SalesOrderService.execute(endpoint, json);
				$scope.calculateATSProgress.then(
		          function(result) { 
		          	var end = new Date();
		          	console.log("SalesOrderService.execute result",result);		        	  
		          	$scope.log = "Completed Calculate ATS<br/>" + $scope.log;
		          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
		          	$scope.ats = result.data.Json[0].DETAILS[0].DETAIL;
		          	console.log("ats",$scope.ats);
		     	  },
		          function(errorPayload) {
		              console.log('SalesOrderService.execute failure', errorPayload);
		          }
		     	);
		};

		$scope.changeOrder = function(order){
			console.log("Payer",$scope.payerSelected);
			if(order == '' || order == '0'){
				$scope.salesOrder = [];
				return;
			}
			if(order == "NEW"){ //crete a new order
				$scope.salesOrder = [];
				var endpoint = "Meister.Demo.RL.SD.New.Parked";
				var json = '{"DOCTYPE":"CM","SALESORG":"' + $scope.organizationSelected + 
					'","DIST":"' + $scope.channelSelected + '","DIVISION":"' + $scope.divisionSelected + 
					'","SALESGRP":"' + $scope.groupSelected + '","SALESOFF":"' + $scope.officeSelected + 
					'","SOLDTO":"' + $scope.soldToSelected + '","PAYER":"' + $scope.payerSelected + '"}';
				console.log("endpoint",endpoint);
				console.log("json",json);

				$scope.log = "Executing New SO<br/>" + $scope.log;
				var start = new Date();
				$scope.readOrderProgress = SalesOrderService.execute(endpoint, json);
				$scope.readOrderProgress.then(
		          function(result) { 
		          	var end = new Date();
		          	console.log("SalesOrderService.execute result",result);		        	  
		          	$scope.log = "Completed New SO<br/>" + $scope.log;
		          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
		          	var order_no = result.data.Json[0].ORDERNO;
		          	order_no = order_no.substring(order_no.length-5,order_no.length);
		          	$scope.orderArray.push({
		          		"label":order_no,
		          		"value":order_no
		          	});
		          	$scope.orderSelected = order_no;
		          	$scope.getListNotesByOrder();
		     	  },
		          function(errorPayload) {
		              console.log('SalesOrderService.execute failure', errorPayload);
		          }
		     	);
			} else { //load order selected
				$scope.getListNotesByOrder();
				var endpoint = "Meister.Demo.RL.SD.Read";
				var json = '{"ORDER":"' + order + '"}';
				$scope.log = "Executing Read SO<br/>" + $scope.log;
				var start = new Date();
				$scope.readOrderProgress = SalesOrderService.execute(endpoint, json);
				$scope.readOrderProgress.then(
		          function(result) { 
		          	var end = new Date();
		          	console.log("SalesOrderService.execute result",result);		        	  
		          	$scope.log = "Completed Read SO<br/>" + $scope.log;
		          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
		          	$scope.salesOrder = result.data.Json[0].lineitem;
		          	
		     	  },
		          function(errorPayload) {
		              console.log('SalesOrderService.execute failure', errorPayload);
		          }
		     	);
			}
		};
		
	}]);
})(meister);