(function() {
  "use strict";

  angular.module("spa.subjects")
    .factory("spa.subjects.Thing", ThingFactory);

  ThingFactory.$inject = ["$resource", "spa.config.APP_CONFIG"];
  function ThingFactory($resource, APP_CONFIG) {
    var service = $resource(APP_CONFIG.server_url + "/api/things/:id",
        { id: '@id' }, { update: { method: "PUT" } });
    return service;
  }
})();
