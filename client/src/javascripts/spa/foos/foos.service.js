(function() {
  "use strict";

  angular.module("spa.foos")
    .factory("spa.foos.Foo", FooFactory);
  FooFactory.$inject = ["$resource", "spa.APP_CONFIG"];

  function FooFactory($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/foos/:id",
      { id: '@id'},
      { update: { method: "PUT", transformRequest: buildNestedBody },
      save: { method: "POST", transformRequest: buildNestedBody } });
  }

  function buildNestedBody(data) {
    return angular.toJson({ foo: data })
  }
})();
