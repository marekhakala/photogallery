(function() {
  "use strict";

  angular.module("spa.subjects")
    .factory("spa.subjects.ImageLinkableThing", ImageLinkableThing);

  ImageLinkableThing.$inject = ["$resource", "spa.config.APP_CONFIG"];
  function ImageLinkableThing($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/images/:image_id/linkable_things");
  }
})();
