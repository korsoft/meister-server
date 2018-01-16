(function(app) {
	app.factory('ClaimsService',
    ['apiUtils',
    function (apiUtils) {
        var service = {};

        service.getList = function (cb) {
            apiUtils.get('/claims', {}, cb);
        };
 

        return service;
    }]);
})(meister);