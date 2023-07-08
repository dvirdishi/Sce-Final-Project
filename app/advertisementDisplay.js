let app = angular.module('app', []);
	app.controller('advertisementDisplayController', ['$scope', function ($scope) {

		$scope.previmg = null;
		$scope.adimage = null;
		
		let updateAdImage = (adImage) => {
            $scope.previmg = $scope.adimage;
			$scope.adimage = '/public/images/advertisements/';
			$scope.$apply();
		}

		var socket = io();
		socket.on('stream', function (data) {
			updateAdImage(data.adImage);
		});
		  
    }]);
    
    app.directive("imageChange", function ($timeout) {
        return {
            restrict: "A",
            scope: {},
            link: function (scope, element, attrs) {
                element.on("load", function () {
                    $timeout(function () {
                        element.removeClass("ng-hide-fade");
                        element.addClass("ng-show");
                    }, 500);
                });
                attrs.$observe("ngSrc", function () {
                   element.removeClass("ng-show");
                    element.addClass("ng-hide-fade");
                });
            }
        }
    });
    