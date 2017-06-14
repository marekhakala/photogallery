(function() {
  "use strict";

  angular.module("spa.authn")
    .factory("spa.authn.whoAmI", WhoAmIFactory);

  WhoAmIFactory.$inject = ["$resource", "spa.config.APP_CONFIG"];
  function WhoAmIFactory($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/authn/whoami");
  }
})();
