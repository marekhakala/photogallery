(function() {
  "use strict";

  angular.module("spa.geoloc")
    .config(JhuLocationOverride);

  JhuLocationOverride.$inject = ["spa.geoloc.myLocationProvider"];
  function JhuLocationOverride(myLocationProvider) {
    myLocationProvider.usePositionOverride({
       longitude: -76.6200464, latitude: 39.3304957 });
  }
})();
