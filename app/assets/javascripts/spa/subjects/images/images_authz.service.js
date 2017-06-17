(function() {
  "use strict";

  angular.module("spa.subjects")
    .factory("spa.subjects.ImagesAuthz", ImagesAuthzFactory);

  ImagesAuthzFactory.$inject = ["spa.authz.Authz", "spa.authz.BasePolicy"];
  function ImagesAuthzFactory(Authz, BasePolicy) {
    function ImagesAuthz() {
      BasePolicy.call(this, "Image");
    }

    ImagesAuthz.prototype = Object.create(BasePolicy.prototype);
    ImagesAuthz.constructor = ImagesAuthz;

    ImagesAuthz.prototype.canCreate = function() {
      return Authz.isAuthenticated();
    };

    return new ImagesAuthz();
  }
})();
