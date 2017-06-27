(function() {
  "use strict";

  angular.module("spa.authn")
    .component("sdSignup", { templateUrl: templateUrl, controller: SignupController });

  templateUrl.$inject = ["spa.config.APP_CONFIG"];
  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.authn_signup_html;
  }

  SignupController.$inject = ["$scope", "$state", "spa.authn.Authn"];
  function SignupController($scope, $state, Authn) {
    var vm = this;
    vm.signupForm = {}
    vm.signup = signup;
    vm.getCurrentUser = Authn.getCurrentUser;
    vm.getCurrentUserName = Authn.getCurrentUserName;

    vm.$onInit = function() {
      console.log("SignupController",$scope);
    }
    vm.$postLink = function() {
      vm.dropdown = $("#login-dropdown");
    }
    return;

    function signup() {
      console.log("signup ...");
      $scope.signup_form.$setPristine();

      Authn.signup(vm.signupForm).then(
        function(response) {
          vm.id = response.data.data.id;
          console.log("signup complete", response.data, vm);
          vm.dropdown.removeClass("open");
          $state.go("home");
        },
        function(response) {
          vm.signupForm["errors"] = response.data.errors;
          console.log("signup failure", response, vm);
      });
    }
  }
})();
