(function(app) {
	app.factory('apiUtils',
    ['$http','SERVER_BASE_URL',
    function ($http, SERVER_BASE_URL) {
       
        var API_BASE_URL = SERVER_BASE_URL;
		
		var METHOD_GET = 'GET';
		var METHOD_POST = 'POST';
		var METHOD_PUT = 'PUT';
		var METHOD_DELETE = 'DELETE';

        var prepareRequest = function(method, path, params, data){
			var req = {};
			req.method = method;
			req.url = API_BASE_URL + path;

			req.params = params || {};

			if (data){
				req.data = data;
			}

			return req;
		};

	var apiUtils = {};

	apiUtils.get = function(path, params, cb){
		var req = prepareRequest(METHOD_GET, path, params, null);

		$http(req)
			.then(function onSuccess(response){
				cb(null, response.data);
			}, function onError(response){
				cb(response, null);
			});
	};

	apiUtils.post = function(path, data, cb){
		var req = prepareRequest(METHOD_POST, path, null, data);

		$http(req)
			.then(function onSuccess(response){
				cb(null, response.data);
			}, function onError(response){
				cb(response, null);
			});
	};

	apiUtils.put = function(path, data, cb){
		var req = prepareRequest(METHOD_PUT, path, null, data);

		$http(req)
			.then(function onSuccess(response){
				cb(null, response.data);
			}, function onError(response){
				cb(response, null);
			});
	};

	apiUtils.del = function(path, params, cb){
		var req = prepareRequest(METHOD_DELETE, path, params, cb);

		$http(req)
			.then(function onSuccess(response){
				cb(null, response.data);
			}, function onError(response){
				cb(response, null);
			});
	};
 

    return apiUtils;
    }]);
})(meister);
