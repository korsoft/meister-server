(function(app) {
	app.controller('ClaimsController', ['$scope','$timeout','$mdSidenav','$mdMedia','$mdMenu','$state','$stateParams','$mdDialog','ClaimsService', 
		function($scope,$timeout, $mdSidenav, $mdMedia, $mdMenu,$state, $stateParams, $mdDialog, ClaimsService) {
		$scope.toggleLeft = buildToggler('left');
    	$scope.toggleRight = buildToggler('right');
    	$scope.claims = [];	
    	$scope.claims_details = [];
    	$scope.total = null;
    	$scope.selected = [];

    	$scope.isMobileDevice = $mdMedia('xs');

    	function buildToggler(componentId) {
	      return function() {
	        $mdSidenav(componentId).toggle();
	      };
	    }

	    $scope.gotoClaimDetails = function(claim){
	    	if(claim.ACCEPTED != 0)
	    		$state.go('claim-details',{claimno:claim.CLAIM});
	    };

	    $scope.init = function(filterBySelected){

	    	console.log("init",filterBySelected);
	    	console.log("params",$stateParams);

	    	$scope.total = null;
	    	$scope.claims = [];
	    	$scope.claims_details = [];

	    	$scope.promise1 = ClaimsService.getList();
	    	$scope.promise2 = ClaimsService.getListDetails();

	    	var filters = [];

	    	if(filterBySelected && $scope.selected.length>0){
	    		filters = angular.copy($scope.selected);
	    		$scope.selected = [];
	    	} 


	    	$scope.promise1.then(
		          function(result) { 
		              console.log("ClaimsService.getList",result);
			    		
			    		_.forEach(result.data.data, function(item){
			    			if(filters.length>0){
			    				var item_found = _.find(filters, function(s){
			    					return s.WBS == item.WBS;
			    				});
			    				if(item_found)
			    					result.data.total -= item.total;
			    				else
			    					$scope.claims.push(item);
			    			} else if($stateParams.filters.length>0){
			    				var item_found = _.find($stateParams.filters, function(s){
			    					return s.APPRAISAL.WBS == item.WBS;
			    				});
			    				if(item_found)
			    					result.data.total -= item.total;
			    				else
			    					$scope.claims.push(item);
			    			} else {
			    				$scope.claims.push(item);
			    			}
			    		});
			    		$scope.total = result.data.total;
		          },
		          function(errorPayload) {
		              console.log('failure loading claims', errorPayload);
		          }
		     );
	    	
	    	$scope.promise2.then(
		          function(result) { 
		              console.log("ClaimsService.getListDetails",result);
		              	_.forEach(result.data.data, function(item){
		              		if(filters.length>0){
		              			var item_found = _.find(filters, function(s){
			    					return s.WBS == item.WBS;
			    				});
			    				if(!item_found)
			    					$scope.claims_details.push(item);
		              		} else if($stateParams.filters.length>0){
		              			var item_found = _.find($stateParams.filters, function(s){
			    					return s.APPRAISAL.WBS == item.WBS;
			    				});
			    				if(!item_found)
			    					$scope.claims_details.push(item);
		              		} else {
		              			$scope.claims_details.push(item);
		              		}
		              	});
		          },
		          function(errorPayload) {
		              console.log('failure loading claims details', errorPayload);
		          }
			);
	    };

	    
	    $scope.showDetails = function(claim){
	    	console.log("showDetails",claim);
	    	/*_.forEach($scope.claims_details,function(item){
	    		item.$showTooltip = false;
	    	});*/

	    	claim.$showTooltip = true;
	    };

	    $scope.hideDetails = function(claim){
	    	console.log("hideDetails",claim);
	    	claim.$showTooltip = false;
	    };

	    $scope.showDetails2 = function(claim){
	    	console.log("showDetails",claim);
	    	/*_.forEach($scope.claims_details,function(item){
	    		item.$showTooltip = false;
	    	});*/
	    	
	    	claim.$showTooltip2 = true;
	    };

	    $scope.hideDetails2 = function(claim){
	    	console.log("hideDetails",claim);
	    	claim.$showTooltip2 = false;
	    };

	    $scope.aproveConfirm = function(ev){
	    	console.log("Approve items selected",$scope.selected);
	    	var textContent = '';
	    	var claims_no = [];
	    	_.forEach($scope.selected,function(item){
	    		claims_no.push(item.CLAIM);
	    		textContent += "Claim " + item.CLAIM + " on WBS " + item.WBS + " for amount $" + item.ACCEPTED.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "<br/>";
	    	});
			var confirm = $mdDialog.confirm()
	          .title('You are about to Approve the following')
	          .htmlContent(textContent)
	          .targetEvent(ev)
	          .ok('Aprove')
	          .cancel('cancel');

		    $mdDialog.show(confirm).then(function() {
		       $scope.aprove(ev, claims_no);
		    }, function() {
		      $scope.status = 'You decided to keep your debt.';
		    });
		};

		$scope.aprove = function(ev, claims_no){
			$scope.promise3 = ClaimsService.approve(claims_no);
	    	
	    	$scope.promise3.then(
		          function(result) { 
		          	  console.log("ClaimsService.approve",result);
		     			$mdDialog.show(
					      $mdDialog.alert()
					        .parent(angular.element(document.querySelector('#popupContainer')))
					        .clickOutsideToClose(true)
					        .title('Successful')
					        .textContent('Selected Claims are Approved')
					        .ok('Ok')
					        .targetEvent(ev)
					    ).then(function(){
					    	$scope.init(true);
					    });

		     	  },
		          function(errorPayload) {
		              console.log('failure loading claim simulate', errorPayload);
		          }
		     );

		    
		};

	}]);
})(meister);
