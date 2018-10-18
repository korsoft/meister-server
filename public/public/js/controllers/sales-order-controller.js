(function(app) {
	app.controller('SalesOrderController', ['$scope','$rootScope','$timeout','$filter','$mdSidenav','$mdMenu','$mdMedia','$state',
		'$mdDialog',
		'SalesOrderService', 
		function($scope,$rootScope,$timeout, $filter, $mdSidenav,$mdMenu, $mdMedia, $state, $mdDialog, SalesOrderService) {
		
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
		$scope.salesHistory = [];
		$scope.salesMaterial = [];
		$scope.salesMaterialPage = [];
		$scope.salesHistorySelected = [];
		$scope.salesMaterialSelected = [];
		$scope.analytics = null;
		$scope.hiddenMaterial = false;
		$scope.hiddenATP = false;
		$scope.hiddenNotes = false;
		$scope.note = {
			type: "HDR",
			text: "",
			title: "Add Note",
			lineNumber:1
		};
		var ROW_BY_PAGE = 50;

		$scope.isMobileDevice = $mdMedia('xs');
		$scope.collapseParterInfo = true;
		$scope.collapseSalesSelection = true;
		$scope.dataForGraphicReport = [];
		$scope.labelsForGraphicReport = [];

		$scope.chartOptions = {
			scales: {
				yAxes: [
		        {
		            ticks: {
		                callback: function(label, index, labels) {
		                	//console.log("chartOptions ticks",label);
		                    return $filter('currency')(label, "$", 0);
		                }
		            }
		        }
		    	]
        	}
		};
		

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

			$scope.getSalesPartner();
			$scope.calculateAnalytics();
		};

		$scope.saveNote = function(ev){
			
			var endpoint = "";
			var json = "";
			
			if($scope.note.type == "HDR"){
				endpoint = "Meister.Demo.PP.Hrd.Notes";
				json = '{"ORDERNO":"' + $scope.orderSelected + '","NOTES":[{"TEXT":"' 
				+ $scope.note.text + '"}]}';
			} else if($scope.note.type == "LINE"){
				endpoint = "Meister.Demo.PP.Line.Notes";
				json = '{"ORDERNO":"' + $scope.orderSelected + '","LINE_ITEM":"' 
				+ $scope.note.lineNumber + '","NOTES":[{"TEXT":"' + $scope.note.text + '"}]}';
			}

			
			console.log("endpoint",endpoint);
			console.log("json",json);

			$scope.log = "Executing Save Note<br/>" + $scope.log;
			var start = new Date();
			$scope.addNoteProgress = SalesOrderService.execute(endpoint, json);
			$scope.addNoteProgress.then(
		          function(result) { 
		          	var end = new Date();
		          	console.log("SaveNote result",result);		        	  
		          	$scope.log = "Completed Save Note<br/>" + $scope.log;
		          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
		          	$scope.note = {
						type: "HDR",
						text: "",
						lineNumber:1
					};
					$scope.getListNotesByOrder();
					var alert = $mdDialog.alert({
				        title: 'Note Added',
				        textContent: 'The note was added successful',
				        ok: 'OK'
				      });
					$mdDialog
				        .show( alert )
				        .finally(function() {
				          alert = undefined;
				        });
		     	  },
		          function(errorPayload) {
		          	console.log('SalesOrderService.execute failure', errorPayload);
		          }
		     	);
		};

		$scope.addLines = function(){
			$scope.salesOrder = [];
			var endpoint = "Meister.Demo.RL.SD.Update";
			$scope.disableAddLines = true;
			var json = '{"ORDERNO":"'+  $scope.orderSelected + '","REPEAT":"' + $scope.multiplier + 
				'","MATERIAL":"' + $scope.materialSelected[0].MATERIAL + 
				'","QTY":"1","UOM":"'+ $scope.materialSelected[0].UOM+'"}';
				console.log("endpoint",endpoint);
				console.log("json",json);

				$scope.log = "Executing Add Lines Operation<br/>" + $scope.log;
				var start = new Date();
				$scope.addLinesProgress = SalesOrderService.execute(endpoint, json);
				$scope.addLinesProgress.then(
		          function(result) { 
		          	$scope.disableAddLines = false;
		          	var end = new Date();
		          	console.log("SalesOrderService.execute result",result);		        	  
		          	$scope.log = "Completed Add Lines Operation<br/>" + $scope.log;
		          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
		          	$scope.changeOrder($scope.orderSelected);
		     	  },
		          function(errorPayload) {
		          	$scope.disableAddLines = false;
		              console.log('SalesOrderService.execute failure', errorPayload);
		          }
		     	);
		};

		$scope.formatStandardDeviation = function(sd){
			if(!sd)
				return "";
			return sd.substring(0,2) + "." + sd.substring(2,4) + "%";
		};

		$scope.onSelectMaterialRow = function(){
			console.log("onSelectMaterialRow",$scope.materialSelected);
			$scope.calculateATS();
			$scope.getSalesPartner();
		};

		$scope.notesFilter = function(n){
			if($scope.salesOrderSelected.length==0)
				return n.LINE == "HDR";
			else
		      	return Number(n.LINE) == Number($scope.salesOrderSelected[0].line_no);
		    
		};

		$scope.onSelectSalesOrderRow = function(){
			console.log("onSelectSalesOrderRow",$scope.salesOrderSelected);
		};

		$scope.hideMaterials = function(){
			$scope.hiddenMaterial = true;
		};

		$scope.showMaterials = function(){
			$scope.hiddenMaterial = false;
		};

		$scope.calculateAnalytics = function(){
			$scope.analytics = null;
			console.log("calculateAnalytics...");
			if($scope.shipToSelected && $scope.shipTo2Selected && $scope.soldToSelected && $scope.payerSelected &&
			 	$scope.organizationSelected && $scope.channelSelected && $scope.divisionSelected && $scope.officeSelected 
			 	&& $scope.groupSelected && $scope.tabSelected == 3){
				
				var endpoint = "Meister.Demo.RL.Analytics";
				var json = '{"SALESORG":"' + $scope.organizationSelected + 
					'","CHANNEL":"' + $scope.channelSelected + '","DIVISION":"' + $scope.divisionSelected + 
					'","SALESGRP":"' + $scope.groupSelected + '","OFFICE":"' + $scope.officeSelected + 
					'","SOLDTO":"' + $scope.soldToSelected + '"}';
					console.log("endpoint",endpoint);
					console.log("json",json);

					$scope.log = "Executing Calulate Analytics<br/>" + $scope.log;
					var start = new Date();
					$scope.calculateAnalyticsProgress = SalesOrderService.execute(endpoint, json);
					$scope.calculateAnalyticsProgress.then(
			          function(result) { 
			          	var end = new Date();
			          	console.log("calculateAnalytics result",result);		        	  
			          	$scope.log = "Completed Calculate Analytics<br/>" + $scope.log;
			          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
			          	$scope.analytics =  result.data.Json[0];
			          	console.log("Analytics",$scope.analytics);
			     	  },
			          function(errorPayload) {
			              console.log('SalesOrderService.execute failure', errorPayload);
			          }
			     	);
			}
		};

		$scope.getListNotesByOrder = function(){
			console.log("Calculate getListNotesByOrder",$scope.orderSelected);
			$scope.notes = [];
			var endpoint = "Meister.Demo.PP.Read.Notes";
			var json = '{"ORDERNO":"'+ $scope.orderSelected +'"}';
			console.log("endpoint",endpoint);
			console.log("json",json);

			$scope.log = "Executing Read Notes<br/>" + $scope.log;
				var start = new Date();
				$scope.getListNotesProgress = SalesOrderService.execute(endpoint, json);
				$scope.getListNotesProgress.then(
		          function(result2) { 
		          	var end = new Date();
		          	console.log("getListNotesByOrder result",result2);		        	  
		          	$scope.log = "Completed Read Notes<br/>" + $scope.log;
		          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
		          	$scope.notes = result2.data.Json
		          	console.log("notes",$scope.notes);
		     	  },
		          function(errorPayload) {
		              console.log('SalesOrderService.execute failure', errorPayload);
		          }
		     	);
		};

		$scope.changeGeneric = function(){
			if($scope.salesHistory.length==0)
				$scope.getSalesPartner();

			if($scope.analytics == null)
				$scope.calculateAnalytics();
		};

		$scope.onSalesHistorySelected = function(){
			console.log("onSalesHistorySelected",$scope.salesHistorySelected);
		};

		$scope.getSalesPartner = function(){
			console.log("getSalesPartner...");
			$scope.salesHistory = [];
			$scope.salesHistorySelected = [];
			$scope.dataForGraphicReport = [];
			$scope.labelsForGraphicReport = [];
			if($scope.shipToSelected && $scope.shipTo2Selected && $scope.soldToSelected && $scope.payerSelected &&
			 	$scope.organizationSelected && $scope.channelSelected && $scope.divisionSelected && $scope.officeSelected 
			 	&& $scope.groupSelected){
				
				var endpoint = "Meister.Demo.RL.Sales.History";
				var json = '{"SALESORG":"' + $scope.organizationSelected + 
					'","CHANNEL":"' + $scope.channelSelected + '","DIVISION":"' + $scope.divisionSelected + 
					'","SALESGRP":"' + $scope.groupSelected + '","OFFICE":"' + $scope.officeSelected + 
					'","SOLDTO":"' + $scope.soldToSelected + '"}';
					console.log("endpoint",endpoint);
					console.log("json",json);

					$scope.log = "Executing Get Sales History Operation<br/>" + $scope.log;
					var start = new Date();
					$scope.salesPartnerProgress = SalesOrderService.execute(endpoint, json);
					$scope.salesPartnerProgress.then(
			          function(result) { 
			          	var end = new Date();
			          	console.log("Meister.Demo.RL.Sales.History result",result);		        	  
			          	$scope.log = "Completed Sales History<br/>" + $scope.log;
			          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
			          	$scope.salesHistory = result.data.Json[0].HISTORY;
			          	var report = SalesOrderService.buildSalesHistoryDataForGraphicReports($scope.salesHistory);
			          	console.log("report",report);
			          	$scope.dataForGraphicReport = report.data;
			          	$scope.labelsForGraphicReport = report.labels;
			          	console.log("Histories",$scope.salesHistory);
			          	console.log("dataForGraphicReport",$scope.dataForGraphicReport);
			     	  },
			          function(errorPayload) {
			              console.log('SalesOrderService.execute failure', errorPayload);
			          }
			     	);
			}
		};

		$scope.showAddNote = function(ev){
			if($scope.salesOrderSelected.length>0){
				$scope.note.type = "LINE";
				$scope.note.lineNumber = $scope.salesOrderSelected[0].line_no;
				$scope.note.title = "Adding Notes to Line Item " + $scope.salesOrderSelected[0].line_no;
			}
			else {
				$scope.note.type = "HDR";
				$scope.note.title = "Adding Header notes";
			}

			 $mdDialog.show({
			      contentElement: '#addNoteDialog',
			      parent: angular.element(document.querySelector('#tablesContainerMain')),
			      targetEvent: ev,
			      clickOutsideToClose: true
			    });
		};

		$scope.showAtpDialog = function(ev){
			$mdDialog.show({
			      contentElement: '#atpContainer',
			      parent: angular.element(document.querySelector('#tablesContainerMain')),
			      targetEvent: ev,
			      clickOutsideToClose: true
			    });
		};

		$scope.showPartnerInfo = function(){
			console.log("showPartnerInfo...");
			$scope.hiddenPartnerInfo = false;
		};

		$scope.hidePartnerInfo = function(){
			console.log("hidePartnerInfo...");
			$scope.hiddenPartnerInfo = true;
		};

		$scope.calculateATS = function(){
			console.log("Calculate ATS",$scope.materialSelected[0]);
			$scope.salesMaterial = [];
			$scope.salesMaterialPage = [];
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
		          	console.log("calculateATS result",result);		        	  
		          	$scope.log = "Completed Calculate ATS<br/>" + $scope.log;
		          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
		          	$scope.ats = result.data.Json[0].DETAILS[0].DETAIL;
		          	$scope.salesMaterial = result.data.Json[0].DETAILS[0].MRP;
		          	console.log("ats",$scope.ats);
		     	  },
		          function(errorPayload) {
		              console.log('SalesOrderService.execute failure', errorPayload);
		          }
		     	);
		};

		$scope.showLogs = function(ev){
			 $mdDialog.show({
			      contentElement: '#myDialog',
			      parent: angular.element(document.querySelector('#tablesContainerMain')),
			      targetEvent: ev,
			      clickOutsideToClose: true
			    });
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
		          	$scope.disableAddLines = false;
		          	console.log("SalesOrderService.execute result",result);		        	  
		          	$scope.log = "Completed Read SO<br/>" + $scope.log;
		          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
		          	$scope.salesOrder = result.data.Json[0].lineitem;
		          	
		     	  },
		          function(errorPayload) {
		          	$scope.disableAddLines = false;
		              console.log('SalesOrderService.execute failure', errorPayload);
		          }
		     	);
			}
		};
		
	}]);
})(meister);