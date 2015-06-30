(function () {
	"use strict";

	angular.module("ASPO").factory("AspoService", ["$http", "$q", 
	function ($http, $q) {
	    var that = this;
	    var baseUrl = "api/";
		
		function getQuestions() {
	        var req = $http.get(baseUrl + "questions.json");

	        return req.then(_handleSuccess, _handleError);
	    }
		
		function sendData(answeredQuestions) {
			$http.post(baseUrl + "senData", answeredQuestions);
		}

	    // Return API
	    return ({
	        getQuestions: getQuestions,
			sendData: sendData
	    });

	    // Private Methods
	    function _handleError(response) {
	        if (!angular.isObject(response.data) || !response.data.message) {
	            return $q.reject("Unknown error occured!");
	        }

	        return $q.reject(response.data.message);
	    }

	    function _handleSuccess(response) {
	        return response.data;
	    }
	}]);
})();