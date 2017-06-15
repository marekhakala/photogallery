(function() {
  "use strict";

  angular.module("spa.subjects")
    .factory("spa.subjects.Image", ImageFactory);

  ImageFactory.$inject = ["$resource", "spa.config.APP_CONFIG"];

  function ImageFactory($resource, APP_CONFIG) {
    var service = $resource(APP_CONFIG.server_url + "/api/images/:id",
      { id: '@id' }, { update: { method: "PUT" },
        save: { method: "POST", transformRequest: checkEmptyPayload } });
    return service;
  }

  function checkEmptyPayload(data) {
    if (!data['caption']) {
      data['caption'] = null;
    }

    return angular.toJson(data);
  }
})();
