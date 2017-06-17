(function() {
  "use strict";

  angular.module("spa.subjects")
    .factory("spa.subjects.ThingsAuthz", ThingsAuthzFactory);

  ThingsAuthzFactory.$inject = ["spa.authz.Authz",
                                "spa.authz.BasePolicy"];
  function ThingsAuthzFactory(Authz, BasePolicy) {
    function ThingsAuthz() {
      BasePolicy.call(this, "Thing");
    }

    ThingsAuthz.prototype = Object.create(BasePolicy.prototype);
    ThingsAuthz.constructor = ThingsAuthz;

    ThingsAuthz.prototype.canQuery = function() {
      return Authz.isAuthenticated();
    };

    ThingsAuthz.prototype.canAddImage = function(thing) {
      return Authz.isMember(thing);
    };

    ThingsAuthz.prototype.canUpdateImage = function(thing) {
      return Authz.isOrganizer(thing)
    };

    ThingsAuthz.prototype.canRemoveImage = function(thing) {
      return Authz.isOrganizer(thing) || Authz.isAdmin();
    };

    return new ThingsAuthz();
  }
})();
