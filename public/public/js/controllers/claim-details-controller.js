(function(app) {
	app.controller('ClaimDetailsController', ['$scope','$timeout','$mdSidenav','$state','$mdMenu','$mdDialog','$stateParams','ClaimsService', 
		function($scope,$timeout, $mdSidenav,$state, $mdMenu,$mdDialog, $stateParams, ClaimsService) {
		


		$scope.claim = {};
		$scope.tabSelected = 1;
		$scope.is_simulated = false;

		$scope.costs = [{item_no:1,category:"M",cost:"000027",plant:"3000",price:"1034"},{item_no:1,category:"M",cost:"000027",plant:"3000",price:"1034"},{item_no:1,category:"M",cost:"000027",plant:"3000",price:"1034"}];

		$scope.budgets = [
			{wbs:"123",items:[{item_no:1,category:"M",cost:"000027",plant:"3000",price:"1034"},{item_no:1,category:"M",cost:"000027",plant:"3000",price:"1034"},{item_no:1,category:"M",cost:"000027",plant:"3000",price:"1034"}]},
			{wbs:"143",items:[{item_no:1,category:"M",cost:"000027",plant:"3000",price:"1034"},{item_no:1,category:"M",cost:"000027",plant:"3000",price:"1034"},{item_no:1,category:"M",cost:"000027",plant:"3000",price:"1034"}]},
			{wbs:"566",items:[{item_no:1,category:"M",cost:"000027",plant:"3000",price:"1034"},{item_no:1,category:"M",cost:"000027",plant:"3000",price:"1034"},{item_no:1,category:"M",cost:"000027",plant:"3000",price:"1034"}]}	
			];

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

		$scope.simulate = function(){
			$scope.is_simulated = true;
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