(function() {
  "use strict";

  angular.module("spa.authz")
    .service("spa.authz.Authz", Authz);

  Authz.$inject = [ "$rootScope", "$q",
      "spa.authn.Authn", "spa.authn.whoAmI" ];

  function Authz($rootScope, $q, Authn, whoAmI) {
    var service = this;

    service.user = null;
    service.userPromise = null;
    service.admin = false;
    service.originator = []

    service.getAuthorizedUser = getAuthorizedUser;
    service.getAuthorizedUserId = getAuthorizedUserId;
    service.isAuthenticated = isAuthenticated;
    service.isAdmin = isAdmin;
    service.isOriginator = isOriginator;
    service.isOrganizer = isOrganizer;
    service.isMember = isMember;
    service.hasRole = hasRole;

    activate();
    return;

    function activate() {
      $rootScope.$watch(function() { return Authn.getCurrentUserId(); }, newUser);
    }

    function newUser() {
      var deferred = $q.defer();
      service.userPromise = deferred.promise;
      service.user = null;

      service.admin = false;
      service.originator = [];

      whoAmI.get().$promise.then(
        function(response) { processUserRoles(response, deferred); },
        function(response) { processUserRoles(response, deferred); });
    }

    function processUserRoles(response, deferred) {
      angular.forEach(response.user_roles, function(value) {
        if (value.role_name == "admin") {
          service.admin = true;
        } else if (value.role_name == "originator") {
          service.originator.push(value.resource);
        }
      });

      service.user = response;
      service.userPromise = null;
      deferred.resolve(response);
    }

    function getAuthorizedUser() {
      var deferred = $q.defer();
      var promise = service.userPromise;

      if (promise) {
        promise.then(
          function() { deferred.resolve(service.user); },
          function() { deferred.reject(service.user); });
      } else {
        deferred.resolve(service.user);
      }

      return deferred.promise;
    }

    function getAuthorizedUserId() {
      return service.user && !service.userPromise ? service.user.id : null;
    }

    function isAuthenticated() {
      return getAuthorizedUserId() != null;
    }

    function isAdmin() {
      return service.user && service.admin && true;
    }

    function isOriginator(resource) {
      return service.user && service.originator.indexOf(resource) >= 0;
    }

    function isOrganizer(item) {
      return !item ? false : hasRole(item.user_roles, 'organizer');
    }

    function isMember(item) {
      return !item ? false : hasRole(item.user_roles, 'member') || isOrganizer(item);
    }

    function hasRole(user_roles, role) {
      if (role) {
        return !user_roles ? false : user_roles.indexOf(role) >= 0;
      } else {
        return !user_roles ? true : user_roles.length == 0;
      }
    }
  }
})();
