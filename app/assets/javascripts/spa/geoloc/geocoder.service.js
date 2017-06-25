(function() {
  "use strict";

  angular.module("spa.geoloc")
    .service("spa.geoloc.geocoder", Geocoder);

  Geocoder.$inject = ["$resource", "spa.config.APP_CONFIG"];
  function Geocoder($resource, APP_CONFIG) {

    var addresses = $resource(APP_CONFIG.server_url + "/api/geocoder/addresses",
      {}, { get: { cache: true } });
    var positions = $resource(APP_CONFIG.server_url + "/api/geocoder/positions",
      {},{ get: { cache: true } });

    var service = this;
    service.getLocationByAddress = getLocationByAddress;
    service.getLocationByPosition = getLocationByPosition;

    return;

    function getLocationByAddress(address) {
      return addresses.get({ address: address });
    }

    function getLocationByPosition(position) {
      if(!position)
        return positions.get({ lng: 0.0, lat: 0.0 });
        
      return positions.get({ lng: position.lng, lat: position.lat });
    }
  }
})();
