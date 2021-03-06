(function() {
  'use strict';

  angular.module("spa.subjects")
      .component("sdCurrentTags", {
        templateUrl: currentTagsTemplateUrl,
        controller: currentTagsController
  });

  currentTagsTemplateUrl.$inject = ["spa.config.APP_CONFIG"];
  function currentTagsTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.current_tag_html;
  }

  currentTagsController.$inject = ["spa.subjects.Tag", "spa.subjects.currentSubjects"];
  function currentTagsController(Tag, currentSubjects) {
    var vm = this;

    vm.tags = [];
    vm.selected = null;
    vm.select = select;

    Tag.query().$promise.then(function(x, d) {
        vm.tags = x;
        select(vm.tags[0]);
    });

    function select(tag) {
      if (tag == vm.selected) {
        vm.selected = null;
        return;
      }

      vm.selected = tag;
      currentSubjects.filterByTag(tag);
    }
  }
}());
