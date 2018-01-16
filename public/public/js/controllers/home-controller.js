(function(app) {
	app.controller('HomeController', ['$scope','$rootScope','$timeout','$mdSidenav','$mdMenu','$state', 
		function($scope,$rootScope,$timeout, $mdSidenav,$mdMenu, $state) {
		$scope.toggleLeft = buildToggler('left');
    	$scope.toggleRight = buildToggler('right');
    	
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

	     $rootScope.openMenu = function($mdOpenMenu,ev) {
		      $mdOpenMenu(ev);
		 };

	    $rootScope.transition = 'fade-in';
	}]);
})(meister);
