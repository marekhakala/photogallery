(function() {
  "use strict";

  angular.module("spa.authn")
    .factory("spa.authn.checkMe", CheckMeFactory);

  CheckMeFactory.$inject = ["$resource", "spa.config.APP_CONFIG"];
  function CheckMeFactory($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/authn/checkme");
  }
})();
