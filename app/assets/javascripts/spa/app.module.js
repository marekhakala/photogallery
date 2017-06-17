(function() {
  "use strict";

  angular
    .module("spa", [
      "ui.router",
      "spa.config",
      "spa.authn",
      "spa.authz",
      "spa.layout",
      "spa.foos",
      "spa.subjects"
    ]);
})();
