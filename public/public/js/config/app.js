var meister = angular.module('meister', ['ngMaterial', 'ngAnimate', 'ngMessages', 'ngAria', 'ui.router','ngCookies','md.data.table']);

meister.constant('SERVER_BASE_URL', "http://localhost:8000/api");

(function(app) {
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');

        $stateProvider.state('login', {
		url: '/login',
		templateUrl: 'partials/login-partial.html',
		controller: 'LoginController'
	})

	.state('home', {
            url: '/',
            templateUrl: 'partials/home-partial.html',
            controller: 'HomeController'
        })

        .state('about', {
            url: '/about',
            templateUrl: 'partials/about-partial.html',
            controller: 'AboutController'
        })
        .state('claims', {
            url: '/claims',
            templateUrl: 'partials/claims-partial.html',
            controller: 'ClaimsController'
        })
        .state('claim-details', {
            url: '/claims-details',
            templateUrl: 'partials/claim-details-partial.html',
            controller: 'ClaimDetailsController'
        });

    }]).run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/');
            }
        });
    }]);
})(meister);