(function () {
    "use strict";

    angular.module("ASPO").controller('PageCtrl', ["$location", function ($location) {
        var that = this;
		
		that.menuItems = [
			{
				text: 'Vprašalnik',
				link: '#/survey',
				icon: 'questions-css.svg',
			},
			{
				text: 'Opis spolno prenosljivih okužb',
				link: '#/std-info',
				icon: 'virus-css.svg',
			},
			{
				text: 'Simptomi',
				link: '#/symptoms',
				icon: 'doctor-css.svg',
			},
			{
				text: 'Pregled pri zdravniku',
				link: '#/medical-examination',
				icon: 'doctor-css.svg',
			},
			{
				text: 'Zaščita',
				link: '#/protection',
				icon: 'safety-css.svg',
			},
			{
				text: 'O nas',
				link: '#/about-us',
				icon: 'group-css.svg',
			},
		]
		
		that.show = false;
		
		that.close = function() {
			$location.path("/");
			that.show = false;
		}
		
		that.navigate = function() {
			that.show = true;
		}
		
		that.show = $location.url().length > 1 ;
	}]);
})();
