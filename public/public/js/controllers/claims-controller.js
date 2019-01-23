(function(app) {
	app.controller('ClaimsController', ['$scope','$rootScope','$timeout','$mdSidenav','$mdMedia','$mdMenu','$state','$stateParams','$mdDialog','ClaimsService', 
		function($scope, $rootScope, $timeout, $mdSidenav, $mdMedia, $mdMenu,$state, $stateParams, $mdDialog, ClaimsService) {
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

	    	if(filterBySelected && $scope.selected.length>0){
	    		var f = angular.copy($scope.selected);
	    		_.forEach(f, function(i){
	    			$rootScope.filters.push(i);
	    		});
	    		$scope.selected = [];
	    	} 
	    	if($stateParams.filters.length>0){
	    		_.forEach($stateParams.filters,function(i){
	    			$rootScope.stateParamFilters.push(i);
	    		});
	    	}

	    	console.log("filtersByAprove",$rootScope.filters);
	    	console.log("filtersByAproveOnDetails",$rootScope.stateParamFilters);

	    	$scope.promise1.then(
		          function(result) { 
		              console.log("ClaimsService.getList",result);
		              
			    		_.forEach(result.data.data, function(item){
		              		
	              			var item_found_by_filter = _.filter($rootScope.filters, function(s){
		    					return s.WBS == item.WBS;
		    				});
			    			
		              		var item_found_by_state_param_filter = _.filter($rootScope.stateParamFilters, function(s){
		    					return s.APPRAISAL.WBS == item.WBS;
		    				});

		    				if(item_found_by_filter.length>0 || item_found_by_state_param_filter.length>0){
		    					console.log(item_found_by_state_param_filter);
		    					result.data.total -= (item_found_by_filter.length + item_found_by_state_param_filter.length);
				    			item.total -= (item_found_by_filter.length + item_found_by_state_param_filter.length);
		    				}
		              	});
			    		_.forEach(result.data.data, function(item){
			    			if(item.total > 0){
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
		              		
	              			var item_found_by_filter = _.find($rootScope.filters, function(s){
		    					return s.CLAIM == item.CLAIM;
		    				});
			    			
		              		var item_found_by_state_param_filter = _.find($rootScope.stateParamFilters, function(s){
		    					return s.CLAIM == item.CLAIM;
		    				});

		    				if(!item_found_by_filter && !item_found_by_state_param_filter)
		    					$scope.claims_details.push(item);
	              		 
		              	});
		          },
		          function(errorPayload) {
		              console.log('failure loading claims details', errorPayload);
		          }
			);
	    };

	    
	    $scope.showDetails = function(claim){
	    	/*_.forEach($scope.claims_details,function(item){
	    		item.$showTooltip = false;
	    	});*/

	    	claim.$showTooltip = true;
	    };

	    $scope.hideDetails = function(claim){
	    	claim.$showTooltip = false;
	    };

	    $scope.showDetails2 = function(claim){
	    	/*_.forEach($scope.claims_details,function(item){
	    		item.$showTooltip = false;
	    	});*/
	    	
	    	claim.$showTooltip2 = true;
	    };

	    $scope.hideDetails2 = function(claim){
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
