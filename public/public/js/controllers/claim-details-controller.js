(function(app) {
	app.controller('ClaimDetailsController', ['$scope','$timeout','$mdSidenav','$state','$mdMenu','$mdDialog','$stateParams','ClaimsService', 
		function($scope,$timeout, $mdSidenav,$state, $mdMenu,$mdDialog, $stateParams, ClaimsService) {
		


		$scope.claim = {};
		$scope.tabSelected = 1;
		$scope.is_simulated = false;
		$scope.simulations = [];

		$scope.init = function(){
			console.log($stateParams);
			$scope.promise = ClaimsService.getDetails($stateParams.claimno);
	    	
	    	$scope.promise.then(
		          function(result) { 
		              console.log("ClaimsService.getDetails",result);
			    		$scope.claim = result.data;
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
		              if(result.data && result.data.length>0)
			    		$scope.simulations = result.data[0];
		          },
		          function(errorPayload) {
		              console.log('failure loading claim simulate', errorPayload);
		          }
		     );
		};

		$scope.aproveConfirm = function(ev){
			var confirm = $mdDialog.confirm()
	          .title('You are about to Approve the following')
	          .textContent('You are about to Approve Claim No 000400000105')
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
			$mdDialog.show(
		      $mdDialog.alert()
		        .parent(angular.element(document.querySelector('#popupContainer')))
		        .clickOutsideToClose(true)
		        .title('Successful')
		        .textContent('Claim 000400000105 is Approved')
		        .ok('Ok')
		        .targetEvent(ev)
		    ).then(function(){
		    	$state.go('claims');
		    });
		    
		};
	}]);
})(meister);