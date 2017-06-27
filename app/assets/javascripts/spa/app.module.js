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

  app.directive('title', ['$rootScope', '$timeout', function($rootScope, $timeout) {
        return { link: function() {
            var listener = function(event, toState) {
              $timeout(function() {
                $rootScope.pageTitle = (toState.data && toState.data.pageTitle) ? toState.data.pageTitle : 'Photo Gallery';
              });
            };
            $rootScope.$on('$stateChangeSuccess', listener);
          } };
      }
  ]);

  app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  });
})();
