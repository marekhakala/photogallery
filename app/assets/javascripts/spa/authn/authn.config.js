(function() {
  "use strict";

  angular.module("spa.authn")
    .config(AuthnConfig);
  AuthnConfig.$inject = ["$authProvider", "spa.config.APP_CONFIG"];

  function AuthnConfig($authProvider, APP_CONFIG) {
    $authProvider.configure({ apiUrl: APP_CONFIG.server_url });
  }
})();
