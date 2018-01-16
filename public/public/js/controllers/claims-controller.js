(function(app) {
	app.controller('ClaimsController', ['$scope','$timeout','$mdSidenav','$mdMenu','$state','$mdDialog','ClaimsService', 
		function($scope,$timeout, $mdSidenav, $mdMenu,$state, $mdDialog, ClaimsService) {
		$scope.toggleLeft = buildToggler('left');
    	$scope.toggleRight = buildToggler('right');
    	$scope.claims = [];	
    	$scope.claims_details = [];
    	$scope.total = null;
    	$scope.selected = [];

    	function buildToggler(componentId) {
	      return function() {
	        $mdSidenav(componentId).toggle();
	      };
	    }

	    $scope.gotoClaimDetails = function(claim){
	    	if(claim.ACCEPTED != 0)
	    		$state.go('claim-details',{claimno:claim.CLAIM});
	    };

	    $scope.init = function(){
	    	$scope.promise1 = ClaimsService.getList();
	    	$scope.promise2 = ClaimsService.getListDetails();

	    	$scope.promise1.then(
		          function(result) { 
		              console.log("ClaimsService.getList",result);
			    		$scope.total = result.data.total;
			    		$scope.claims = result.data.data;
		          },
		          function(errorPayload) {
		              console.log('failure loading claims', errorPayload);
		          }
		     );
	    	
	    	$scope.promise2.then(
		          function(result) { 
		              console.log("ClaimsService.getListDetails",result);
		    			$scope.claims_details = result.data.data;
		          },
		          function(errorPayload) {
		              console.log('failure loading claims details', errorPayload);
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
