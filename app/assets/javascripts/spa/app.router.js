(function() {
  "use strict";

  angular.module("spa").config(RouterFunction);
  RouterFunction.$inject = ["$stateProvider", "$urlRouterProvider",
                            "spa.config.APP_CONFIG"];

  function RouterFunction($stateProvider, $urlRouterProvider, APP_CONFIG) {
    $urlRouterProvider.otherwise("/subjects");

    $stateProvider
    .state("home", {
      url: "/subjects",
      templateUrl: APP_CONFIG.subjects_page_html,
      data: { pageTitle: APP_CONFIG.page_title_base + " - " + APP_CONFIG.page_title_subjects }
    })
    .state("accountSignup", {
      url: "/signup",
      templateUrl: APP_CONFIG.signup_page_html,
      data: { pageTitle: APP_CONFIG.page_title_base + " - " + APP_CONFIG.page_title_sign_up }
    })
    .state("authn", {
      url: "/authn",
      templateUrl: APP_CONFIG.authn_page_html,
      data: { pageTitle: APP_CONFIG.page_title_base + " - " + APP_CONFIG.page_title_authn }
    })
    .state("images", {
      url: "/images/:id",
      templateUrl: APP_CONFIG.images_page_html,
      data: { pageTitle: APP_CONFIG.page_title_base + " - " + APP_CONFIG.page_title_images }
    })
    .state("things", {
      title: "Things",
      url: "/things/:id",
      templateUrl: APP_CONFIG.things_page_html,
      data: { pageTitle: APP_CONFIG.page_title_base + " - " + APP_CONFIG.page_title_things }
    })
    .state("tags", {
      title: "Tags",
      url: "/tags/:id",
      templateUrl: APP_CONFIG.tags_page_html,
      data: { pageTitle: APP_CONFIG.page_title_base + " - " + APP_CONFIG.page_title_tags }
    })
    .state("foos",{
      title: "Foos",
      url: "/foos",
      templateUrl: APP_CONFIG.main_page_html,
      data: { pageTitle: APP_CONFIG.page_title_base + " - " + APP_CONFIG.page_title_foos }
    });
  }
})();
