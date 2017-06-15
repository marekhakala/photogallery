(function() {
  "use strict";

  angular.module("spa.subjects")
    .factory("spa.subjects.ImageThing", ImageThing);

  ImageThing.$inject = ["$resource", "spa.config.APP_CONFIG"];
  function ImageThing($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/images/:image_id/thing_images");
  }
})();
