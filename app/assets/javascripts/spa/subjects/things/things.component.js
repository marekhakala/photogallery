(function() {
  "use strict";

  angular.module("spa.subjects")
    .component("sdThingEditor", {
      templateUrl: thingEditorTemplateUrl,
      controller: ThingEditorController,
      bindings: { authz: "<" },
      require: {
        thingsAuthz: "^sdThingsAuthz"
      }
    }).component("sdThingSelector", {
      templateUrl: thingSelectorTemplateUrl,
      controller: ThingSelectorController,
      bindings: { authz: "<" }
    });

  thingEditorTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
  function thingEditorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_editor_html;
  }

  thingSelectorTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
  function thingSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_selector_html;
  }

  ThingEditorController.$inject = [ "$scope", "$q", "$state", "$stateParams",
                                    "spa.authz.Authz", "spa.subjects.Thing", "spa.subjects.ThingImage" ];
  function ThingEditorController($scope, $q, $state, $stateParams, Authz, Thing, ThingImage) {
    var vm = this;
    vm.create = create;
    vm.clear = clear;
    vm.update = update;
    vm.remove = remove;
    vm.haveDirtyLinks = haveDirtyLinks;
    vm.updateImageLinks = updateImageLinks;

    vm.$onInit = function() {
      $scope.$watch(function() { return Authz.getAuthorizedUserId(); },
        function() {
          if ($stateParams.id) {
            reload($stateParams.id);
          } else {
            newResource();
          }
        });
    }
    return;

    function newResource() {
      vm.item = new Thing();
      vm.thingsAuthz.newItem(vm.item);
      return vm.item;
    }

    function reload(thingId) {
      var itemId = thingId ? thingId : vm.item.id;
      vm.images = ThingImage.query({ thing_id: itemId });
      vm.item = Thing.get({ id: itemId });
      vm.thingsAuthz.newItem(vm.item);
      vm.images.$promise.then(function() {
        angular.forEach(vm.images, function(ti) {
          ti.originalPriority = ti.priority;
        });
      });

      $q.all([vm.item.$promise,vm.images.$promise]).catch(handleError);
    }

    function haveDirtyLinks() {
      for (var i = 0; vm.images && i < vm.images.length; i++) {
        var ti = vm.images[i];

        if (ti.toRemove || ti.originalPriority != ti.priority) {
          return true;
        }
      }
      return false;
    }

    function create() {
      vm.item.errors = null;
      vm.item.$save().then(function() {
        $state.go(".",{ id: vm.item.id });
      }, handleError);
    }

    function clear() {
      newResource();
      $state.go(".", { id: null });
    }

    function update() {
      vm.item.errors = null;
      var update = vm.item.$update();
      updateImageLinks(update);
    }

    function updateImageLinks(promise) {
      var promises = [];

      if (promise) { promises.push(promise); }
        angular.forEach(vm.images, function(ti) {
          if (ti.toRemove) {
            promises.push(ti.$remove());
          } else if (ti.originalPriority != ti.priority) {
            promises.push(ti.$update());
          }
      });

      $q.all(promises).then(function(response) {
          $scope.thingform.$setPristine();
          reload();
        }, handleError);
    }

    function remove() {
      vm.item.$remove().then(function() {
        clear();
      }, handleError);
    }

    function handleError(response) {
      console.log("error", response);

      if (response.data) {
        vm.item["errors"] = response.data.errors;
      }

      if (!vm.item.errors) {
        vm.item["errors"] = {}
        vm.item["errors"]["full_messages"] = [response];
      }

      $scope.thingform.$setPristine();
    }
  }

  ThingSelectorController.$inject = ["$scope", "$stateParams",
                                     "spa.authz.Authz", "spa.subjects.Thing"];
  function ThingSelectorController($scope, $stateParams, Authz, Thing) {
    var vm = this;

    vm.$onInit = function() {
      $scope.$watch(function() { return Authz.getAuthorizedUserId(); },
                    function() {
                      if (!$stateParams.id) {
                        vm.items = Thing.query();
                      }
                    });
    }
    return;
  }
})();
