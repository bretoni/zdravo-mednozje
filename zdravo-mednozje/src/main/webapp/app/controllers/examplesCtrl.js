(function () {
    "use strict";

    angular.module("ASPO").controller('ExamplesCtrl', ["$scope", "$routeParams",
	function ($scope, $routeParams) {
        var that = this;
		
		$scope.file = !$routeParams.view ? "" : $routeParams.view;
		$scope.urlFile = 'app/pages/' + $scope.file + '.md';
		
		$scope.pages = [
		{
			name: 'Example 1',
			link: 'example-1',
		}];
	}]);
})();