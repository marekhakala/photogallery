(function() {
  "use strict";

  angular.module("spa.layout")
    .component("sdImageLoader", {
      templateUrl: templateUrl,
      controller: ImageLoaderController,
      bindings: { resultDataUri: "&" },
      transclude: true
  });

  templateUrl.$inject = ["spa.config.APP_CONFIG"];
  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.image_loader_html;
  }

  ImageLoaderController.$inject = ["$scope"];
  function ImageLoaderController($scope) {
    var vm = this;
    vm.debug = debug;

    vm.$onInit = function() {
      console.log("ImageLoaderController",$scope);
      $scope.$watch(function() { return vm.dataUri },
                    function() { vm.resultDataUri({ dataUri: vm.dataUri }); });
    }
    return;

    function debug() {
      console.log("ImageLoaderController", $scope);
    }
  }
})();
