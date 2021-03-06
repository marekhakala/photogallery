(function() {
  "use strict";

  angular.module("spa.authn")
    .component("sdAuthnSession", {
      templateUrl: templateUrl,
      controller: AuthnSessionController
    });

  templateUrl.$inject = ["spa.config.APP_CONFIG"];

  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.authn_session_html;
  }

  AuthnSessionController.$inject = ["$scope", "spa.authn.Authn"];
  function AuthnSessionController($scope, Authn) {
    var vm = this;
    vm.loginForm = {}
    vm.login = login;
    vm.logout = logout;
    vm.getCurrentUser = Authn.getCurrentUser;
    vm.getCurrentUserName = Authn.getCurrentUserName;

    vm.$onInit = function() {}

    vm.$postLink = function() {
      vm.dropdown = $("#login-dropdown")
    }
    return;

    function login() {
      $scope.login_form.$setPristine();
      vm.loginForm["errors"] = null;

      Authn.login(vm.loginForm).then(
      function() {
        vm.dropdown.removeClass("open");
      },
      function(response) {
        vm.loginForm["errors"] = response.errors;
      });
    }

    function logout() {
      Authn.logout().then(function() {
        vm.dropdown.removeClass("open");
      });
    }
  }
})();
