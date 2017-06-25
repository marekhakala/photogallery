(function() {
  "use strict";

  angular.module("spa.geoloc")
    .provider("spa.geoloc.myLocation", MyLocationProvider);

  MyLocationProvider.$inject = [];
  function MyLocationProvider() {
    var provider = this;

    provider.usePositionOverride = function(coords) {
      provider.positionOverride = coords;
    }

    function MyLocation() {}

    provider.$get = ["$window", "$q", "spa.geoloc.geocoder",
     function($window, $q, geocoder) {

      MyLocation.prototype.isCurrentLocationSupported = function() {
        return $window.navigator.geolocation != null;
      }

      MyLocation.prototype.getCurrentLocation = function() {
        var service = this;
        var deferred = $q.defer();

        if (!this.isCurrentLocationSupported()) {
          deferred.reject("geolocation not supported by browser");
        } else {
          $window.navigator.geolocation.getCurrentPosition(
            function(position) { service.geocodeGeoposition(deferred, position); },
            function(err) { deferred.reject(err); }, { timeout: 10000 } );
        }

        return deferred.promise;
      }

      MyLocation.prototype.geocodeGeoposition = function(deferred, position) {
        var pos = provider.positionOverride ? provider.positionOverride : position.coords;

        geocoder.getLocationByPosition({ lng:pos.longitude, lat:pos.latitude }).$promise.then(
          function geocodeSuccess(location) {
            console.log("locationResult", location);
            deferred.resolve(location);
          }, function geocodeFailure(err){
            deferred.reject(err);
          });
      }

      return new MyLocation();
    }];

    return;
  }
})();
