(function(app) {
	app.controller('HomeController', ['$scope','$rootScope','$timeout','$mdSidenav','$mdMenu','$state','$mdMedia', 
		function($scope,$rootScope,$timeout, $mdSidenav,$mdMenu, $state,  $mdMedia) {
		$scope.toggleLeft = buildToggler('left');
    	$scope.toggleRight = buildToggler('right');

    	$scope.isMobileDevice = $mdMedia('xs');
    	$scope.isTabletDevice = $mdMedia('sm');
    	$scope.isDesktop = $mdMedia('gt-sm');
    	
	    function buildToggler(componentId) {
	      return function() {
	        $mdSidenav(componentId).toggle();
	      };
	    }

	    $rootScope.gotoHome = function(){
	    	$rootScope.transition = 'fade-in';
	    	$state.go('home');
	    };

	    $rootScope.gotoClaims = function(){
	    	$state.go('claims');
	    };

	    $rootScope.gotoSalesOrder = function(){
	    	$state.go('sales_order');
	    };

	    $rootScope.gotoPurchaseOrder = function(){
	    	$state.go('purchase_order');
	    };

	    $rootScope.gotoMainReports = function(){
	    	$state.go('reports');
	    };

	     $rootScope.openMenu = function($mdOpenMenu,ev) {
		      $mdOpenMenu(ev);
		 };

	    $rootScope.transition = 'fade-in';
	}]);
})(meister);
