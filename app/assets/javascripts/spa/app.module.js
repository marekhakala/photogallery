(function() {
  "use strict";

  var app = angular.module("spa", [
      "ui.router",
      "ngFileUpload",
      "uiCropper",
      "spa.config",
      "spa.authn",
      "spa.authz",
      "spa.geoloc",
      "spa.layout",
      "spa.foos",
      "spa.subjects"
    ]);

  app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  });
})();
