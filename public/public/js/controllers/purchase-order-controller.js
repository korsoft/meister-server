(function(app) {
	app.controller('PurchaseOrderController', ['$scope','$rootScope','$timeout','$filter','$mdSidenav','$mdMenu','$mdMedia','$state',
		'$mdDialog',
		'SalesOrderService', 
		function($scope,$rootScope,$timeout, $filter, $mdSidenav,$mdMenu, $mdMedia, $state, $mdDialog, SalesOrderService) {
		
		$scope.vendorArray = [
			{label:"1000 - C.E.B. USA", value: "1000"}
		];

		$scope.purchasingOrganizationArray = [
			{label:"3000 - BestRun USA", value: "1000"}
		];

		$scope.plantArray = [
			{label:"3000 - Chicago Plant", value: "3000"}
		];

		$scope.purchasegroupArray = [
			{label:"3000 - BestRun, USA", value: "001"}
		];

		$scope.orderArray = [
			{"label":"4500022402", value: "4500022402"},
			{"label":"New PO", value: "NEW"}
		];

        $scope.vendorSelected = "";
		$scope.purchasingOrganizationSelected = "";
		$scope.purchasegroupSelected = "";
		$scope.plantSelected = "";
		$scope.multiplier = 10;
		$scope.materialCatalog = [];
		$scope.salesOrder = [];
		$scope.log = "";
		$scope.materialSelected = [];
		$scope.salesOrderSelected = [];
		$scope.orderSelected = null;
		$scope.tabSelected = 0;
		$scope.notes = [];
		$scope.salesHistory = [];
		$scope.salesHistorySelected = [];
		$scope.analytics = null;
		$scope.hiddenMaterial = false;
		$scope.hiddenNotes = false;
		$scope.note = {
			type: "HDR",
			text: "",
			title: "Add Note",
			lineNumber:1
		};
		var ROW_BY_PAGE = 50;

		$scope.salesHistoryQuery = {
			    order: 'po_number'
			  };
			  

		$scope.searchTextOrderNumber = "";

		$scope.querySearch = function(query) {
		      var results = query ? $scope.orderArray.filter( createFilterFor(query) ) : $scope.orderArray,
		          deferred;

		       if(results.length == 0){
		       	results.push({
		       		label:query,
		       		value:query
		       	});
		       }
		      return results;
		    }

		var createFilterFor = function(query) {
		  	return function filterFn(item) {
		        return (item.label.toLowerCase().includes(query.toLowerCase()));
		      };

		    }

		 

		$scope.isMobileDevice = $mdMedia('xs');
    	$scope.isTabletDevice = $mdMedia('md') || $mdMedia('sm');
    	$scope.isDesktop = $mdMedia('gt-md');
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

		$scope.loadMaterialCatalog = function(){
			console.log("loadMaterialCatalog");
			console.log("vendorSelected",$scope.vendorSelected);
			console.log("plantSelected",$scope.plantSelected);
			console.log("purchasingOrganizationSelected",$scope.purchasingOrganizationSelected);
			
			if(!$scope.vendorSelected || $scope.vendorSelected=="" || !$scope.plantSelected || $scope.plantSelected=="" 
				|| !$scope.purchasingOrganizationSelected || $scope.purchasingOrganizationSelected==""){
				$scope.materialCatalog = [];
				return;
			}
				
				var endpoint = "Meister.Demo.Po.Mat.Catalog";
				var json = '{"VENDOR":"' + $scope.vendorSelected + '","PLANT":"' + $scope.plantSelected 
					+ '","PURORG":"' + $scope.purchasingOrganizationSelected + '"}';
				$scope.log = "Executing Get Catalog<br/>" + $scope.log;
				var start = new Date();
				$scope.materialCatalogProgress = SalesOrderService.execute(endpoint, json);
				$scope.materialCatalogProgress.then(
		          function(result) { 
		          	var end = new Date();
		          	console.log("Vendor result",result);		        	  
		          	$scope.log = "Completed Get Catalog<br/>" + $scope.log;
		          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
		          	$scope.materialCatalog = result.data.Json;
		     	  },
		          function(errorPayload) {
		              console.log('SalesOrderService.execute failure', errorPayload);
		          }
		     	);
		};

		$scope.formatSORT_DATE = function(date){
			if(!date)
				return "";
			if(date.length != 8)
				return date;
			return date.substring(4,6) + "/" + date.substring(6,8) + "/" + date.substring(0,4);
		};

		$scope.saveNote = function(ev){
			
			var endpoint = "";
			var json = "";
			
			if($scope.note.type == "HDR"){
				endpoint = "Meister.Demo.Po.Header.Notes";
				json = '{"orderno":"' + $scope.orderSelected.value + '","notes":[{"TEXT":"' 
				+ $scope.note.text + '"}]}';
			} else if($scope.note.type == "LINE"){
				endpoint = "Meister.Demo.Po.Line.Notes";
				json = '{"ORDERNO":"' + $scope.orderSelected.value + '","LINE_ITEM":"' 
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
			var endpoint = "Meister.Demo.PO.Add.LineItems";
			$scope.disableAddLines = true;
			var json = '{"Number":"'+  $scope.orderSelected.value + '","repeat":"' + $scope.multiplier + 
				'","Lineitem":[{"line_no":"00010","material":"' + $scope.materialSelected[0].MATERIAL + 
				'","plant":"' + $scope.materialSelected[0].PLANT + '","qty":"'+Math.floor(Math.random() * 100)+'","price":"' + 
				$scope.materialSelected[0].PRICE + '"}]}';
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
		          	$scope.log = "Completed Add Lines PO<br/>" + $scope.log;
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
			$scope.getSalesPartner();
		};

		$scope.notesFilter = function(n){
			if($scope.salesOrderSelected.length==0)
				return n.LINE.substring(0,3) == "HDR";
			else
		      	return Number(n.LINE.substring(0,$scope.salesOrderSelected[0].line_no.length)) == Number($scope.salesOrderSelected[0].line_no);
		    
		};

		$scope.onSelectSalesOrderRow = function(){
			console.log("onSelectSalesOrderRow",$scope.salesOrderSelected);
			$scope.getListNotesByOrder();
		};

		$scope.hideMaterials = function(){
			$scope.hiddenMaterial = true;
		};

		$scope.showMaterials = function(){
			$scope.hiddenMaterial = false;
		};

		

		$scope.getListNotesByOrder = function(){
			console.log("Calculate getListNotesByOrder",$scope.orderSelected);
			$scope.notes = [];
			var endpoint = "Meister.Demo.PO.Notes.Read";
			var json = '{"ORDERNO":"'+ $scope.orderSelected.value +'"}';
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

			$scope.loadMaterialCatalog();

			if($scope.salesHistory.length==0)
				$scope.getSalesPartner();

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
			if($scope.vendorSelected){
				
				var endpoint = "Meister.Demo.PO.By.Vendor";
				var json = '{"VENDOR":"' + $scope.vendorSelected + '"}';
					console.log("endpoint",endpoint);
					console.log("json",json);

					$scope.log = "Executing Get PO by Vendor Operation<br/>" + $scope.log;
					var start = new Date();
					$scope.salesPartnerProgress = SalesOrderService.execute(endpoint, json);
					$scope.salesPartnerProgress.then(
			          function(result) { 
			          	var end = new Date();
			          	console.log("Meister.Demo.PO.By.Vendor result",result);		        	  
			          	$scope.log = "Completed PO by Vendor<br/>" + $scope.log;
			          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
			          	$scope.salesHistory = result.data.Json[0].po_hdrs;
			          	console.log("Histories",$scope.salesHistory);
			          	var report = SalesOrderService.buildPoByVendorDataForGraphicReports($scope.salesHistory);
			          	console.log("report",report);
			          	$scope.dataForGraphicReport = report.data;
			          	$scope.labelsForGraphicReport = report.labels;
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
			      targetEvent: ev,
			      clickOutsideToClose: true
			    });
			$timeout(function () {
				document.getElementById('add_note').focus();
			},1000);
			
		};

		$scope.showPartnerInfo = function(){
			console.log("showPartnerInfo...");
			$scope.hiddenPartnerInfo = false;
		};

		$scope.hidePartnerInfo = function(){
			console.log("hidePartnerInfo...");
			$scope.hiddenPartnerInfo = true;
		};

		$scope.showLogs = function(ev){
			 $mdDialog.show({
			      contentElement: '#myDialog',
			      targetEvent: ev,
			      clickOutsideToClose: true
			    });
		};

		$scope.changeOrder = function(order){
			console.log("Order",order);
			if(!order){
				$scope.salesOrder = [];
				return;
			}
			if(order.value == "NEW"){ //crete a new order
				$scope.salesOrder = [];
				var endpoint = "Meister.Demo.PO.New.OnHold";
				var json = '{"VENDOR":"' + $scope.vendorSelected + '","PURGRP":"' + $scope.purchasegroupSelected 
					+ '","PURORG":"' + $scope.purchasingOrganizationSelected + '"}';
				console.log("endpoint",endpoint);
				console.log("json",json);

				$scope.log = "Executing New SO<br/>" + $scope.log;
				var start = new Date();
				$scope.readOrderProgress = SalesOrderService.execute(endpoint, json);
				$scope.readOrderProgress.then(
		          function(result) { 
		          	var end = new Date();
		          	console.log("SalesOrderService.execute result",result);		        	  
		          	$scope.log = "Completed New PO<br/>" + $scope.log;
		          	$scope.log = getExecutionTimeBetween2Dates(start,end) + "<br/>" + $scope.log;
		          	var order_no = result.data.Json[0].NUMBER;
		          	//order_no = order_no.substring(order_no.length-5,order_no.length);
		          	var newItem = {
		          		"label":order_no,
		          		"value":order_no
		          	};
		          	$scope.orderArray.push(newItem);
		          	$scope.orderSelected = newItem;
		          	$scope.getListNotesByOrder();
		     	  },
		          function(errorPayload) {
		              console.log('SalesOrderService.execute failure', errorPayload);
		          }
		     	);
			} else { //load order selected
				$scope.getListNotesByOrder();
				var endpoint = "Meister.Demo.PO.Read";
				var json = '{"NUMBER":"' + order.value + '"}';
				$scope.log = "Executing Read SO<br/>" + $scope.log;
				var start = new Date();
				$scope.readOrderProgress = SalesOrderService.execute(endpoint, json);
				$scope.readOrderProgress.then(
		          function(result) { 
		          	var end = new Date();
		          	$scope.disableAddLines = false;
		          	console.log("SalesOrderService.execute result",result);		        	  
		          	$scope.log = "Completed Read PO<br/>" + $scope.log;
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