(function() {
  "use strict";

  angular.module("spa.layout")
    .component("sdAreas", {
      templateUrl: areasTemplateUrl,
      controller: AreasController,
      transclude: true
    })
    .component("sdArea", {
      templateUrl: areaTemplateUrl,
      controller: AreaController,
      transclude: true,
      bindings: { label: "@", position: "@" },
      require: { areasController: "^^sdAreas" }
    })
    .directive("sdAreasSide", [function() {
      return {
        controller: AreasSideController,
        controllerAs: "sideVM",
        bindToController: true,
        restrict: "A",
        scope: false,
        require: { areas: "^sdAreas" } }
    }]);

  areasTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
  function areasTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.areas_html;
  }

  areaTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
  function areaTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.area_html;
  }

  AreasController.$inject = ["$scope"];
  function AreasController($scope) {
    var vm = this;
    vm.areas = [];
    vm.areasLeft = [];
    vm.areasRight = [];

    vm.$onInit = function() {}

    return;
  }

  AreasController.prototype.addArea = function(area) {
    this.areas.push(area);
    if (area.position === "left") {
      this.areasLeft.push(area);
    } else if (area.position === "right") {
      this.areasRight.push(area);
    }
  }

  AreasController.prototype.getAreas = function(position) {
    var collection = null;

    if (position === "left") {
      collection = this.areasLeft;
    } else if (position === "right") {
      collection = this.areasRight;
    }

    return collection;
  }

  AreasController.prototype.countActive = function(position) {
    var collection = this.getAreas(position);
    var areasActive = 0;

    angular.forEach(collection, function(area) {
      if (area.show) { areasActive += 1; }
    });

    return areasActive;
  }

  AreaController.$inject = ["$scope"];
  function AreaController($scope) {
    var vm = this;
    vm.show = true;
    vm.isExpanded = isExpanded;

    vm.$onInit = function() {
      vm.areasController.addArea(vm);
    }
    return;

    function isExpanded() {
      var result = vm.show && vm.areasController.countActive(vm.position) === 1;
      return result;
    }
  }

  AreasSideController.$inject = [];
  function AreasSideController() {
    var vm = this;
    vm.isHidden = isHidden;

    vm.$onInit = function() {}
    return;

    function isHidden(position) {
      var result = vm.areas.countActive(position) === 0;
      return result;
    }
  }
})();
