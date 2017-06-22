(function() {
  "use strict";

  angular.module("spa.geoloc")
    .component("sdCurrentOriginSelector", {
      templateUrl: templateUrl,
      controller: CurrentOriginSelectorController
  });

  templateUrl.$inject = ["spa.config.APP_CONFIG"];
  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.current_origin_selector_html;
  }

  CurrentOriginSelectorController.$inject = ["$scope",
                                             "spa.geoloc.geocoder",
                                             "spa.geoloc.currentOrigin",
                                             "spa.geoloc.myLocation"];
  function CurrentOriginSelectorController($scope, geocoder, currentOrigin, myLocation) {
    var vm = this;
    vm.lookupAddress = lookupAddress;
    vm.getOriginAddress = getOriginAddress;
    vm.clearOrigin = clearOrigin;
    vm.isCurrentLocationSupported = myLocation.isCurrentLocationSupported;
    vm.useCurrentLocation = useCurrentLocation;
    vm.myPositionError = null;
    vm.changeDistance = changeDistance;

    vm.$onInit = function() {
      console.log("CurrentOriginSelectorController",$scope);
    }
    return;

    function lookupAddress() {
      console.log("lookupAddress for", vm.address);
      geocoder.getLocationByAddress(vm.address).$promise.then(
        function(location) {
          currentOrigin.setLocation(location);
          console.log("location", location);
        });
    }

    function getOriginAddress() {
      return currentOrigin.getFormattedAddress();
    }

    function clearOrigin() {
      return currentOrigin.clearLocation();
    }

    function changeDistance() {
      currentOrigin.setDistance(vm.distanceLimit);
    }

    function useCurrentLocation() {
      myLocation.getCurrentLocation().then(
        function(location) {
          console.log("useCurrentLocation", location);
          currentOrigin.setLocation(location);
          vm.myPositionError = null;
        },
        function(err) {
          console.log(err);
          vm.myPositionError = err;
        });
    }
  }
})();
