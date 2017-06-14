(function() {
  "use strict";

  angular.module("spa.layout")
    .component("sdNavbar", {
      templateUrl: templateUrl,
      controller: NavbarController
    });

  templateUrl.$inject = ["spa.config.APP_CONFIG"];

  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.navbar_html;
  }

  NavbarController.$inject = ["$scope", "spa.authn.Authn"];

  function NavbarController($scope, Authn) {
    var vm = this;
    vm.getLoginLabel = getLoginLabel;

    vm.$onInit = function() {
      console.log("NavbarController", $scope);
    }
    return;

    function getLoginLabel() {
      return Authn.isAuthenticated() ? Authn.getCurrentUserName() : "Login";
    }
  }
})();
