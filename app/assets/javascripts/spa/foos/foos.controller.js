(function() {
  "use strict";

  angular.module("spa.foos")
    .controller("spa.foos.FoosController", FoosController);
  FoosController.$inject = ["spa.foos.Foo"];

  function FoosController(Foo) {
    var vm = this;

    vm.foos;
    vm.foo;
    vm.edit = edit;
    vm.create = create;
    vm.update = update;
    vm.remove = remove;

    activate();
    return;

    function activate() {
      newFoo();
      vm.foos = Foo.query();
    }

    function newFoo() {
      vm.foo = new Foo();
    }

    function handleError(response) {
      console.log(response);
    }

    function edit(object) {
      console.log("selected", object);
      vm.foo = object;
    }

    function create() {
      vm.foo.$save().then(function(response) {
        vm.foos.push(vm.foo);
        newFoo();

      }).catch(handleError);
    }

    function update() {
      vm.foo.$update()
        .then(function(response) {}).catch(handleError);
    }

    function remove() {
      vm.foo.$delete().then(function(response) {
        removeElement(vm.foos, vm.foo);
        newFoo();
      }).catch(handleError);
    }

    function removeElement(elements, element) {
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].id == element.id) {
          elements.splice(i, 1);
          break;
        }
      }
    }
  }
})();
