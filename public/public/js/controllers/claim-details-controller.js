(function(app) {
	app.controller('ClaimDetailsController', ['$scope','$timeout','$mdSidenav','$state','$mdMedia','$mdMenu','$mdDialog','$stateParams','ClaimsService', 
		function($scope,$timeout, $mdSidenav,$state, $mdMedia, $mdMenu,$mdDialog, $stateParams, ClaimsService) {
		


		$scope.claim = {};
		$scope.tabSelected = 1;
		$scope.is_simulated = false;
		$scope.simulations = [];

		$scope.isMobileDevice = $mdMedia('xs');

		$scope.init = function(){
			console.log($stateParams);
			$scope.promise = ClaimsService.getDetails($stateParams.claimno);
	    	
	    	$scope.promise.then(
		          function(result) { 
		              console.log("ClaimsService.getDetails",result);
			    		$scope.claim = result.data;
			    		if($scope.isMobileDevice){
			    			var budgets = [];
			    			_.forEach($scope.claim.BUDGETS, function(b){
			    				if(b.WBS_ELEMENT == $scope.claim.APPRAISAL.WBS)
			    					budgets.push(b);
			    			});
			    			$scope.claim.BUDGETS = budgets;
			    		}
		          },
		          function(errorPayload) {
		              console.log('failure loading claim details', errorPayload);
		          }
		     );
		}


		_.forEach($scope.budgets,function(b){
			b.$show = false;
		});	

		/*$scope.was_changed_it = function(index, budget){
			var $scope.claim.BUDGETS[index].COSTS
		};*/

		$scope.simulate = function(){
			$scope.promise2 = ClaimsService.simulate($stateParams.claimno);
	    	
	    	$scope.promise2.then(
		          function(result) { 
		          		$scope.is_simulated = true;
		              console.log("ClaimsService.simulate",result);
		              if(result.data && result.data.length>0){
			    		$scope.simulations = result.data[0];
				    	if($scope.isMobileDevice){
				    			var budgets = [];
				    			_.forEach($scope.simulations, function(b){
				    				if(b.WBS_ELEMENT == $scope.claim.APPRAISAL.WBS)
				    					budgets.push(b);
				    			});
				    			$scope.simulations = budgets;
				    		}
				    	}
		          },
		          function(errorPayload) {
		              console.log('failure loading claim simulate', errorPayload);
		          }
		     );
		};

		$scope.aproveConfirm = function(ev){
			var confirm = $mdDialog.confirm()
	          .title('You are about to Approve the following')
	          .textContent('You are about to Approve Claim No ' + $stateParams.claimno)
	          .targetEvent(ev)
	          .ok('Aprove')
	          .cancel('cancel');

		    $mdDialog.show(confirm).then(function() {
		       $scope.aprove(ev);
		    }, function() {
		      $scope.status = 'You decided to keep your debt.';
		    });
		};

		$scope.aprove = function(ev){
			var claims_no = [];
			claims_no.push($stateParams.claimno);
			$scope.promise3 = ClaimsService.approve(claims_no);
	    	
	    	$scope.promise3.then(
		          function(result) { 
		          	  console.log("ClaimsService.approve",result);
		     			$mdDialog.show(
					      $mdDialog.alert()
					        .parent(angular.element(document.querySelector('#popupContainer')))
					        .clickOutsideToClose(true)
					        .title('Successful')
					        .textContent('Claim ' + $stateParams.claimno + ' is Approved')
					        .ok('Ok')
					        .targetEvent(ev)
					    ).then(function(){
					    	$state.go('claims',{filters:[$scope.claim]});
					    });

		     	  },
		          function(errorPayload) {
		              console.log('failure loading claim simulate', errorPayload);
		          }
		     );

					    
		};
	}]);
})(meister);